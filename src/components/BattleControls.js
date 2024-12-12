import React from 'react';

function BattleControls({ isAutoPlay, setIsAutoPlay, nextTurn, currentTurn, totalTurns }) {
    return (
        <div className="battle-controls">
            <button 
                className="btn btn-primary" 
                onClick={nextTurn} 
                disabled={currentTurn === totalTurns - 1 || isAutoPlay}
            >
                Siguiente Turno
            </button>
            <button 
                className={`btn ${isAutoPlay ? 'btn-danger' : 'btn-success'}`} 
                onClick={() => setIsAutoPlay(!isAutoPlay)}
                disabled={currentTurn === totalTurns - 1}
            >
                {isAutoPlay ? 'Detener' : 'Auto Play'}
            </button>
            <span className="turn-counter">
                Turno: {currentTurn + 1} / {totalTurns}
            </span>
        </div>
    );
}

export default BattleControls;