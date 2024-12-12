import React from 'react';
import { useDrag } from 'react-dnd';

function InventoryItem({ item }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'ITEM',
    item: { id: item.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div 
      ref={drag} 
      className={`inventory-item ${isDragging ? 'dragging' : ''}`}
    >
      <img src={item.image} alt={item.name} />
      <p>{item.name}</p>
    </div>
  );
}

export default InventoryItem;