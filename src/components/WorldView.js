import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import './WorldView.css';
import { GeneralStats } from './GeneralStats';
import { EntityTable } from './EntityTable';
import { GeneDistribution } from './GeneDistribution';
import { LogsView } from './LogsView';
import EntityLogsView from './EntityLogsView';
import GeneViewer from './GeneViewer';
import useWorldState from '../hooks/useWorldState';
import ControlPanel from './ControlPanel';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const WORLD_WIDTH = 800;
const WORLD_HEIGHT = 600;
const WORLD_CENTER_X = WORLD_WIDTH / 2;
const WORLD_CENTER_Y = WORLD_HEIGHT / 2;
const ENTITY_RADIUS = 5;
const RESOURCE_RADIUS = 3;
const MIN_ZOOM = 0.5;
const MAX_ZOOM = 2;
const CHUNK_SIZE = 100;

function create() {
    this.add.rectangle(WORLD_CENTER_X, WORLD_CENTER_Y, WORLD_WIDTH, WORLD_HEIGHT, 0xCCCCCC);
    this.entities = this.add.group();
    this.foods = this.add.group();
    this.waters = this.add.group();
    this.trees = this.add.group();
    this.chunks = this.add.group();

    this.cameras.main.setBackgroundColor('#CCCCCC');
    this.cameras.main.setZoom(1);
    this.cameras.main.centerOn(WORLD_CENTER_X, WORLD_CENTER_Y);

    this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
        const zoom = this.cameras.main.zoom;
        this.cameras.main.setZoom(Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoom - deltaY * 0.001)));
    });

    this.input.on('pointermove', (pointer) => {
        if (pointer.isDown) {
            this.cameras.main.scrollX -= (pointer.x - pointer.prevPosition.x) / this.cameras.main.zoom;
            this.cameras.main.scrollY -= (pointer.y - pointer.prevPosition.y) / this.cameras.main.zoom;
        }
    });

    this.drawChunks = drawChunks.bind(this);
    this.updateEntities = updateEntities.bind(this);
    this.updateResources = updateResources.bind(this);

    this.drawChunks();
}

function update() {
    if (this.worldState) {
        this.updateEntities(this.worldState);
        this.updateResources(this.worldState);
    }
    this.drawChunks();
}

function drawChunks() {
    this.chunks.clear(true, true);
    const visibleStartX = Math.floor(this.cameras.main.worldView.x / CHUNK_SIZE) * CHUNK_SIZE;
    const visibleStartY = Math.floor(this.cameras.main.worldView.y / CHUNK_SIZE) * CHUNK_SIZE;
    const visibleEndX = Math.ceil((this.cameras.main.worldView.x + this.cameras.main.worldView.width) / CHUNK_SIZE) * CHUNK_SIZE;
    const visibleEndY = Math.ceil((this.cameras.main.worldView.y + this.cameras.main.worldView.height) / CHUNK_SIZE) * CHUNK_SIZE;

    for (let x = visibleStartX; x < visibleEndX; x += CHUNK_SIZE) {
        for (let y = visibleStartY; y < visibleEndY; y += CHUNK_SIZE) {
            const chunk = this.add.rectangle(x, y, CHUNK_SIZE, CHUNK_SIZE, 0xFFFFFF, 0.1);
            chunk.setStrokeStyle(1, 0x000000, 0.2);
            this.chunks.add(chunk);
        }
    }
}

