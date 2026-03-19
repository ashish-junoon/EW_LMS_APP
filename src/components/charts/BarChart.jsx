import ReactECharts from 'echarts-for-react';

/**
 * BarChart Component
 * @param {Array} data - Array of objects containing month, year, and monthwisedata.
 * @param {Array} metrics - Array of metric keys to display.
 * @param {Object} labelMap - Optional: Map of keys to custom labels.
 */
function BarChart({ data = [], metrics = [], labelMap = {} }) {
    // Extract categories (months)
    const categories = data.map(item => `${item.month_name} ${item.year}`);

    // Prepare dataset: first row is headers
    const dataset = [
        ['Month', ...metrics.map(metric => labelMap[metric] || metric.replace(/_/g, ' '))],
        ...data.map(item => [
            `${item.month_name} ${item.year}`,
            ...metrics.map(metric => item.monthwisedata[0]?.[metric] ?? 0)
        ])
    ];

    const option = {
        tooltip: {},
        legend: {
            bottom: 0,
            textStyle: {
                color: '#000',
                fontSize: 10,
            },
        },
        grid: {
            top: 10,
            bottom: 50,
            left: 30,
            right: 20
        },
        dataset: {
            source: dataset
        },
        xAxis: { type: 'category' },
        yAxis: {
            axisLabel: {
                show: true
            }
        },
        series: metrics.map(() => ({ type: 'bar' }))
    };

    return (
        <ReactECharts
            option={option}
            style={{ height: '250px', width: '100%' }}
        />
    );
}

export default BarChart;
