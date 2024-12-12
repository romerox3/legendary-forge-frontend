import React from 'react';

function BattleInfo({ battleResult, currentTurn, narrative }) {
    if (!battleResult) return null;

    const round = battleResult.rounds[currentTurn];

    return (
        <div className="battle-info">
            <h3>Turno {currentTurn + 1}</h3>
            <p className="narrative">{narrative}</p>
            <div className="action-summary">
                <p>
                    <span className="attacker">{round.character1.is_attacker 
                        ? round.character1.name 
                        : round.character2.name}</span> 
                    ataca con <span className="attack">{round.attack_used}</span>
                </p>
                <p>Daño: <span className="damage">{round.damage_dealt}</span></p>
            </div>
        </div>
    );
}

export default BattleInfo;