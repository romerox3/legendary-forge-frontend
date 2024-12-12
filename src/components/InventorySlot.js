import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { getImageUrl } from '../utils/imageUtils';

function InventorySlot({ index, item, onItemClick, moveItem }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'INVENTORY_ITEM',
    item: { id: item.id, index, type: item.item_type },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const [, drop] = useDrop(() => ({
    accept: 'INVENTORY_ITEM',
    hover: (draggedItem, monitor) => {
      if (draggedItem.index !== index) {
        moveItem(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  }));

  return (
    <div ref={(node) => drag(drop(node))} className="inventory-slot">
      {item && (
        <div 
          className="inventory-item" 
          onClick={() => onItemClick(item)}
          style={{ opacity: isDragging ? 0.5 : 1 }}
        >
          <img src={getImageUrl(item.no_bg_image_url)} alt={item.name} onError={(e) => { e.target.onerror = null; e.target.src = '/placeholder.png' }} />
          <span className="item-name">{item.name}</span>
        </div>
      )}
    </div>
  );
}

export default InventorySlot;
