import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

type HiveBarChartProps = {
  noOfTotalHives: number;
  noOfActiveHives: number;
  noOfInactiveHives: number;
};

const HiveBarChart: React.FC<HiveBarChartProps> = ({
  noOfTotalHives,
  noOfActiveHives,
  noOfInactiveHives,
}) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      if (chartInstance.current) {
        chartInstance.current.data.datasets[0].data = [
          noOfTotalHives,
          noOfActiveHives,
          noOfInactiveHives,
        ];
        chartInstance.current.update();
      } else {
        const ctx = chartRef.current.getContext('2d');

        if (!ctx) return;

        const gradientTotal = ctx.createLinearGradient(0, 0, 0, 400);
        gradientTotal.addColorStop(0, 'rgba(75, 0, 130, 0.8)');
        gradientTotal.addColorStop(1, 'rgba(75, 0, 130, 0.3)');

        const gradientActive = ctx.createLinearGradient(0, 0, 0, 400);
        gradientActive.addColorStop(0, 'rgba(255, 193, 7, 0.8)');
        gradientActive.addColorStop(1, 'rgba(255, 193, 7, 0.3)');

        const gradientInactive = ctx.createLinearGradient(0, 0, 0, 400);
        gradientInactive.addColorStop(0, 'rgba(233, 30, 99, 0.8)');
        gradientInactive.addColorStop(1, 'rgba(233, 30, 99, 0.3)');

        chartInstance.current = new Chart(chartRef.current, {
          type: 'bar',
          data: {
            labels: ['Total Hives', 'Active Hives', 'Inactive Hives'],
            datasets: [
              {
                data: [noOfTotalHives, noOfActiveHives, noOfInactiveHives],
                backgroundColor: [gradientTotal, gradientActive, gradientInactive],
                borderColor: ['rgba(75, 0, 130, 1)', 'rgba(255, 193, 7, 1)', 'rgba(233, 30, 99, 1)'],
                borderWidth: 2,
                borderRadius: 8,
                barThickness: 60,
                hoverBackgroundColor: ['rgba(75, 0, 130, 1)', 'rgba(255, 193, 7, 1)', 'rgba(233, 30, 99, 1)'],
                hoverBorderColor: '#fff',
                hoverBorderWidth: 2,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false,
              },
              tooltip: {
                backgroundColor: 'rgba(0,0,0,0.7)',
                titleFont: { size: 14, weight: 'bold' },
                bodyFont: { size: 12 },
                padding: 10,
                cornerRadius: 5,
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  stepSize: 1,
                  color: '#333',
                  font: { size: 12 },
                },
                grid: {
                  color: 'rgba(0,0,0,0.1)',
                },
              },
              x: {
                ticks: {
                  color: '#333',
                  font: { size: 14, weight: 'bold' },
                },
                grid: {
                  display: false,
                },
              },
            },
            animation: {
              duration: 1000,
              easing: 'easeInOutBounce',
            },
          },
        });
      }
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }
    };
  }, [noOfTotalHives, noOfActiveHives, noOfInactiveHives]);

  return (
    <div style={{ height: '280px', width: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <canvas ref={chartRef} />
    </div>
  );
};

export default HiveBarChart;