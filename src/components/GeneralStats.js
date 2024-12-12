import { Tooltip as MuiTooltip } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faThermometerHalf, faUser, faAppleAlt, faTint, faTree } from '@fortawesome/free-solid-svg-icons';

export function GeneralStats({ worldState }) {
    if (!worldState) return null;
    return (
        <div className="general-stats">
            <h3>Estadísticas Generales</h3>
            <MuiTooltip title="Tiempo transcurrido en el mundo">
                <p><FontAwesomeIcon icon={faClock} /> Tiempo: {worldState.tiempo}</p>
            </MuiTooltip>
            <MuiTooltip title="Temperatura actual del mundo">
                <p><FontAwesomeIcon icon={faThermometerHalf} /> Temperatura: {worldState.temperatura.toFixed(2)}°C</p>
            </MuiTooltip>
            <MuiTooltip title="Número total de entidades en el mundo">
                <p><FontAwesomeIcon icon={faUser} /> Entidades: {worldState.estadisticas.total_entidades}</p>
            </MuiTooltip>
            <MuiTooltip title="Cantidad de comida disponible">
                <p><FontAwesomeIcon icon={faAppleAlt} /> Comida: {worldState.estadisticas.total_comida}</p>
            </MuiTooltip>
            <MuiTooltip title="Cantidad de agua disponible">
                <p><FontAwesomeIcon icon={faTint} /> Agua: {worldState.estadisticas.total_agua}</p>
            </MuiTooltip>
            <MuiTooltip title="Cantidad de árboles en el mundo">
                <p><FontAwesomeIcon icon={faTree} /> Árboles: {worldState.estadisticas.total_arboles}</p>
            </MuiTooltip>
            <MuiTooltip title="Energía promedio de todas las entidades">
                <p>Energía promedio: {worldState.estadisticas.promedio_energia.toFixed(2)}</p>
            </MuiTooltip>
            <MuiTooltip title="Puntuación promedio de todas las entidades">
                <p>Puntuación promedio: {worldState.estadisticas.promedio_puntuacion.toFixed(2)}</p>
            </MuiTooltip>
            <MuiTooltip title="Generación más alta alcanzada">
                <p>Generación máxima: {worldState.estadisticas.generacion_maxima}</p>
            </MuiTooltip>
            <MuiTooltip title="Mejor puntuación alcanzada por una entidad">
                <p>Mejor puntuación: {worldState.estadisticas.mejor_puntuacion.toFixed(2)}</p>
            </MuiTooltip>
            <MuiTooltip title="Peor puntuación alcanzada por una entidad">
                <p>Peor puntuación: {worldState.estadisticas.peor_puntuacion.toFixed(2)}</p>
            </MuiTooltip>
        </div>
    );
}