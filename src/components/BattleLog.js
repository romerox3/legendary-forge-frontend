import React from 'react';

function BattleLog({ rounds }) {
    return (
        <div className="battle-log">
            <h3>Registro de Batalla</h3>
            <ul>
                {rounds.map((round, index) => (
                    <li key={index}>
                        <span className="turn-number">Turno {index + 1}:</span> 
                        <span className="attacker">{round.character1.is_attacker ? round.character1.name : round.character2.name}</span> 
                        atacó con <span className="attack">{round.attack_used}</span>, 
                        causando <span className="damage">{round.damage_dealt}</span> de daño.
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default BattleLog;