import React, { useEffect, useState } from "react";
import Button from "../components/utils/Button";
import DateInput from "../components/fields/DateInput";
import FilterCard from "../components/utils/FilterCard";
import { toast } from "react-toastify";
import {
  CollectionPerformanceSheet,
  DailyCreditReport,
  DailyDisbursementReport,
  DashboardReport,
  GetDashboardData,
  GetDashboardDataV2,
  KPIDashboardReport,
  LeadReport,
  OperationalMISReport,
  RevenueReport,
  SummaryReport,
} from "../api/ApiFunction";
import Loader from "../components/utils/Loader";

import { useAuth } from "../context/AuthContext";
import Card from "../components/utils/Card";
import LineChart from "../components/charts/LineChart";
import BarChart from "../components/charts/BarChart";

const Dashboardv3 = () => {
  const [isFilter, setisFilter] = useState(false);
  const [dashData, setdashData] = useState();
  const [tabNamesFilter, setTabName] = useState("RM Report");
  const [graphData, setGraphData] = useState([]);

  const {adminUser} = useAuth()
    const isAdmin = adminUser?.role?.toLowerCase() == "admin" || adminUser?.role?.toLowerCase() == "administrator"

  const [dashboardData, setDashboardData] = useState({
    SummeryRepoprtData: [],
    LeadReportData: [],
    operationalMISReports: [],
    revenueReport: [],
    kpiDashboardReports: [],
    dailyCreditReports: [],
    dailyDisbursementReports: [],
    collectionPerformanceSheets: [],
  });

  const [loading, setLoading] = useState(false);

  const [startDate, setstartDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [endDate, setendDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  const dateToday = new Date().toISOString().split("T")[0];

  const handleReset = () => {
    setstartDate(dateToday);
    setendDate(dateToday);
    fetchDashboardData();
  };

  const handleApply = () => {
    fetchDashboardData();
  };

  // const fetchDashboardData = async () => {
  //   try {
  //     setLoading(true);

  //     const payload = {
  //       from_date: startDate,
  //       to_date: endDate,
  //       login_user: adminUser?.emp_code,
  //     };

  //     const results = await Promise.allSettled([
  //       SummaryReport(payload),
  //       LeadReport(payload),
  //       OperationalMISReport(payload),
  //       RevenueReport(payload),
  //       KPIDashboardReport(payload),
  //       DailyCreditReport(payload),
  //       DailyDisbursementReport(payload),
  //       CollectionPerformanceSheet(payload),
  //     ]);

  //     // helper
  //     const getData = (res, key) =>
  //       res.status === "fulfilled" ? res.value?.[key] || [] : [];

  //     // optional: error log per API
  //     results.forEach((res, i) => {
  //       if (res.status === "rejected") {
  //         console.log(`API ${i} failed`, res.reason);
  //         toast.info(
  //           `API ${res.reason.config.url} failed ${res.reason.message}`,
  //         );
  //       }
  //     });

  //     setDashboardData({
  //       SummeryRepoprtData: getData(results[0], "summaryReports"),
  //       LeadReportData: getData(results[1], "leadReports"),
  //       operationalMISReports: getData(results[2], "operationalMISReports"),
  //       revenueReport: getData(results[3], "revenueReport"),
  //       kpiDashboardReports: getData(results[4], "kpiDashboardReports"),
  //       dailyCreditReports: getData(results[5], "dailyCreditReports"),
  //       dailyDisbursementReports: getData(
  //         results[6],
  //         "dailyDisbursementReports",
  //       ),
  //       collectionPerformanceSheets: getData(
  //         results[7],
  //         "collectionPerformanceSheets",
  //       ),
  //     });
  //     setisFilter(false);
  //   } catch (error) {
  //     console.log(error.response.data.message);
  //     toast.error("Unexpected error occurred!");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const payload = {
        from_date: startDate,
        to_date: endDate,
        login_user: adminUser?.emp_code,
      };

      const response = await DashboardReport(payload);

      if (response?.summaryReport?.status) {
        const getSafeData = (obj, key) => obj?.[key] || [];
        setDashboardData({
          SummeryRepoprtData: getSafeData(
            response?.summaryReport,
            "summaryReports",
          ),
          LeadReportData: getSafeData(response?.leadReport, "leadReports"),
          operationalMISReports: getSafeData(
            response?.operationalMISReport,
            "operationalMISReports",
          ),
          revenueReport: getSafeData(response?.revenueReport, "revenueReport"),
          kpiDashboardReports: getSafeData(
            response?.kpiDashboardReport,
            "kpiDashboardReports",
          ),
          dailyCreditReports: getSafeData(
            response?.dailyCreditReport,
            "dailyCreditReports",
          ),
          dailyDisbursementReports: getSafeData(
            response?.dailyDisbursementReport,
            "dailyDisbursementReports",
          ),
          collectionPerformanceSheets: getSafeData(
            response?.collectionPerformanceSheet,
            "collectionPerformanceSheets",
          ),
        });
        setisFilter(false);
      }
    } catch (error) {
      console.log(error.response.data.message);
      toast.error("Unexpected error occurred!");
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboardDataGraph = async () => {
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
      setLoading(false);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setLoading(false);
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

      setLoading(false);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardDataFiltered({ startDate: startDate, endDate: endDate });
    fetchDashboardData();
    // fetchDashboardDataGraph();
  }, []);

  const Tabs = [
    "RM Report",
    "Credit Report",
    "Disbursement Reports",
    "Collection Performance Sheets",
  ];

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

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="p-3 md:p-4 min-h-screen bg-gray-50 space-y-3">
      {/* 🔝 HEADER */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
        <div className="text-lg font-semibold text-gray-800">Dashboard</div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-gray-500 text-xs">
            Last Refreshed: {new Date().toLocaleDateString()}{" "}
            {new Date().toLocaleTimeString()}
          </span>

          <Button
            onClick={() => location.reload()}
            btnName="Refresh"
            btnIcon="IoRefresh"
            style="bg-primary text-white hover:bg-primary/80"
          />

          <Button
            onClick={() => setisFilter(true)}
            btnName="Filter"
            btnIcon="CiFilter"
            style="bg-primary text-white hover:bg-primary/80"
          />
        </div>
      </div>

      {/* 🔽 FILTER */}
      {isFilter && (
        <FilterCard onClick={() => setisFilter(false)}>
          <div className="bg-white p-4 rounded-lg flex flex-col md:flex-row md:justify-between gap-4">
            {/* Dates */}
            <div className="flex flex-col md:flex-row gap-3 w-full">
              <DateInput
                label="From Date"
                name="startdate"
                value={startDate}
                onChange={(e) => setstartDate(e.target.value)}
              />

              <DateInput
                label="To Date"
                name="enddate"
                value={endDate}
                onChange={(e) => setendDate(e.target.value)}
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-2 justify-end">
              <button
                onClick={handleApply}
                className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Apply
              </button>

              <button
                onClick={handleReset}
                className="bg-gray-200 px-4 py-2 rounded-md text-sm font-medium"
              >
                Reset
              </button>
            </div>
          </div>
        </FilterCard>
      )}

      {/* 🔢 KPI SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Left Big */}
        <div className="lg:col-span-2">
          <DashboardStats
            data={dashData?.today_business_dashboard}
            title="Today"
          />
        </div>

        {/* Right Side */}
        {isAdmin && <div>
          {dashboardData.kpiDashboardReports?.length > 0 && (
            <CardList
              title="KPI Dashboard"
              data={dashboardData?.kpiDashboardReports}
            />
          )}
        </div>}
      </div>

      {/* 📊 MAIN GRID */}
      {isAdmin && <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Summary */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border p-4">
          <h3 className="text-sm font-semibold text-gray-800 mb-2">
            Summary Report
          </h3>

          {dashboardData.SummeryRepoprtData?.length > 0 && (
            <ModernTable data={dashboardData?.SummeryRepoprtData} />
          )}
        </div>

        {/* Side Cards */}
        <div className="space-y-3">
          {dashboardData.operationalMISReports?.length > 0 && (
            <CardList
              title="Operational MIS"
              data={dashboardData?.operationalMISReports}
            />
          )}

          {dashboardData.revenueReport?.length > 0 && (
            <CardList
              title="Revenue Report"
              data={dashboardData?.revenueReport}
            />
          )}
        </div>
      </div>}

      {/* 🧭 TABS */}
      <p className="font-semibold text-gray-600 text-sm px-2">Today's Report</p>
      {/* <p className="font-semibold text-gray-600 text-sm px-2"> */}
      {/* {startDate?.split("-")[2] == endDate?.split("-")[2] ? "Todays Report" : startDate + " - " + endDate} */}
      {/* </p> */}

      {/* 📋 TABLE SECTION */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="bg-white p-2 rounded-lg shadow-sm border flex flex-wrap gap-2">
          {Tabs?.map((btn, index) => {
            const isActive = btn === tabNamesFilter;

            return (
              <button
                key={index}
                onClick={() => setTabName(btn)}
                className={`px-4 py-1.5 text-sm rounded-md transition ${
                  isActive
                    ? "bg-primary text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {btn}
              </button>
            );
          })}
        </div>

        <h3 className="text-sm font-semibold text-gray-800 my-2">
          {tabNamesFilter}
        </h3>

        {tabNamesFilter === "RM Report" &&
          dashboardData.LeadReportData?.length > 0 && (
            <ModernTable data={dashboardData.LeadReportData} highlightLastRow />
          )}

        {tabNamesFilter === "Credit Report" &&
          dashboardData.dailyCreditReports?.length > 0 && (
            <ModernTable
              data={dashboardData.dailyCreditReports}
              highlightLastRow
            />
          )}

        {tabNamesFilter === "Disbursement Reports" &&
          dashboardData.dailyDisbursementReports?.length > 0 && (
            <ModernTable
              data={dashboardData.dailyDisbursementReports}
              highlightLastRow
            />
          )}

        {tabNamesFilter === "Collection Performance Sheets" &&
          dashboardData.collectionPerformanceSheets?.length > 0 && (
            <ModernTable
              data={dashboardData.collectionPerformanceSheets}
              highlightLastRow
            />
          )}
      </div>

      {/* ChartS  */}
      {/* <div className="mt-6">
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
      </div> */}
    </div>
  );
};

const ModernTable = ({ data, highlightLastRow }) => {
  const headers = Object.keys(data[0]);
  
  return (
    <div className="overflow-hidden rounded-md border border-gray-200">
      <table className="w-full text-sm">
        {/* HEADER */}
        <thead className="bg-gradient-to-r from-primary to-[#1e6087]">
          <tr>
            {headers?.map((head, i) => (
              <th
                key={i}
                className="px-4 py-2 text-left text-xs font-bold text-gray-100 uppercase tracking-wide"
              >
                {head.replaceAll("_", " ")}
              </th>
            ))}
          </tr>
        </thead>

        {/* BODY */}
        <tbody className="divide-y divide-gray-100">
          {data?.map((row, i) => {
            const isLast = i === data.length - 1;
            const isStrip = i % 2 == 0;

            return (
              <tr
                key={i}
                className={`${isStrip ? "bg-white" : "bg-gray-200/80"} transition hover:bg-primary/5 ${
                  highlightLastRow && isLast ? "!bg-gray-300 font-semibold" : ""
                }`}
              >
                {Object?.values(row)?.map((val, j) => (
                  <td key={j} className="px-4 py-1.5 text-gray-700">
                    {val}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const CardList = ({ title, data }) => {
  return (
    <div className="bg-gradient-to-b from-primary/10 to-primary/15 p-4 rounded-md shadow-sm border">
      <h3 className="text-sm font-semibold text-gray-700 mb-3 border-b border-gray-300 pb-2">
        {title}
      </h3>

      <div className="space-y-3">
        {data?.map((item, i) => (
          <div
            key={i}
            className="flex justify-between items-center border-b pb-2 last:border-none"
          >
            <p className="text-xs text-gray-600 font-semibold">
              {item.parameter || item.particulars || item.kpi}
            </p>

            <p className="font-semibold text-sm text-gray-800">
              {item.count || item.amount || item.value || "- -"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

const DashboardStats = ({ data, title }) => {
  if (!data || data.length === 0) return null;

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

  // Fields to format with NumberFormatter
  const amountFields = [
    "total_loan_disbursed_amt",
    "collected_amt",
    "total_loan_disbursed_amt",
    "new_case_loan_disbursed_amt",
    "repeat_case_loan_disbursed_amt",
    "demand_of_the_day",
  ];

  const percentageFields = ["collection_efficiency_against_demand"];

  // No Need to write it but just to insert data in its relevent block
  const newdata = {
    no_of_leads_landed_on_crm: data?.no_of_leads_landed_on_crm,
    no_of_loan_disbursed: data?.no_of_loan_disbursed,
    total_loan_disbursed_amt: data?.total_loan_disbursed_amt,
    no_of_cases_in_underwriting: data?.no_of_cases_in_underwriting,
    no_of_new_cases_disbursed: data?.no_of_new_cases_disbursed,
    new_case_loan_disbursed_amt: data?.new_case_loan_disbursed_amt,
    no_of_repeat_cases_disbursed: data?.no_of_repeat_cases_disbursed,
    repeat_case_loan_disbursed_amt: data?.repeat_case_loan_disbursed_amt,
    "": "",
    demand_of_the_day: data?.demand_of_the_day,
    collected_amt: data?.collected_amt,
    collection_efficiency_against_demand:
      data?.collection_efficiency_against_demand,
  };

  const stats = Object.entries(newdata);

  const statPairs = [];
  for (let i = 0; i < stats.length; i += 3) {
    statPairs.push(stats.slice(i, i + 3));
  }

  return (
    <>
      {/* <span className="font-bold text-base bg-primary text-white px-5 py-1 rounded-t-lg">
          {title}
        </span> */}
      <div className="p-4 border border-gray-200 rounded-md">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">{title}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-3">
          {statPairs.map((pair, index) => (
            <div
              key={index}
              className="bg-white rounded shadow border border-gray-200"
            >
              <div className="bg-gradient-to-r from-primary to-[#1e6087] h-1"></div>
              <div className="px-3 py-3">
                {pair.map(([key, value]) => (
                  <div key={key} className="flex justify-between mb-0">
                    <span className="font-medium text-sm text-gray-600 capitalize">
                      {key.replace(/_/g, " ")}
                    </span>

                    <span className="font-semibold text-primary text-lg">
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

export default Dashboardv3;
