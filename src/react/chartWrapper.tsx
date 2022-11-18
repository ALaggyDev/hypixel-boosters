import React, { useState, useEffect, useRef } from 'react';
import type { Chart as ChartAsType, ChartConfiguration, ChartType, DefaultDataPoint } from 'chart.js';
import Chart from 'chart.js/auto';
import 'chartjs-adapter-date-fns';

interface Props {
  chartData: ChartConfiguration<ChartType, DefaultDataPoint<ChartType>, any>;
}

const ReactChart: React.FC<Props> = ({ chartData }) => {
  if (!process.browser) return null;

  const [chart, setChart] = useState<ChartAsType>();

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    setChart(new Chart(canvasRef.current, chartData));
  }, []);

  useEffect(() => {
    if (!chart) return;

    chart.data = chartData.data;
    chart.options = chartData.options || {};

    chart.update();
  }, [chartData]);

  return <canvas ref={canvasRef} />;
};

export default ReactChart;
