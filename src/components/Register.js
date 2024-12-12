import React, { useState } from 'react';
import axios from 'axios';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:5000/api/register', { username, password });
      setMessage(response.data.message);
    } catch (error) {
      setMessage('Error al registrarse');
    }
  };

  return (
    <div>
      <h1>Registro</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Nombre de Usuario:</label>
        <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required /><br />
        <label htmlFor="password">Contraseña:</label>
        <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required /><br />
        <button type="submit">Registrarse</button>
      </form>
      <div>{message}</div>
    </div>
  );
}

export default Register;
