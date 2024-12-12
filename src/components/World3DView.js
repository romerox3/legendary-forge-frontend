import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import useWorldState from '../hooks/useWorldState';

const World3DView = () => {
    const mountRef = useRef(null);
    const [hoveredEntity, setHoveredEntity] = useState(null);
    const { worldState } = useWorldState();
    const entitiesRef = useRef({});
    const sceneRef = useRef(null);
    const cameraRef = useRef(null);
    const rendererRef = useRef(null);
    const labelRendererRef = useRef(null);
    const controlsRef = useRef(null);
    const entitiesGroupRef = useRef(null);
    const resourcesGroupRef = useRef(null);

    const createEntity = useCallback((entidad) => {
        const geometry = new THREE.SphereGeometry(0.5, 32, 32);
        const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
        const sphere = new THREE.Mesh(geometry, material);
        sphere.position.set(entidad.posicion_x, 1, entidad.posicion_y);
        sphere.userData = { type: 'entity', data: entidad };

        const energyBar = new THREE.Mesh(
            new THREE.BoxGeometry(1, 0.1, 0.1),
            new THREE.MeshBasicMaterial({ color: 0xff0000 })
        );
        energyBar.position.y = 1;
        sphere.add(energyBar);

        const nameDiv = document.createElement('div');
        nameDiv.className = 'label';
        nameDiv.textContent = entidad.nombre;
        nameDiv.style.marginTop = '-1em';
        const nameLabel = new CSS2DObject(nameDiv);
        nameLabel.position.set(0, 1.5, 0);
        sphere.add(nameLabel);

        return sphere;
    }, []);

    const createResource = useCallback((recurso, tipo) => {
        let color;
        switch (tipo) {
            case 'comida': color = 0x9400D3; break;
            case 'agua': color = 0x0000FF; break;
            case 'arboles': color = 0x006400; break;
            default: color = 0xFFFFFF;
        }
        const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
        const material = new THREE.MeshStandardMaterial({ color });
        const cube = new THREE.Mesh(geometry, material);
        cube.position.set(recurso[1], 0.25, recurso[2]);
        cube.userData = { type: 'resource', data: { tipo, cantidad: recurso[0] } };
        return cube;
    }, []);

    const updateWorld = useCallback(() => {
        if (worldState && worldState.entidades && entitiesGroupRef.current) {
            worldState.entidades.forEach(entidad => {
                let entityMesh = entitiesRef.current[entidad.nombre];
                if (!entityMesh) {
                    entityMesh = createEntity(entidad);
                    entitiesGroupRef.current.add(entityMesh);
                    entitiesRef.current[entidad.nombre] = entityMesh;
                }
                entityMesh.userData.targetPosition = new THREE.Vector3(entidad.posicion_x, 1, entidad.posicion_y);
            });
        }

        if (worldState && worldState.recursos && resourcesGroupRef.current) {
            resourcesGroupRef.current.clear();
            Object.entries(worldState.recursos).forEach(([tipo, recursos]) => {
                recursos.forEach(recurso => {
                    const resourceMesh = createResource(recurso, tipo);
                    resourcesGroupRef.current.add(resourceMesh);
                });
            });
        }
    }, [worldState, createEntity, createResource]);

    useEffect(() => {
        const scene = new THREE.Scene();
        sceneRef.current = scene;

        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        cameraRef.current = camera;

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        rendererRef.current = renderer;

        const labelRenderer = new CSS2DRenderer();
        labelRendererRef.current = labelRenderer;

        renderer.setSize(window.innerWidth, window.innerHeight);
        labelRenderer.setSize(window.innerWidth, window.innerHeight);
        mountRef.current.appendChild(renderer.domElement);
        mountRef.current.appendChild(labelRenderer.domElement);

        const controls = new OrbitControls(camera, renderer.domElement);
        controlsRef.current = controls;
        controls.enableDamping = true;
        controls.dampingFactor = 0.25;
        controls.screenSpacePanning = false;
        controls.maxPolarAngle = Math.PI / 2;

        // Cargar la posición de la cámara guardada
        const savedCameraState = JSON.parse(localStorage.getItem('cameraState'));
        if (savedCameraState) {
            camera.position.set(savedCameraState.position.x, savedCameraState.position.y, savedCameraState.position.z);
            camera.rotation.set(savedCameraState.rotation.x, savedCameraState.rotation.y, savedCameraState.rotation.z);
            controls.target.set(savedCameraState.target.x, savedCameraState.target.y, savedCameraState.target.z);
        } else {
            camera.position.set(0, 50, 100);
            camera.lookAt(0, 0, 0);
        }

        // Crear el plano del mundo
        const planeGeometry = new THREE.PlaneGeometry(200, 200);
        const planeMaterial = new THREE.MeshStandardMaterial({ color: 0x999999 });
        const plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.rotation.x = -Math.PI / 2;
        scene.add(plane);

        // Añadir luz
        const ambientLight = new THREE.AmbientLight(0x404040);
        scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(1, 1, 1);
        scene.add(directionalLight);

        // Crear grupos para entidades y recursos
        const entitiesGroup = new THREE.Group();
        const resourcesGroup = new THREE.Group();
        entitiesGroupRef.current = entitiesGroup;
        resourcesGroupRef.current = resourcesGroup;
        scene.add(entitiesGroup);
        scene.add(resourcesGroup);

        // Raycaster para interacción
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        const onMouseMove = (event) => {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(entitiesGroup.children);

            if (intersects.length > 0) {
                const entity = intersects[0].object.userData.data;
                setHoveredEntity(entity);
            } else {
                setHoveredEntity(null);
            }
        };

        window.addEventListener('mousemove', onMouseMove);

        // Función de animación
        const animate = () => {
            requestAnimationFrame(animate);
            controls.update();

            // Interpolar el movimiento de las entidades
            Object.values(entitiesRef.current).forEach(entityMesh => {
                if (entityMesh.userData.targetPosition) {
                    entityMesh.position.lerp(entityMesh.userData.targetPosition, 0.1);
                }
            });

            renderer.render(scene, camera);
            labelRenderer.render(scene, camera);

            // Guardar el estado de la cámara
            localStorage.setItem('cameraState', JSON.stringify({
                position: camera.position,
                rotation: camera.rotation,
                target: controls.target
            }));
        };

        animate();

        // Manejar cambios de tamaño de ventana
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            labelRenderer.setSize(window.innerWidth, window.innerHeight);
        };

        window.addEventListener('resize', handleResize);

        // Limpiar
        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('resize', handleResize);
            if (mountRef.current) {
                if (renderer.domElement.parentNode === mountRef.current) {
                    mountRef.current.removeChild(renderer.domElement);
                }
                if (labelRenderer.domElement.parentNode === mountRef.current) {
                    mountRef.current.removeChild(labelRenderer.domElement);
                }
            }
        };
    }, []);

    useEffect(() => {
        updateWorld();
    }, [worldState, updateWorld]);

    return (
        <div>
            <div ref={mountRef}></div>
            {hoveredEntity && (
                <div style={{position: 'absolute', top: '10px', left: '10px', background: 'rgba(0,0,0,0.7)', color: 'white', padding: '10px'}}>
                    <h3>{hoveredEntity.nombre}</h3>
                    <p>Energía: {hoveredEntity.energia}</p>
                    <p>Puntuación: {hoveredEntity.puntuacion}</p>
                    <p>Edad: {hoveredEntity.edad}</p>
                </div>
            )}
        </div>
    );
};

export default World3DView;