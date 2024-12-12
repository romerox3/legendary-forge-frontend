import React from 'react';
import { useDrag } from 'react-dnd';

function ItemDrop({ item, onDrop }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'ITEM',
    item: { id: item.id, slot: item.slot },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      if (item && dropResult) {
        onDrop(item);
      }
    },
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
      <p className="item-name">{item.name}</p>
    </div>
  );
}

export default ItemDrop;