import { useState, useEffect, useRef } from 'react';

const useWorldState = () => {
    const [worldState, setWorldState] = useState(null);
    const [entityHistory, setEntityHistory] = useState({});
    const wsRef = useRef(null);

    useEffect(() => {
        const connectWebSocket = () => {
            const ws = new WebSocket('ws://localhost:8000/ws');
            wsRef.current = ws;

            ws.onopen = () => {
                console.log('WebSocket conectado');
            };

            ws.onmessage = (event) => {
                const data = JSON.parse(event.data);
                setWorldState(data);
                updateEntityHistory(data);
            };

            ws.onerror = (error) => {
                console.error('Error de WebSocket:', error);
            };

            ws.onclose = () => {
                console.log('WebSocket desconectado. Intentando reconectar...');
                setTimeout(connectWebSocket, 5000);
            };
        };

        connectWebSocket();

        return () => {
            if (wsRef.current) {
                wsRef.current.close();
            }
        };
    }, []);

    function updateEntityHistory(data) {
        setEntityHistory(prevHistory => {
            const newHistory = { ...prevHistory };
            data.entidades.forEach(entidad => {
                if (!newHistory[entidad.nombre]) {
                    newHistory[entidad.nombre] = { energia: [], puntuacion: [] };
                }
                newHistory[entidad.nombre].energia.push(entidad.energia);
                newHistory[entidad.nombre].puntuacion.push(entidad.puntuacion);
                if (newHistory[entidad.nombre].energia.length > 50) {
                    newHistory[entidad.nombre].energia.shift();
                    newHistory[entidad.nombre].puntuacion.shift();
                }
            });
            return newHistory;
        });
    }

    return { worldState, entityHistory };
};

export default useWorldState;