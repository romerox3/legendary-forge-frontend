import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Character() {
  const [name, setName] = useState('');
  const [strength, setStrength] = useState(10); // Establecer valores por defecto basados en tu backend
  const [health, setHealth] = useState(100);
  const [character, setCharacter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const user_id = localStorage.getItem('user_id');

  useEffect(() => {
    const fetchCharacter = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:5000/api/characters/${user_id}`);
        setCharacter(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener el personaje:', error);
        setLoading(false);
        setMessage('Error al cargar el personaje. Por favor, intenta de nuevo.');
      }
    };

    fetchCharacter();
  }, [user_id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:5000/api/characters', { name, strength, health, user_id });
      setCharacter(response.data);
      setMessage('Personaje creado con éxito');
    } catch (error) {
      setMessage('Error al crear personaje');
    }
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (character) {
    return (
      <div>
        <h1>{character.name}</h1>
        <p>Fuerza: {character.strength}</p>
        <p>Salud: {character.health}</p>
        <p>Defensa: {character.defense}</p>
        <p>Agilidad: {character.agility}</p>
        <p>Maná: {character.mana}</p>
        <p>Prob. de crítico: {character.critical_chance}</p>
        <p>Esquivar: {character.dodge_chance}</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Crear Personaje</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Nombre del Personaje:</label>
        <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required /><br />
        <button type="submit">Crear Personaje</button>
      </form>
      <div>{message}</div>
    </div>
  );
}

export default Character;
