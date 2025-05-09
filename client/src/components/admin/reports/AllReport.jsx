import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./AllReport.css";
import { useNavigate } from "react-router-dom";
import {Navbar} from "../../Navbar/Navbar";

export const AllReport = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [auctions, setAuctions] = useState([]);
  const [userRole, setUserRole] = useState("");

  const navigate = useNavigate();


 useEffect(() => {
    // fetchAuctions();
    fetchProfile(); // Fetch user role and ID
  }, []);


  const fetchProfile = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/v1/user/profile",
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch profile");
      }

      const data = await response.json();
      setUserRole(data.user.role);
      setUserId(data.user._id);
    } catch (error) {
      console.error("Profile fetch error:", error.message);
    }
  };


 
  const fetchReports = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/v1/report-auction/reports", {
        credentials: "include",
      });
      const data = await res.json();
      setReports(data);
    } catch (err) {
      toast.error("Failed to fetch reports");
      console.error("Failed to fetch reports:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (reportId, newStatus) => {
    try {
      const res = await fetch(`http://localhost:3000/api/v1/report-auction/update/report/${reportId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setReports((prev) =>
          prev.map((r) =>
            r._id === reportId ? { ...r, status: newStatus } : r
          )
        );
        toast.success("Status updated successfully");
      } else {
        toast.error("Failed to update status");
      }
    } catch (err) {
      console.error("Error updating report status:", err);
      toast.error("An error occurred while updating status");
    }
  };

  const handleDelete = async (reportId) => {
    if (!window.confirm("Are you sure you want to delete this report?")) return;

    try {
      const res = await fetch(`http://localhost:3000/api/v1/report-auction/delete/report/${reportId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        setReports((prev) => prev.filter((r) => r._id !== reportId));
        toast.success("Report deleted successfully");
      } else {
        toast.error("Failed to delete report");
      }
    } catch (err) {
      console.error("Error deleting report:", err);
      toast.error("An error occurred while deleting the report");
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);


  if(userRole !== "admin"){
    return <div className="not-authorized">You are not authorized to view this page.</div>;
  }

  return (
    <>
    <Navbar/>
    <div className="reports-container">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2>Auction Reports</h2>
      {loading ? (
        <div className="loader-wrapper">
        <span className="main-loader"></span>
      </div>
      ) : reports.length === 0 ? (
        <p>No reports found.</p>
      ) : (
        <div className="report-list">
          {reports.map((report) => (
            <div className="report-card" key={report._id}>
              <div className="report-header">
                <img
                  src={report.userId.profileImage?.url}
                  alt="User"
                  
                  className="user-img"
                />
                <div>
                  <p><strong>{report.userId.profilename}</strong> ({report.userId.username})</p>
                  <p className="email">{report.userId.email}</p>
                </div>
              </div>

              <div className="report-body">
                <h4>Auction: {report.auctionId.title}</h4>
                <img
                  src={report.auctionId.images[0]?.url}
                  alt="Auction"
                  onClick={() => navigate(`/auction/${report.auctionId._id}`)}
                style={{ cursor: "pointer" }}
                  className="auction-img"
                />
                <p><strong>Reason:</strong> {report.reason}</p>
                <p><strong>Description:</strong> {report.description}</p>
                <p>
                  <strong>Status:</strong>{" "}
                  <select
                    value={report.status}
                    onChange={(e) => handleStatusChange(report._id, e.target.value)}
                  >
                    <option value="resolved">Resolved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </p>
              </div>

              <div className="report-footer">
                <p><small>Reported on: {new Date(report.createdAt).toLocaleString()}</small></p>
                <button className="report-delete-btn" onClick={() => handleDelete(report._id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    </>
  );
};
