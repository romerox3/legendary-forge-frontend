import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import { TextField } from '@mui/material';
import './EntityLogs.css';

const EntityLogsView = () => {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8000/logs')
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'detalles', headerName: 'Detalles', width: 300 },
    { field: 'entidad_nombre', headerName: 'Entidad Nombre', width: 150 },
    { field: 'tiempo', headerName: 'Tiempo', width: 200 },
    { field: 'accion', headerName: 'Acción', width: 150 },
  ];

  const filteredData = data.filter(row => 
    row.detalles.toLowerCase().includes(filter.toLowerCase()) ||
    row.accion.toLowerCase().includes(filter.toLowerCase()) ||
    row.entidad_nombre.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div style={{ height: 600, width: '100%' }}>
      <TextField
        label="Filtrar"
        variant="outlined"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        style={{ marginBottom: 20 }}
      />
      <DataGrid
        rows={filteredData}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10]}
        checkboxSelection
        disableSelectionOnClick
      />
    </div>
  );
};

export default EntityLogsView;