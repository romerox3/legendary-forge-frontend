import { Bar } from 'react-chartjs-2';

export function GeneDistribution({ distributionData }) {
    if (!distributionData) return null;
    return (
        <div className="gene-distribution">
            <h3>Distribución de Genes</h3>
            <Bar
                data={{
                    labels: Object.keys(distributionData),
                    datasets: [
                        {
                            label: 'Mínimo',
                            data: Object.values(distributionData).map(g => g.min),
                            backgroundColor: 'rgba(255, 99, 132, 0.5)',
                        },
                        {
                            label: 'Promedio',
                            data: Object.values(distributionData).map(g => g.promedio),
                            backgroundColor: 'rgba(75, 192, 192, 0.5)',
                        },
                        {
                            label: 'Máximo',
                            data: Object.values(distributionData).map(g => g.max),
                            backgroundColor: 'rgba(53, 162, 235, 0.5)',
                        },
                    ],
                }}
                options={{
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }}
            />
        </div>
    );
}