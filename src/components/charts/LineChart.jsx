import React from 'react';
import Chart from 'react-apexcharts';

function LineChart({ series, categories, title, height = 300, type = 'area', colors }) {
    const options = {
        chart: {
            height,
            type,
            toolbar: { show: false },
        },
        title: {
            text: title,
            align: 'left',
            style: {
                fontSize: '16px',
                fontWeight: 'bold',
            },
        },
        markers: { size: 4 },
        colors,
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.3,
                opacityTo: 0.4,
                stops: [0, 90, 100],
            },
        },
        dataLabels: { enabled: false },
        stroke: {
            curve: 'smooth',
            width: 2,
        },
        xaxis: {
            categories,
        },
        tooltip: {
            x: { format: 'MMM yyyy' },
        },
    };

    return <Chart options={options} series={series.reverse()} type={type} height={height} />;
}

export default LineChart;
