import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BattleScene from './BattleScene';
import BattleInfo from './BattleInfo';
import BattleControls from './BattleControls';
import CharacterStats from './CharacterStats';
import BattleLog from './BattleLog';
import CharacterSidebar from './CharacterSidebar';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import './Battle.css';

function Battle() {
    const [characters, setCharacters] = useState([]);
    const [characterOneId, setCharacterOneId] = useState('');
    const [characterTwoId, setCharacterTwoId] = useState('');
    const [battleResult, setBattleResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentTurn, setCurrentTurn] = useState(0);
    const [narrative, setNarrative] = useState('');
    const [isAutoPlay, setIsAutoPlay] = useState(false);
    const [hitEffect, setHitEffect] = useState(null);

    useEffect(() => {
        async function fetchCharacters() {
            try {
                const response = await axios.get('http://127.0.0.1:5000/api/characters');
                setCharacters(response.data);
                setLoading(false);
            } catch (error) {
                console.log('Error al obtener personajes:', error);
                setLoading(false);
            }
        }
        fetchCharacters();
    }, []);

    const handleBattle = async (e) => {
        e.preventDefault();
        if (!characterOneId || !characterTwoId || characterOneId === characterTwoId) {
            alert("Seleccione dos personajes diferentes.");
            return;
        }
        try {
            setLoading(true);
            const response = await axios.post('http://127.0.0.1:5000/api/battle', {
                character1_id: characterOneId,
                character2_id: characterTwoId
            });
            
            if (response.data && response.data.rounds && response.data.winner) {
                console.log('Resultado de la batalla:', response.data);
                setBattleResult(response.data);
                setCurrentTurn(0);
                setNarrative(response.data.rounds[0].narrative || '');
            } else {
                throw new Error('Respuesta de API incompleta o inválida');
            }
        } catch (error) {
            console.error('Error al iniciar la batalla:', error);
            alert('Error al iniciar la batalla. Por favor, intenta de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    const nextTurn = () => {
        if (currentTurn < battleResult.rounds.length - 1) {
            const nextTurn = currentTurn + 1;
            setCurrentTurn(nextTurn);
            setNarrative(battleResult.rounds[nextTurn].narrative || '');
            
            const round = battleResult.rounds[nextTurn];
            const defendingCharacter = round.character1.is_attacker ? round.character2 : round.character1;
            setHitEffect(defendingCharacter.name);
            setTimeout(() => setHitEffect(null), 500);
        }
    };

    useEffect(() => {
        let timer;
        if (isAutoPlay && battleResult && currentTurn < battleResult.rounds.length - 1) {
            timer = setTimeout(() => {
                nextTurn();
            }, 1000);
        }
        return () => clearTimeout(timer);
    }, [currentTurn, isAutoPlay, battleResult]);

    if (loading) {
        return <div className="text-center mt-5"><span className="spinner-border text-warning"></span>Cargando personajes...</div>;
    }

    return (
        <div className="battle-container">
            <div className="ornament-header">
                <svg className="ornament" viewBox="0 0 100 20">
                    <path d="M0 10 Q 25 0, 50 10 T 100 10 M0 10 Q 25 20, 50 10 T 100 10" />
                </svg>
            </div>
            <h1>Reino de Batallas</h1>
            {!battleResult ? (
                <form onSubmit={handleBattle} className="battle-form">
                    <h2>Batalla en Pagallas</h2>
                    <p>Elige a tus campeones para la batalla en las tierras de Pagallas</p>
                    <div className="character-selection">
                        <div className="character-select">
                            <h3>Personaje 1</h3>
                            <select 
                                value={characterOneId} 
                                onChange={(e) => setCharacterOneId(e.target.value)}
                                className="form-control"
                            >
                                <option value="">Seleccione un personaje</option>
                                {characters.map(char => (
                                    <option key={char.id} value={char.id}>{char.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="character-select">
                            <h3>Personaje 2</h3>
                            <select 
                                value={characterTwoId} 
                                onChange={(e) => setCharacterTwoId(e.target.value)}
                                className="form-control"
                            >
                                <option value="">Seleccione un personaje</option>
                                {characters.map(char => (
                                    <option key={char.id} value={char.id}>{char.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <button type="submit" className="btn">Iniciar Batalla</button>
                </form>
            ) : (
                <>
                    <div className="battle-layout">
                        <CharacterSidebar 
                            character={battleResult.character1}
                            currentStats={battleResult.rounds[currentTurn].character1}
                        />
                        <div className="battle-main">
                            <BattleScene 
                                battleResult={battleResult} 
                                currentTurn={currentTurn} 
                                hitEffect={hitEffect}
                            />
                        </div>
                        <CharacterSidebar 
                            character={battleResult.character2}
                            currentStats={battleResult.rounds[currentTurn].character2}
                        />
                    </div>
                    <BattleControls 
                                isAutoPlay={isAutoPlay}
                                setIsAutoPlay={setIsAutoPlay}
                                nextTurn={nextTurn}
                                currentTurn={currentTurn}
                                totalTurns={battleResult.rounds.length}
                            />
                    <div className="battle-info-container">
                        <BattleInfo 
                            battleResult={battleResult} 
                            currentTurn={currentTurn}
                            narrative={narrative}
                        />
                        <CharacterStats 
                            character1={battleResult.character1}
                            character2={battleResult.character2}
                            currentTurn={currentTurn}
                            rounds={battleResult.rounds}
                        />
                        <BattleLog rounds={battleResult.rounds} />
                    </div>
                </>
            )}
            <div className="ornament-footer">
                <svg className="ornament" viewBox="0 0 100 20">
                    <path d="M0 10 Q 25 0, 50 10 T 100 10 M0 10 Q 25 20, 50 10 T 100 10" />
                </svg>
            </div>
        </div>
    );
}

export default Battle;