import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import Button from "../components/utils/Button";
import Card from "../components/utils/Card";
import LineChart from "../components/charts/LineChart";
import BarChart from "../components/charts/BarChart";
import { GetDashboardData, GetDashboardDataV2 } from "../api/ApiFunction";
import Loader from "../components/utils/Loader";
import getFirstDayOfCurrentMonth from "../components/utils/getFirstDayOfCurrentMonth";
import NumberFormatter from "../components/utils/NumberFormatter";
import DateInput from "../components/fields/DateInput";
import FilterCard from "../components/utils/FilterCard";

function Dashboardv2() {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [graphData, setGraphData] = useState([]);
  const [dashboardData, setDashboardData] = useState(null);
  const [monthWiseData, setMonthWiseData] = useState([]);
  const [dayWiseData, setDayWiseData] = useState([]);
  const [dashData, setdashData] = useState();
  const [isFilter, setisFilter] = useState(false);
  const [startDate, setstartDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [endDate, setendDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  const dateToday = new Date().toISOString().split("T")[0];
  // const dateToday = new Date().toLocaleDateString("en-CA");
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
      product_name: import.meta.env.VITE_PRODUCT_NAME,
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
      product_name: import.meta.env.VITE_PRODUCT_NAME,
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
      product_name: import.meta.env.VITE_PRODUCT_NAME,
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

  const fetchDashboardDataFiltered = async ({ startDate, endDate }) => {
    const req = {
      from_date: startDate,
      to_date: endDate,
      company_id: import.meta.env.VITE_COMPANY_ID,
      product_name: import.meta.env.VITE_PRODUCT_NAME,
    };

    try {
      const response = await GetDashboardDataV2(req);
      setdashData(response);
      // console.log(response);

      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setIsLoading(false);
    }
  };

  const handleApply = () => {
    fetchDashboardDataFiltered({ startDate: startDate, endDate: endDate });
  };

  const handleReset = () => {
    setstartDate(dateToday);
    setendDate(dateToday);
    fetchDashboardDataFiltered({ startDate: dateToday, endDate: dateToday });
  };

  useEffect(() => {
    fetchDashboardData();
    fetchDashboardDataFiltered({ startDate: startDate, endDate: endDate });
    // fetchMonthWiseData();
    // fetchDayWiseData();
  }, []);

  function formatNumber(num) {
    if (num >= 10000000) {
      return (num / 10000000).toFixed(2) + "CR";
    } else if (num >= 100000) {
      return (num / 100000).toFixed(2) + "L";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(2) + "K";
    } else {
      return num.toString();
    }
  }

  const DashboardStats = ({ data, title }) => {
    if (!data || data.length === 0) return null;

    // Fields to format with NumberFormatter
    const amountFields = [
      "total_loan_disbursed_amt",
      "total_new_loan_disbursed_amt",
      "total_repeat_loan_disbursed_amt",
      "collected_amt",
      "total_amount_overdue",
      "total_loan_disbursed_amt",
      "total_new_loan_disbursed_amt",
      "total_repeat_loan_disbursed_amt",
      "collection_against_due_amount",
      "overall_collection_including_overdue",
      "collection_demand_till_date",
      "new_case_loan_disbursed_amt",
      "repeat_case_loan_disbursed_amt"
    ];

    const percentageFields = [
      "collection_efficiency_against_demand",
      "collection_effciency_including_overdue_collection",
    ];

    const stats = Object.entries(data);

    const statPairs = [];
    for (let i = 0; i < stats.length; i += 4) {
      statPairs.push(stats.slice(i, i + 4));
    }

    return (
      <>
        <span className="font-bold text-base bg-primary text-white px-5 py-1 rounded-t-lg">
          {title}
        </span>
        <div className="p-2 border border-gray-200 rounded-b-lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {statPairs.map((pair, index) => (
              <div
                key={index}
                className="bg-white rounded shadow border border-gray-200"
              >
                <div className="bg-gradient-to-r from-primary to-blue-500 h-3"></div>
                <div className="px-3 py-3">
                  {pair.map(([key, value]) => (
                    <div key={key} className="flex justify-between mb-0">
                      <span className="font-medium text-gray-600 capitalize">
                        {key.replace(/_/g, " ")}
                      </span>
                      <span className="font-bold text-primary text-lg">
                        {amountFields.includes(key)
                          ? formatNumber(value)
                          : percentageFields.includes(key)
                            ? value + "%"
                            : value}
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

  const BucketData = ({ title, data }) => {
    return (
      <>
        <span className="font-bold text-base bg-primary text-white px-5 py-1 rounded-t-lg">
          {title}
        </span>
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="min-w-full border border-gray-500 rounded-lg overflow-hidden">
            <thead className="bg-gray-200 border border-gray-500">
              <tr>
                <th className="px-4 py-1 text-left text-sm font-bold text-gray-700 border-b">
                  Bucket
                </th>
                <th className="px-4 py-1 text-left text-sm font-bold text-gray-700 border-b">
                  Overdue Amount
                </th>
                <th className="px-4 py-1 text-left text-sm font-bold text-gray-700 border-b">
                  Collection
                </th>
                <th className="px-4 py-1 text-left text-sm font-bold text-gray-700 border-b">
                  Collection %
                </th>
              </tr>
            </thead>

            <tbody className="border border-gray-500">
              {data?.map((bucket, index) => {
                const isLastRow = index === data.length - 1;
                return (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 transition duration-200"
                  >
                    <td
                      className={`${isLastRow ? "font-extrabold" : "font-medium"} px-4 py-1.5 border-b text-sm text-gray-600`}
                    >
                      {bucket?.bucket}
                    </td>
                    <td
                      className={`${isLastRow ? "font-extrabold" : "font-medium"} px-4 py-1.5 border-b text-sm text-gray-600`}
                    >
                      {bucket?.overdue_amt}
                    </td>
                    <td
                      className={`${isLastRow ? "font-extrabold" : "font-medium"} px-4 py-1.5 border-b text-sm text-gray-600`}
                    >
                      {bucket?.collection}
                    </td>
                    <td
                      className={`${isLastRow ? "font-extrabold" : "font-medium"} px-4 py-1.5 border-b text-sm text-gray-600`}
                    >
                      {bucket?.collection_pct}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </>
    );
  };

  if (isLoading) {
    return <Loader />;
  }

  const categories = graphData.map((item) => `${item.month_name} ${item.year}`);

  const metricKeys = [
    { key: "all_leads", label: "All Leads" },
    { key: "active_loans", label: "Active Loans" },
    { key: "leads_reject", label: "Rejected" },
    { key: "loan_closed", label: "Closed Loans" },
  ];

  const series = metricKeys.map(({ key, label }) => ({
    name: label,
    data: graphData.map((month) => month.monthwisedata?.[0]?.[key] ?? 0),
  }));

  return (
    <>
      <Helmet>
        <title>Dashboard</title>
        <meta name="Leads Verification" content="Leads Verification" />
      </Helmet>

      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-2">
          <div className="text-xl font-bold"></div>
          <div className="flex items-center">
            <span className="text-dark pr-5 text-xs">
              Last Refreshed: {currentDateTime.toLocaleDateString()},{" "}
              {currentDateTime.toLocaleTimeString()}
            </span>
            <Button
              onClick={updateDateTime}
              btnName="Refresh"
              btnIcon="IoRefresh"
              style={"bg-primary text-white hover:bg-primary/80"}
            />
            <Button
              onClick={() => setisFilter(true)}
              btnName="Filter"
              btnIcon="IoRefresh"
              style={"bg-primary text-white hover:bg-primary/80 ml-1"}
            />
          </div>
        </div>

        {isFilter && (
          <FilterCard onClick={() => setisFilter(false)}>
            <div className="bg-white p-4 rounded-xl flex justify-between items-center gap-4">
              {/* From Date */}
              <div className="flex gap-1 items-center">
                <div className="flex flex-col w-full md:w-auto">
                  <DateInput
                    label="From Date"
                    placeholder="DD-MM-YYYY"
                    name="startdate"
                    id="startdate"
                    value={startDate}
                    onChange={(e) => setstartDate(e.target.value)}
                  />
                </div>

                {/* To Date */}
                <div className="flex flex-col w-full md:w-auto">
                  <DateInput
                    label="To Date"
                    placeholder="DD-MM-YYYY"
                    name="enddate"
                    id="enddate"
                    value={endDate}
                    onChange={(e) => setendDate(e.target.value)}
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={handleApply}
                  className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary/80 transition"
                >
                  Apply
                </button>

                <button
                  onClick={handleReset}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-300 transition"
                >
                  Reset
                </button>
              </div>
            </div>
          </FilterCard>
        )}
      </div>

      <div className="">
        <div className="my-3">
          <DashboardStats
            data={dashData?.today_business_dashboard}
            title="Today"
          />
        </div>
        <div className="mb-3">
          <DashboardStats
            data={dashData?.month_business_dashboard}
            title="Current Month"
          />
        </div>
        <div className="mb-3">
          <BucketData data={dashData?.bucket_Datas} title="Overdue Status" />
        </div>
        {/* <div className="mb-3">
          <DashboardStats data={dashboardData} title="Overall Business" />
        </div> */}
      </div>

      <div className="mt-6">
        <div className="w-full">
          <Card heading="Chart" style={"hover:scale-105 duration-500"}>
            <LineChart
              series={series}
              categories={categories}
              // title="Monthly Loan Activity"
              height={250}
              type="area"
              colors={[
                "#1E88E5",
                "#00C853",
                "#FFC107",
                "#FF3D00",
                "#6A1B9A",
                "#00ACC1",
              ]}
            />
          </Card>
        </div>
        <div className="w-full mt-6">
          <Card
            heading="Chart"
            style={"hover:scale-105 duration-500 py-2 px-2"}
          >
            <BarChart
              data={graphData}
              metrics={[
                "all_leads",
                "active_loans",
                "leads_reject",
                "loan_closed",
              ]}
              labelMap={{
                loan_closed: "Closed Loans",
                leads_reject: "Rejected",
                active_loans: "Active Loans",
                all_leads: "All Leads",
              }}
            />
          </Card>
        </div>
      </div>
    </>
  );
}

export default Dashboardv2;
