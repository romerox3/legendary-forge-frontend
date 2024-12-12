import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, TablePagination } from '@mui/material';
import { Line } from 'react-chartjs-2';

export function EntityTable({ entities, entityHistory, chartOptions }) {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <div>
            <Table className="entity-table">
                <TableHead>
                    <TableRow>
                        <TableCell>Nombre</TableCell>
                        <TableCell>Energía</TableCell>
                        <TableCell>Puntuación</TableCell>
                        <TableCell>Recompensa promedio</TableCell>
                        <TableCell>Pérdida promedio</TableCell>
                        <TableCell>Epsilon</TableCell>
                        <TableCell>Generación</TableCell>
                        <TableCell>Edad</TableCell>
                        <TableCell>Hambre</TableCell>
                        <TableCell>Sed</TableCell>
                        <TableCell>Cambio de puntuación</TableCell>
                        <TableCell>Cambio de energía</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {entities.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((entidad, index) => (
                        <TableRow key={index}>
                            <TableCell>{entidad.nombre}</TableCell>
                            <TableCell>{entidad.energia.toFixed(2)}</TableCell>
                            <TableCell>{entidad.puntuacion.toFixed(2)}</TableCell>
                            <TableCell>{entidad.recompensa_promedio.toFixed(4)}</TableCell>
                            <TableCell>{entidad.perdida_promedio.toFixed(4)}</TableCell>
                            <TableCell>{entidad.epsilon.toFixed(4)}</TableCell>
                            <TableCell>{entidad.generacion}</TableCell>
                            <TableCell>{entidad.edad}</TableCell>
                            <TableCell>{entidad.hambre.toFixed(2)}</TableCell>
                            <TableCell>{entidad.sed.toFixed(2)}</TableCell>
                            <TableCell>{entidad.cambio_puntuacion !== undefined ? entidad.cambio_puntuacion.toFixed(2) : 'N/A'}</TableCell>
                            <TableCell>{entidad.cambio_energia !== undefined ? entidad.cambio_energia.toFixed(2) : 'N/A'}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={entities.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
            {entityHistory[entities[0]?.nombre] && (
                <div className="entity-charts">
                    <Line
                        data={{
                            labels: Array.from({ length: entityHistory[entities[0].nombre].energia.length }, (_, i) => i + 1),
                            datasets: [
                                {
                                    label: 'Energía',
                                    data: entityHistory[entities[0].nombre].energia,
                                    borderColor: 'rgb(75, 192, 192)',
                                    tension: 0.1
                                },
                                {
                                    label: 'Puntuación',
                                    data: entityHistory[entities[0].nombre].puntuacion,
                                    borderColor: 'rgb(255, 99, 132)',
                                    tension: 0.1
                                }
                            ]
                        }}
                        options={chartOptions}
                    />
                </div>
            )}
        </div>
    );
}