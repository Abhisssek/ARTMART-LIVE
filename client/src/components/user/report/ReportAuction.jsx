import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ReportAuction.css"; // Optional: style as you want
import {Navbar} from "../../Navbar/Navbar"; // Adjust the import path as necessary

export const ReportAuction = () => {
  const { id: auctionId } = useParams();
  const navigate = useNavigate();

  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!reason || !description) {
      toast.error("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/api/v1/report-auction/report/${auctionId}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reason, description }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to submit report");
      }

      toast.success("Report submitted successfully.");
      setTimeout(() => navigate("/"), 2000); // Redirect to homepage
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <Navbar/>
    <div className="report-page">
      <ToastContainer />
      <h2>Report Auction</h2>
      <form onSubmit={handleSubmit} className="report-form">
        <label>
          Reason:
          <select value={reason} onChange={(e) => setReason(e.target.value)} required>
            <option value="">Select a reason</option>
            <option value="Inappropriate Content">Inappropriate Content</option>
            <option value="Fraud or Scam">Fraud or Scam</option>
            <option value="Copyright Violation">Copyright Violation</option>
            <option value="Other">Other</option>
          </select>
        </label>

        <label>
          Description:
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Provide more details..."
            required
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit Report"}
        </button>
      </form>
    </div>
    </>
  );
};


