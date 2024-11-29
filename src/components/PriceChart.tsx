import React, { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface PriceData {
  price: number;
  timestamp: number;
}

interface PriceChartProps {
  data: PriceData[];
  isPredicting: boolean;
  prediction: 'moon' | 'doom' | null;
  primaryColor: string;
}

const PriceChart: React.FC<PriceChartProps> = ({ 
  data,
  isPredicting,
  prediction,
  primaryColor
}) => {
  const chartData = useMemo(() => {
    const labels = data.map(d => new Date(d.timestamp).toLocaleTimeString());
    const prices = data.map(d => d.price);

    return {
      labels,
      datasets: [
        {
          label: 'BTC Price',
          data: prices,
          borderColor: primaryColor,
          borderWidth: 2,
          pointRadius: 0,
          tension: 0.4,
          fill: true,
          backgroundColor: `${primaryColor}10`,
        },
      ],
    };
  }, [data, primaryColor]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: isPredicting ? 0 : 300,
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    scales: {
      x: {
        display: false,
      },
      y: {
        display: false,
      },
    },
    elements: {
      line: {
        borderWidth: 2,
      },
    },
  };

  return (
    <div className={`w-full h-full transition-opacity duration-300 ${
      isPredicting ? 'opacity-50' : 'opacity-100'
    }`}>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default PriceChart;