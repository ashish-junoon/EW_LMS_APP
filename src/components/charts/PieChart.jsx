import ReactECharts from 'echarts-for-react';

function PieChart() {
    const option = {
        tooltip: {
            trigger: 'item'
        },
        legend: {
            top: '5%',
            textStyle: { // Corrected 'TextStyle' to 'textStyle'
                color: '#000',
                fontSize: 10,
            },
        },
        series: [
            {
                name: 'Objects',
                type: 'pie',
                radius: ['20%', '50%'],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 0,
                    borderColor: '#fff',
                    borderWidth: 2
                },
                label: {
                    show: true,
                    position: 'center'
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: 12,
                        fontWeight: 'bold'
                    }
                },
                labelLine: {
                    show: true
                },
                data: [
                    { value: 1048, name: 'Leads' },
                    { value: 735, name: 'Approved' },
                    { value: 580, name: 'Rejected' },
                ]
            }
        ]
    };

    return (
        <ReactECharts
            option={option}
        // style={{ height: '200px' }}
        />
    )
}

export default PieChart;

