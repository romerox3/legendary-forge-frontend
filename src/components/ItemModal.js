import React from 'react';
import './ItemModal.css';
import { getImageUrl } from '../utils/imageUtils';

function ItemModal({ item, onClose }) {
  return (
    <div className="item-modal-overlay" onClick={onClose}>
      <div className="item-modal-content" onClick={e => e.stopPropagation()}>
        <h2>{item.name}</h2>
        <img src={getImageUrl(item.image_url)} alt={item.name} className="item-image" />
        <p className="item-description">{item.description}</p>
        <div className="item-stats">
          <p>Tipo: <span>{item.item_type}</span></p>
          <p>Fuerza: <span>{item.strength_bonus}</span></p>
          <p>Defensa: <span>{item.defense_bonus}</span></p>
          <p>Agilidad: <span>{item.agility_bonus}</span></p>
          <p>Salud: <span>{item.health_bonus}</span></p>
          <p>Probabilidad de esquivar: <span>{item.dodge_bonus}%</span></p>
          <p>Probabilidad de crítico: <span>{item.critical_chance_bonus}%</span></p>
          {item.aura && <p>Aura: <span>{item.aura}</span></p>}
        </div>
        <button onClick={onClose} className="close-button">Cerrar</button>
      </div>
    </div>
  );
}

export default ItemModal;