import React, { useEffect, useState } from "react";
import "./MySubmittedReport.css";
import { Navbar } from "../../Navbar/Navbar";

export const MySubmittedReport = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3000/api/v1/report-auction/my-submitted-report", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch reports");
        }
        return res.json();
      })
      .then((data) => {
        setReports(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <>

    <Navbar/>
    <div className="report-container">
      <h1 className="report-heading">My Submitted Reports</h1>

      {loading && (
        <div className="loader-wrapper">
          <span className="main-loader"></span>
        </div>
      )}
      {error && <p className="report-status error">Error: {error}</p>}
      {!loading && !error && reports.length === 0 && (
        <p className="report-status gray">No submitted reports found.</p>
      )}

      <div className="report-list">
        {reports.map((report, index) => (
          <div key={index} className="report-card">
            <div className="auction-info">
              <img
                src={report.auctionId?.images?.[0]?.url}
                alt="Auction"
                className="auction-image"
              />
              <div className="auction-details">
                <h3 className="auction-title">{report.auctionId?.title}</h3>
                <p>
                  <strong>Reason:</strong> {report.reason}
                </p>
                <p>
                  <strong>Description:</strong> {report.description}
                </p>
                <p>
                  <strong>Status:</strong> {report.status}
                </p>
                <p>
                  <strong>Submitted on:</strong>{" "}
                  {new Date(report.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    </>
  );
};
