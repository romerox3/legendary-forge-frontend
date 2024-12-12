import React from 'react';
import './GeneViewer.css';

const GeneViewer = ({ entities }) => {
    if (!entities || entities.length === 0) {
        return <div>No hay entidades para mostrar</div>;
    }

    return (
        <div className="gene-viewer">
            {entities.map((entity, index) => (
                <div key={index} className="gene-card">
                    <h3>{entity.nombre}</h3>
                    <div className="gene-grid">
                        {Object.entries(entity.genes).map(([geneName, geneValue]) => (
                            <div key={geneName} className="gene-item">
                                <span className="gene-name">{geneName}:</span>
                                <span className="gene-value">{geneValue.toFixed(2)}</span>
                                <div className="gene-bar" style={{width: `${geneValue * 50}%`}}></div>
                            </div>
                        ))}
                    </div>
                    <div className="entity-info">
                        {entity.padre_id && (   
                            <p>Padre: {entity.padre_id.nombre}</p>
                        )}
                        {entity.madre_id && (
                            <p>Madre: {entity.madre_id.nombre}</p>
                        )}
                        <p>Energía: {entity.energia.toFixed(2)}</p>
                        <p>Hambre: {entity.hambre.toFixed(2)}</p>
                        <p>Sed: {entity.sed.toFixed(2)}</p>
                        <p>Generación: {entity.generacion}</p>
                        <p>Puntuación: {entity.puntuacion.toFixed(2)}</p>
                        <p>Edad: {entity.edad}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default GeneViewer;