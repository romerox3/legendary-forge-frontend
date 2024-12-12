import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import axios from 'axios';
import InventorySlot from './InventorySlot';
import EquipmentSlot from './EquimentSlot';
import ItemDropeo from './ItemDropeo';
import ItemModal from './ItemModal';
import './CharacterSheet.css';
import pjImage from '../assets/pj.png';

function CharacterSheet() {
  const [character, setCharacter] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [equipment, setEquipment] = useState({
    head: null,
    chest: null,
    hands: null,
    legs: null,
    feet: null,
    weapon: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    const fetchCharacter = async () => {
      try {
        const user_id = localStorage.getItem('user_id');
        const response = await axios.get(`http://127.0.0.1:5000/api/characters/${user_id}`);
        setCharacter(response.data);
        setInventory(response.data.items || []);
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener el personaje:', error);
        setError('Error al cargar el personaje. Por favor, intenta de nuevo.');
        setLoading(false);
      }
    };

    fetchCharacter();
  }, []);

  const moveInventoryItem = (fromIndex, toIndex) => {
    setInventory(prevInventory => {
      const updatedInventory = [...prevInventory];
      const [movedItem] = updatedInventory.splice(fromIndex, 1);
      updatedInventory.splice(toIndex, 0, movedItem);
      return updatedInventory;
    });
  };

  const equipItem = (itemId, slot) => {
    const item = inventory.find(i => i.id === itemId);
    if (item && item.item_type === slot) {
      setEquipment(prev => ({ ...prev, [slot]: item }));
      setInventory(prev => prev.filter(i => i.id !== itemId));
    }
  };

  const unequipItem = (slot) => {
    const item = equipment[slot];
    if (item) {
      setInventory(prev => [...prev, item]);
      setEquipment(prev => ({ ...prev, [slot]: null }));
    }
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  const closeItemModal = () => {
    setSelectedItem(null);
  };

  const handleItemDropped = (newItem) => {
    setInventory(prevInventory => [...prevInventory, newItem]);
  };

  if (loading) return <div className="loading">Cargando...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!character) return <div className="not-found">No se encontró el personaje</div>;

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="character-sheet">
        <div className="character-image-section">
          <div className="character-silhouette">
            <img src={pjImage} alt="Silueta del personaje" className="silhouette-image" />
            <div className="equipment-slots">
              {Object.entries(equipment).map(([slot, item]) => (
                <EquipmentSlot
                  key={slot}
                  slot={slot}
                  item={item}
                  onEquip={equipItem}
                  onUnequip={unequipItem}
                />
              ))}
            </div>
          </div>
          <h2 className="character-name">{character.name}</h2>
        </div>

        <div className="character-stats-section">
          <h3 className="stats-title">Estadísticas</h3>
          <div className="stats-grid">
            <div className="stat-item strength">
              <i className="fas fa-fist-raised"></i>
              <span className="stat-name">Fuerza</span>
              <span className="stat-value">{character.base_strength}</span>
            </div>
            <div className="stat-item defense">
              <i className="fas fa-shield-alt"></i>
              <span className="stat-name">Defensa</span>
              <span className="stat-value">{character.base_defense}</span>
            </div>
            <div className="stat-item agility">
              <i className="fas fa-running"></i>
              <span className="stat-name">Destreza</span>
              <span className="stat-value">{character.base_agility}</span>
            </div>
            <div className="stat-item mana">
              <i className="fas fa-magic"></i>
              <span className="stat-name">Mana</span>
              <span className="stat-value">{character.mana}</span>
            </div>
            <div className="stat-item health">
              <i className="fas fa-heartbeat"></i>
              <span className="stat-name">Constitución</span>
              <span className="stat-value">{character.health}</span>
            </div>
            <div className="stat-item critical">
              <i className="fas fa-star"></i>
              <span className="stat-name">Crítico</span>
              <span className="stat-value">{character.critical_chance}</span>
            </div>
          </div>
        </div>

        <div className="character-inventory-section">
          <h3>Inventario</h3>
          <div className="inventory-grid">
            {inventory.map((item, index) => (
              <InventorySlot
                key={item.id}
                index={index}
                item={item}
                onItemClick={handleItemClick}
                moveItem={moveInventoryItem}
              />
            ))}
          </div>
        </div>

        <ItemDropeo characterId={character.id} onItemDropped={handleItemDropped} />
        {selectedItem && <ItemModal item={selectedItem} onClose={closeItemModal} />}
      </div>
    </DndProvider>
  );
}

export default CharacterSheet;
