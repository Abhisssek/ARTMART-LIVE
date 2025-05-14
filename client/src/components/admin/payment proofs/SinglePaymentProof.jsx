import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./SinglePaymentProof.css";
import { Navbar } from "../../Navbar/Navbar";

export const SinglePaymentProof = () => {
  const { id } = useParams();
  const [proof, setProof] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check if user is admin
        setLoading(true);
        const userRes = await fetch(
          "https://artmart-rr3n.onrender.com/api/v1/user/profile",
          {
            credentials: "include",
          }
        );
        const userData = await userRes.json();
        if (userData.user?.role !== "admin") {
          setIsAdmin(false);
          return;
        }

        setLoading(false);
        setIsAdmin(true);

        // Fetch specific payment proof
        const res = await fetch(
          `https://artmart-rr3n.onrender.com/api/v1/admin/paymentproof/${id}`,
          {
            credentials: "include",
          }
        );
        const data = await res.json();
        setProof(data.Proof);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching single payment proof:", err);
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const updateStatus = async (newStatus) => {
    try {
      setUpdating(true);
      setMessage("");

      const res = await fetch(
        `https://artmart-rr3n.onrender.com/api/v1/admin/paymentproof/status/update/${id}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }), // ✅ send status in body
        }
      );

      const data = await res.json();

      if (res.ok) {
        setProof((prev) => ({ ...prev, status: newStatus }));
        setMessage(`✅ Status updated to ${newStatus}`);
      } else {
        setMessage(`❌ ${data.message || "Failed to update status"}`);
        console.error("Backend error:", data);
      }

      setUpdating(false);
    } catch (error) {
      console.error("Failed to update status", error);
      setMessage("❌ Failed to update status");
      setUpdating(false);
    }
  };


  if (loading) {
    return (
      <div className="loader-wrapper">
      <span className="main-loader"></span>
    </div>
    );
  }

  if (!isAdmin) {
    return <p className="unauthorized">Unauthorized: Admins only</p>;
  }

 


  console.log(proof);

  if (!proof) {
    return <p className="loading">Payment proof not found</p>;
  }

  return (
    <>
      <Navbar />
      <div className="container">
        
        <h1 className="single-proof-title">Payment Proof Details</h1>
        <div className="single-proof-card-1">
          <div className=" single-proof-card-main">
            <p>
              <span className="label">User ID:</span> {proof.userid}
            </p>
            <p>
              <span className="label">Amount:</span> ₹{proof.amount}
            </p>
            <p>
              <span className="label">Status:</span> {proof.status}
            </p>
            <p>
              <span className="label">Uploaded At:</span>{" "}
              {new Date(proof.uploadedat).toLocaleString()}
            </p>
            <div style={{ marginTop: "20px", marginBottom: "20px" }}>
              <p className="label">Change Status:</p>
              <div className="status-buttons">
                <button
                  className="primary-btn "
                  disabled={updating}
                  onClick={() => updateStatus("approved")}
                >
                  Approve
                </button>
                <button
                  className="secondary-btn"
                  disabled={updating}
                  onClick={() => updateStatus("rejected")}
                >
                  Reject
                </button>
              </div>

              {message && (
                <p
                  style={{
                    marginTop: "10px",
                    color: message.includes("✅") ? "green" : "red",
                  }}
                >
                  {message}
                </p>
              )}
            </div>
           
          </div>
          
          {proof.proof?.url ? (
            <img
              className="single-proof-card-main-img"
              src={proof.proof?.url}
              alt="Payment Proof"
              style={{ borderRadius: "10px" }}
            />
          ) : (
            <p>No image available</p>
          )}
        </div>
      </div>
    </>
  );
};
