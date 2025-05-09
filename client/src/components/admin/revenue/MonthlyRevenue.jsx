import React, { useEffect, useState } from "react";
import "./MonthlyRevenue.css";
import { toast, ToastContainer } from "react-toastify";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import "react-toastify/dist/ReactToastify.css";
import { Navbar } from "../../Navbar/Navbar";

export const MonthlyRevenue = () => {
  const [revenues, setRevenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(true);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const fetchRevenue = async () => {
    try {
      // Admin check
      const userRes = await fetch("http://localhost:3000/api/v1/user/profile", {
        credentials: "include",
      });
      const userData = await userRes.json();
      if (userData.user?.role !== "admin") {
        setIsAdmin(false);
        return;
      }

      const res = await fetch(
        "http://localhost:3000/api/v1/admin/monthly-revenue",
        {
          credentials: "include",
        }
      );

      const data = await res.json();

      if (res.ok && data.success) {
        const mappedRevenues = data.totalMonthlyRevenue.map(
          (revenue, index) => ({
            month: monthNames[index],
            revenue,
          })
        );
        setRevenues(mappedRevenues);
      } else {
        toast.error(data.message || "Failed to fetch monthly revenue");
      }
    } catch (error) {
      toast.error("Error fetching revenue data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRevenue();
  }, []);

  if (!isAdmin) {
    return (
      <div className="monthly-revenue-container">
        <h2>Unauthorized</h2>
        <p>You do not have permission to view this page.</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="monthly-revenue-container">
        <ToastContainer />
        <h2>Monthly Revenue</h2>
        {loading ? (
          <div className="loader-wrapper">
            <span className="main-loader"></span>
          </div>
        ) : revenues.length === 0 ? (
          <p>No revenue data available</p>
        ) : (
          <>
            <div className="revenue-list-container">
              <ul className="revenue-list">
                {revenues.map((item, index) => (
                  <li key={index} className="revenue-item">
                    <span className="month">{item.month}</span>
                    <span className="amount">₹{item.revenue.toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={revenues}
                margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#888" />
              </BarChart>
            </ResponsiveContainer>
          </>
        )}
      </div>
    </>
  );
};
