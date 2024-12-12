import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import backgroundImage from '../assets/navbar.png'; // Asegúrate de tener esta imagen

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">Reino de Batallas</Link>
        <div className="navbar-links">
          <Link to="/" className="navbar-link">Inicio</Link>
          <Link to="/character" className="navbar-link">Mi Personaje</Link>
          <Link to="/battle" className="navbar-link">Batalla</Link>
          <Link to="/character-sheet" className="navbar-link">Hoja de Personaje</Link>
          <Link to="/world" className="navbar-link">Mundo</Link>
          <Link to="/world3d" className="navbar-link">Mundo 3D</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;