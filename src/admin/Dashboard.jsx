import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Button from "../components/utils/Button";
import Card from "../components/utils/Card";
import LineChart from "../components/charts/LineChart";
import BarChart from "../components/charts/BarChart";
import { GetDashboardData } from '../api/ApiFunction';
import Loader from '../components/utils/Loader';
import getFirstDayOfCurrentMonth from '../components/utils/getFirstDayOfCurrentMonth';
import NumberFormatter from '../components/utils/NumberFormatter';
import DateInput from '../components/fields/DateInput';

function Dashboard() {
    const [currentDateTime, setCurrentDateTime] = useState(new Date());
    const [isLoading, setIsLoading] = useState(true);
    const [graphData, setGraphData] = useState([]);
    const [dashboardData, setDashboardData] = useState(null);
    const [monthWiseData, setMonthWiseData] = useState([]);
    const [dayWiseData, setDayWiseData] = useState([]);

    
    const dateToday = new Date().toISOString().split("T")[0];
    const firstDay = getFirstDayOfCurrentMonth();
    
    // const [startDate, setStartDate] = useState(firstDay);
    // const [endDate, setEndDate] = useState(dateToday);

    const updateDateTime = () => {
        setCurrentDateTime(new Date());
        fetchDashboardData();
        fetchMonthWiseData();
        location.reload();
    };

    // useEffect(() => {
    //     const intervalId = setInterval(updateDateTime, 600000);
    //     return () => clearInterval(intervalId);
    // }, []);

    const fetchDashboardData = async () => {
        const req = {
            from_date: "2025-05-01",
            to_date: dateToday,
            company_id: import.meta.env.VITE_COMPANY_ID,
            product_name: import.meta.env.VITE_PRODUCT_NAME
        };

        try {
            const response = await GetDashboardData(req);
            setDashboardData(response.totalCounts);
            setGraphData(response.data || []);
            setIsLoading(false);
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
            setIsLoading(false);
        }
    };

    const fetchMonthWiseData = async () => {
        const req = {
            from_date: firstDay.toISOString().split("T")[0],
            to_date: dateToday,
            company_id: import.meta.env.VITE_COMPANY_ID,
            product_name: import.meta.env.VITE_PRODUCT_NAME
        };

        try {
            const response = await GetDashboardData(req);
            setMonthWiseData(response.totalCounts);
            setIsLoading(false);
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
            setIsLoading(false);
        }
    };
    
    const fetchDayWiseData = async () => {
        const req = {
            from_date: dateToday,
            to_date: dateToday,
            company_id: import.meta.env.VITE_COMPANY_ID,
            product_name: import.meta.env.VITE_PRODUCT_NAME
        };

        try {
            const response = await GetDashboardData(req);
            setDayWiseData(response.totalCounts);
            setIsLoading(false);
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
        fetchMonthWiseData();
        // fetchDayWiseData();
    }, []);


    function formatNumber(num) {
        if (num >= 10000000) {
            return (num / 10000000).toFixed(2) + 'CR';
        } else if (num >= 100000) {
            return (num / 100000).toFixed(2) + 'L';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(2) + 'K';
        } else {
            return num.toString();
        }
    }

    const DashboardStats = ({ data, title }) => {
        if (!data || data.length === 0) return null;

        // Fields to format with NumberFormatter
        const amountFields = [
            "total_amount_disbursed",
            "total_amount_collected",
            "total_amount_due",
            "total_amount_overdue"
        ];

        const stats = Object.entries(data[0]);

        const statPairs = [];
        for (let i = 0; i < stats.length; i += 2) {
            statPairs.push(stats.slice(i, i + 2));
        }
        
        return (
            <>
                <span className="font-bold text-base bg-primary text-white px-5 py-1 rounded-t-lg">
                    {title}
                </span>
                <div className="p-5 border border-gray-400 rounded-b-lg">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                        {statPairs.map((pair, index) => (
                            <div key={index} className="bg-white rounded shadow border border-gray-200">
                                <div className="bg-gradient-to-r from-primary to-primary/60 h-3"></div>
                                <div className="px-5 py-3">
                                    {pair.map(([key, value]) => (
                                        <div key={key} className="flex justify-between mb-2">
                                            <span className="font-medium text-gray-600 capitalize">
                                                {key.replace(/_/g, " ")}
                                            </span>
                                            <span className="font-bold text-primary text-xl">
                                                {
                                                    amountFields.includes(key)
                                                        ? formatNumber(value)
                                                        : value
                                                }
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </>
        );
    };


    if (isLoading) {
        return <Loader />;
    };

    const categories = graphData.map(item => `${item.month_name} ${item.year}`);

    const metricKeys = [
        { key: 'all_leads', label: 'All Leads' },
        { key: 'active_loans', label: 'Active Loans' },
        { key: 'leads_reject', label: 'Rejected' },
        { key: 'loan_closed', label: 'Closed Loans' },
    ];


    const series = metricKeys.map(({ key, label }) => ({
        name: label,
        data: graphData.map(month => month.monthwisedata?.[0]?.[key] ?? 0),
    }));

    return (
        <>
            <Helmet>
                <title>Dashboard</title>
                <meta name="Leads Verification" content="Leads Verification" />
            </Helmet>

            <div className="container mx-auto">
                <div className="flex justify-between items-center mb-3">
                    <div className="text-xl font-bold"></div>
                    <div className="flex items-center">
                        <span className="text-dark pr-5 text-xs">
                            Last Refreshed: {currentDateTime.toLocaleDateString()}, {currentDateTime.toLocaleTimeString()}
                        </span>
                        <Button
                            onClick={updateDateTime}
                            btnName="Refresh"
                            btnIcon="IoRefresh"
                            style={"bg-primary text-white hover:bg-primary/80"}
                        />

                    </div>
                </div>
                {/* <div className='flex justify-end gap-1'>
                    <div>
                        <DateInput
                        // label="Repayment Date"
                        placeholder="DD-MM-YYYY"
                        name="startdate"
                        id="startdate"
                        // min={new Date().toISOString().split("T")[0]}
                        // onChange={addProduct.handleChange}
                        // onBlur={addProduct.handleBlur}
                        // value={addProduct.values.startdate}
                    />
                    </div>
                    <div>
                        <DateInput
                        // label="Repayment Date"
                        placeholder="DD-MM-YYYY"
                        name="enddate"
                        id="enddate"
                        // min={new Date().toISOString().split("T")[0]}
                        // onChange={addProduct.handleChange}
                        // onBlur={addProduct.handleBlur}
                        // value={addProduct.values.enddate}
                    />
                    </div>
                </div> */}
            </div>

            <div className="">
                {/* <div className='mb-5'>
                    <DashboardStats data={dayWiseData} title="Today" />
                </div> */}
                <div className='mb-5'>
                    <DashboardStats data={monthWiseData} title="Current Month" />
                </div>
                <div className='mb-5'>
                    <DashboardStats data={dashboardData} title="Overall Business" />
                </div>
            </div>

            <div className="mt-6">

                <div className='w-full'>
                    <Card heading="Chart" style={"hover:scale-105 duration-500"}>
                        <LineChart
                            series={series}
                            categories={categories}
                            // title="Monthly Loan Activity"
                            height={250}
                            type="area"
                            // colors={['#1E88E5', '#00C853', '#FFC107', '#FF3D00', '#6A1B9A', '#00ACC1']}
                            colors={['#00C853', '#FF3D00', '#1E88E5', '#FFC107', '#6A1B9A', '#00ACC1']}
                        />
                    </Card>
                </div>
                <div className='w-full mt-6'>
                    <Card
                        heading="Chart"
                        style={"hover:scale-105 duration-500 py-2 px-2"}
                    >
                        <BarChart
                            data={graphData}
                            metrics={['all_leads', 'active_loans', 'leads_reject', 'loan_closed']}
                            labelMap={{
                                loan_closed: 'Closed Loans',
                                leads_reject: 'Rejected',
                                active_loans: 'Active Loans',
                                all_leads: 'All Leads',
                            }}
                        />
                    </Card>
                </div>

            </div>
        </>
    );
}

export default Dashboard;
