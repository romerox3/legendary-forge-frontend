import React from 'react';

function CharacterSidebar({ character, currentStats }) {
    return (
        <div className="character-sidebar">
            <div className="character-portrait">
                <img src={character.image} alt={character.name} />
            </div>
            <h3>{character.name}</h3>
            <div className="character-stats">
                <p>HP: {currentStats.hp} / {character.initial_hp}</p>
                <p>Fuerza: {character.strength}</p>
                <p>Defensa: {character.defense}</p>
                <p>Agilidad: {character.agility}</p>
                <p>Maná: {currentStats.mana} / {character.initial_mana}</p>
            </div>
        </div>
    );
}

export default CharacterSidebar;