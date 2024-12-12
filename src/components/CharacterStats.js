import React from 'react';

function CharacterStats({ character1, character2, currentTurn, rounds }) {
    const currentRound = rounds[currentTurn];
    const char1Stats = currentRound.character1;
    const char2Stats = currentRound.character2;

    return (
        <div className="character-stats-comparison">
            <div className="character-stats">
                <h3>{character1.name}</h3>
                <p>HP: {char1Stats.hp} / {character1.initial_hp}</p>
                <p>Maná: {char1Stats.mana} / {character1.initial_mana}</p>
                <p>Fuerza: {character1.strength}</p>
                <p>Defensa: {character1.defense}</p>
                <p>Agilidad: {character1.agility}</p>
            </div>
            <div className="character-stats">
                <h3>{character2.name}</h3>
                <p>HP: {char2Stats.hp} / {character2.initial_hp}</p>
                <p>Maná: {char2Stats.mana} / {character2.initial_mana}</p>
                <p>Fuerza: {character2.strength}</p>
                <p>Defensa: {character2.defense}</p>
                <p>Agilidad: {character2.agility}</p>
            </div>
        </div>
    );
}

export default CharacterStats;