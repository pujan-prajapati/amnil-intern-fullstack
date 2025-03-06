import { useEffect, useState } from "react";
import { DatePicker, Button, Table, Tabs } from "antd";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import dayjs, { Dayjs } from "dayjs";
import { httpGet } from "../../services/axios.service";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const { RangePicker } = DatePicker;

interface DailyReport {
  date: string;
  orderCount: number;
  totalRevenue: number;
}

// daily report
const columns = [
  { title: "Date", dataIndex: "date", key: "date" },
  { title: "Total Orders", dataIndex: "orderCount", key: "orderCount" },
  {
    title: "Total Revenue",
    dataIndex: "totalRevenue",
    key: "totalRevenue",
    render: (value: number) => `Rs. ${value}`,
  },
];

export const Dashboard = () => {
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [dailyReport, setDailyReport] = useState<DailyReport[]>([]);
  const [topSellingProducts, setTopSellingProducts] = useState([]);
  const [topSearchedProducts, setTopSearchedProducts] = useState([]);
  const [monthlySales, setMonthlySales] = useState([]);

  const fetchTotalRevenue = async () => {
    try {
      const response = await httpGet("/report/totalRevenue");
      setTotalRevenue(response.data);
    } catch (error) {
      console.log("Failed to fetch total sales: ", error);
    }
  };
  const fetchTotalOrders = async () => {
    try {
      const response = await httpGet("/report/totalOrders");
      setTotalOrders(response.data);
    } catch (error) {
      console.log("Failed to fetch total sales: ", error);
    }
  };
  const fetchDailyReport = async () => {
    try {
      const response = await httpGet("/report/dailyReport");
      setDailyReport(response.data);
    } catch (error) {
      console.log("Failed to fetch total sales: ", error);
    }
  };
  const fetchTopSellingProducts = async () => {
    try {
      const response = await httpGet("/report/topSellingProducts");
      setTopSellingProducts(response.data);
    } catch (error) {
      console.log("Failed to fetch total sales: ", error);
    }
  };
  const fetchTopSearchedProducts = async () => {
    try {
      const response = await httpGet("/report/topSearchedProducts");
      setTopSearchedProducts(response.data);
    } catch (error) {
      console.log("Failed to fetch total sales: ", error);
    }
  };
  const fetchMonthlyOrders = async () => {
    try {
      const response = await httpGet("/report/monthlySales");
      setMonthlySales(response.data);
    } catch (error) {
      console.log("Failed to fetch total sales: ", error);
    }
  };

  useEffect(() => {
    fetchTotalRevenue();
    fetchTotalOrders();
    fetchDailyReport();
    fetchTopSellingProducts();
    fetchTopSearchedProducts();
    fetchMonthlyOrders();
  }, []);

  const [dates, setDates] = useState<[Dayjs | null, Dayjs | null]>([
    dayjs().startOf("month"),
    dayjs().endOf("month"),
  ]);

  const handleRangeChange = (dates: [Dayjs | null, Dayjs | null]) => {
    setDates(dates);
  };

  const generateReport = async () => {
    if (dates[0] && dates[1]) {
      const from = dates[0].format("YYYY-MM-DD");
      const to = dates[1].format("YYYY-MM-DD");

      const dailyReport = await httpGet(
        `/report/dailyReport?from=${from}&to=${to}`
      );
      setDailyReport(dailyReport.data);

      const monthlySales = await httpGet(
        `/report/monthlySales?from=${from}&to=${to}`
      );
      setMonthlySales(monthlySales.data);
    }
  };

  const resetReport = () => {
    setDates([dayjs().startOf("month"), dayjs().endOf("month")]);
    fetchDailyReport();
    fetchMonthlyOrders();
  };

  const exportExcel = () => {
    const csvData = dailyReport.map((item) => ({
      Date: item.date,
      "Total Orders": item.orderCount,
      "Total Revenue": item.totalRevenue,
    }));

    const worksheet = XLSX.utils.json_to_sheet(csvData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Daily Report");
    XLSX.writeFile(workbook, "daily_report.csv");
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [["Date", "Total Orders", "Total Revenue"]],
      body: dailyReport.map((item) => [
        item.date,
        item.orderCount,
        item.totalRevenue,
      ]),
    });
    doc.save("daily_report.pdf");
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Sales Analytics Dashboard</h2>
        <div className="flex items-center gap-4">
          <RangePicker value={dates} onChange={handleRangeChange} />
          <Button type="primary" onClick={generateReport}>
            Generate Report
          </Button>
          <Button onClick={resetReport}>Reset Filters</Button>
          <br />
          <Button onClick={exportExcel}>Export Excel</Button>
          <Button onClick={exportPDF}>Export PDF</Button>
        </div>
      </div>

      <Tabs
        defaultActiveKey="1"
        items={[
          // overview
          {
            label: "Overview",
            key: "1",
            children: (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="p-4 bg-white shadow rounded-lg">
                  <p className="text-sm">Total Revenue</p>
                  <h3 className="text-2xl font-bold">Rs. {totalRevenue}</h3>
                </div>
                <div className="p-4 bg-white shadow rounded-lg">
                  <p className="text-sm">Total Orders</p>
                  <h3 className="text-2xl font-bold">{totalOrders}</h3>
                </div>
              </div>
            ),
          },

          // daily report
          {
            label: "Daily Report",
            key: "2",
            children: (
              <Table
                dataSource={dailyReport}
                columns={columns}
                pagination={false}
              />
            ),
          },

          // total report
          {
            label: "Total Report",
            key: "3",
            children: (
              <>
                <h4 className="text-lg font-semibold mb-4">
                  Top 10 Selling Products
                </h4>
                <Table
                  dataSource={topSellingProducts}
                  columns={[
                    {
                      title: "Product",
                      dataIndex: ["product", "name"],
                      key: "product",
                    },
                    {
                      title: "Sales",
                      dataIndex: "orderCount",
                      key: "orderCount",
                    },
                    {
                      title: "Revenue",
                      dataIndex: "totalRevenue",
                      render: (value: number) => `Rs. ${value}`,
                      key: "totalRevenue",
                    },
                  ]}
                  rowKey="product.id"
                  pagination={false}
                />
                <h4 className="text-lg font-semibold mb-4 mt-6">
                  Top 10 Searched Products
                </h4>
                <Table
                  dataSource={topSearchedProducts}
                  columns={[
                    { title: "Product", dataIndex: "name", key: "id" },
                    { title: "Views", dataIndex: "views", key: "views" },
                  ]}
                  rowKey="id"
                  pagination={false}
                />
              </>
            ),
          },

          // sales trends
          {
            label: "Sales Trends",
            key: "4",
            children: (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-4 shadow rounded-lg">
                  <h4 className="text-lg font-semibold">Monthly Sales</h4>
                  <LineChart width={400} height={250} data={monthlySales}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                    <Line type="monotone" dataKey="count" stroke="#8884d8" />
                  </LineChart>
                </div>
                <div className="bg-white p-4 shadow rounded-lg">
                  <h4 className="text-lg font-semibold">Monthly Revenue</h4>
                  <BarChart width={400} height={250} data={monthlySales}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                    <Bar dataKey="totalPrice" fill="#82ca9d" />
                  </BarChart>
                </div>
              </div>
            ),
          },
        ]}
      />
    </div>
  );
};
