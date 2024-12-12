import React from 'react';
import { useDrop } from 'react-dnd';
import { getImageUrl } from '../utils/imageUtils';

function EquipmentSlot({ slot, item, onEquip, onUnequip }) {
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: 'INVENTORY_ITEM',
    canDrop: (draggedItem) => draggedItem.type === slot,
    drop: (draggedItem) => onEquip(draggedItem.id, slot),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  }));

  return (
    <div 
      ref={drop} 
      className={`equipment-slot ${slot} ${isOver && canDrop ? 'highlight' : ''}`}
    >
      {item ? (
        <div className="equipped-item" onClick={() => onUnequip(slot)}>
          <img src={getImageUrl(item.no_bg_image_url)} alt={item.name} />
          <span className="item-name">{item.name}</span>
        </div>
      ) : (
        <div className="empty-slot">
          <span>{slot}</span>
        </div>
      )}
    </div>
  );
}

export default EquipmentSlot;