import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Login from './components/Login';
import Navbar from './components/Navbar';
import Register from './components/Register';
import Character from './components/Character';
import Battle from './components/Battle';
import Home from './components/Home';
import CharacterSheet from './components/CharacterSheet';
import WorldView from './components/WorldView';
import World3DView from './components/World3DView';

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
    <Router>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/character" element={<Character />} />
          <Route path="/character-sheet" element={<CharacterSheet />} />
          <Route path="/battle" element={<Battle />} />
          <Route path="/world" element={<WorldView />} />
          <Route path="/world3d" element={<World3DView />} />
        </Routes>
      </AuthProvider>
    </Router>
    </DndProvider>
  );
}

export default App;
