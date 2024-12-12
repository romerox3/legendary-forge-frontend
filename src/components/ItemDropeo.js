import React, { useState } from 'react';
import axios from 'axios';

function ItemDropeo({ characterId, onItemDropped }) {
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDrop = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/drop-item', {
        character_id: characterId,
        keyword: keyword
      }, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      setLoading(false);
      setKeyword('');
      onItemDropped(response.data.item);
    } catch (error) {
      console.error('Error al dropear el item:', error);
      setLoading(false);
    }
  };

  return (
    <div className="item-drop">
      <h3>Dropear Item</h3>
      <form onSubmit={handleDrop}>
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Ingresa una palabra clave"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Dropeando...' : 'Dropear Item'}
        </button>
      </form>
    </div>
  );
}

export default ItemDropeo;