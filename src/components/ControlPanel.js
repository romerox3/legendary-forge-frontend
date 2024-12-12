import React from 'react';
import './ControlPanel.css';

function ControlPanel() {
    const baseUrl = 'http://localhost:8000'; // Asegúrate de que este es el puerto correcto de tu backend

    const handleAction = (action) => {
        fetch(`${baseUrl}/${action}`, { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => console.log(data.mensaje))
        .catch(error => console.error('Error:', error));
    };

    const handlePausar = () => handleAction('pausar');
    const handleReanudar = () => handleAction('reanudar');
    const handleReiniciar = () => handleAction('reiniciar');

    return (
        <div className="control-panel">
            <h3>Control de Simulación</h3>
            <button onClick={handlePausar}>Pausar</button>
            <button onClick={handleReanudar}>Reanudar</button>
            <button onClick={handleReiniciar}>Reiniciar</button>
        </div>
    );
}

export default ControlPanel;