function updateEntities(worldState) {
    const existingEntities = new Set(this.entities.getChildren().map(child => child.entityId));

    worldState.entidades.forEach(entidad => {
        const x = entidad.posicion_x;
        const y = entidad.posicion_y;

        let entityContainer = this.entities.getChildren().find(child => child.entityId === entidad.nombre);

        if (!entityContainer) {
            entityContainer = this.add.container(x, y);
            const entitySprite = this.add.circle(0, 0, ENTITY_RADIUS, 0xFFFFFF);
            const entityText = this.add.text(0, ENTITY_RADIUS + 2, entidad.nombre, { fontSize: '10px', fill: '#000' });
            entityText.setOrigin(0.5, 0);
            entityContainer.add([entitySprite, entityText]);
            entityContainer.entityId = entidad.nombre;
            this.entities.add(entityContainer);
        }

        entityContainer.setPosition(x, y);
        const energyPercentage = entidad.energia / 100;
        const red = Math.floor(255 * (1 - energyPercentage));
        const green = Math.floor(255 * energyPercentage);
        entityContainer.list[0].setFillStyle(Phaser.Display.Color.GetColor(red, green, 0));

        existingEntities.delete(entidad.nombre);
    });

    existingEntities.forEach(id => {
        const containerToRemove = this.entities.getChildren().find(child => child.entityId === id);
        if (containerToRemove) {
            this.entities.remove(containerToRemove, true, true);
        }
    });
}

function updateResources(worldState) {
    const resourceGroups = {
        comida: { group: this.foods, color: 0x9400D3 },
        agua: { group: this.waters, color: 0x0000FF },
        arboles: { group: this.trees, color: 0x006400 }
    };

    Object.entries(resourceGroups).forEach(([resourceType, { group, color }]) => {
        group.clear(true, true);
        worldState.recursos[resourceType].forEach(resource => {
            const x = resource[1];
            const y = resource[2];
            const resourceSprite = this.add.circle(x, y, RESOURCE_RADIUS, color);
            group.add(resourceSprite);
        });
    });
}

function WorldView() {
    const gameRef = useRef(null);
    const { worldState, entityHistory } = useWorldState();

    useEffect(() => {
        const config = {
            type: Phaser.AUTO,
            width: WORLD_WIDTH,
            height: WORLD_HEIGHT,
            parent: 'phaser-game',
            scene: {
                create: function () {
                    create.call(this);
                },
                update: function () {
                    update.call(this);
                }
            }
        };

        const game = new Phaser.Game(config);
        gameRef.current = game;

        return () => {
            if (game) {
                game.destroy(true);
            }
        };
    }, []);

    useEffect(() => {
        if (gameRef.current && gameRef.current.scene.scenes[0]) {
            gameRef.current.scene.scenes[0].worldState = worldState;
        }
    }, [worldState]);

    const chartOptions = {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true
            }
        }
    };

    return (
        <div className="world-view">
            <h2>Visualización del Mundo</h2>
            <div id="phaser-game"></div>
            <ControlPanel />
            <Tabs
                align="center"
                selectedTabClassName="react-tabs__tab--selected"
                selectedTabPanelClassName="react-tabs__tab-panel--selected"
            >
                <TabList>
                    <Tab>Estadísticas Generales</Tab>
                    <Tab>Genes</Tab>
                    <Tab>Mejores Entidades</Tab>
                    <Tab>Distribución de Genes</Tab>
                    <Tab>Logs del mundo</Tab>
                    <Tab>Logs de las entidades</Tab>
                </TabList>
    
                <TabPanel>
                    <GeneralStats worldState={worldState} />
                </TabPanel>
        
                <TabPanel>
                    <GeneViewer 
                        entities={worldState ? worldState.entidades : null} 
                    />
                </TabPanel>

                <TabPanel>
                    <EntityTable 
                        entities={worldState ? worldState.mejores_entidades : []} 
                        entityHistory={entityHistory}
                        chartOptions={chartOptions}
                    />
                </TabPanel>
    
                <TabPanel>
                    <GeneDistribution 
                        distributionData={worldState ? worldState.distribucion_genes : null} 
                    />
                </TabPanel>
    
                <TabPanel>
                    <LogsView logs={worldState ? worldState.logs : []} />
                </TabPanel>
                <TabPanel>
                    <EntityLogsView logs={worldState ? worldState.logs_entidades : {}} />
                </TabPanel>
            </Tabs>
        </div>
    );
}

export default WorldView;