import React, { useEffect, useState } from "react";
import { Navbar } from "../../../Navbar/Navbar";
import "./CommissionProof.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const CommissionProof = () => {
  const [user, setUser] = useState({});
  const [amount, setAmount] = useState("");
  const [comment, setComment] = useState("");
  const [proof, setProof] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [proofStatus, setProofStatus] = useState("");
  const [allProofs, setAllProofs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await fetch("http://localhost:3000/api/v1/user/profile", {
          credentials: "include",
        });
        const userData = await userRes.json();
        setUser(userData.user);
        setAmount(userData.user.unpaidCommission);

        const proofRes = await fetch("http://localhost:3000/api/v1/commission/my-proof", {
          credentials: "include",
        });
        const proofData = await proofRes.json();

        const proofs = proofData.commissionProofs || [];

        const sortedProofs = [...proofs].sort(
          (a, b) => new Date(b.uploadedat) - new Date(a.uploadedat)
        );

        setAllProofs(sortedProofs);

        if (proofs.length > 0) {
          const latestProof = sortedProofs[0];
          switch (latestProof.status) {
            case "pending":
              setIsSubmitted(true);
              setProofStatus("pending");
              break;
            case "approved":
              setIsSubmitted(true);
              setProofStatus("approved");
              break;
            case "rejected":
            case "settled":
              setIsSubmitted(false);
              setProofStatus(latestProof.status);
              break;
            default:
              console.log("Unknown proof status:", latestProof.status);
          }
        }
      } catch (err) {
        console.error("Data fetch error:", err);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!proof || !amount) {
      toast.warn("Please fill in all required fields.");
      return;
    }

    const formData = new FormData();
    formData.append("proof", proof);
    formData.append("amount", amount);
    formData.append("comment", comment);

    try {
      setLoading(true);

      const res = await fetch("http://localhost:3000/api/v1/commission/proof", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const result = await res.json();

      if (res.ok) {
        toast.success("Proof submitted successfully!");
        setAmount("");
        setComment("");
        setProof(null);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        toast.error(result.message || "Failed to submit proof");
      }
    } catch (err) {
      console.error("Submission error:", err);
      toast.error("An error occurred while submitting the proof.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <ToastContainer position="top-center" autoClose={3000} theme="colored" />
      
      {initialLoading ? (
        <div className="loader-wrapper">
        <span className="main-loader"></span>
      </div>
      ) : (
        <div className="container commission-proof-container">
          <div className="commission-proof-container-2" >
            {proofStatus === "settled" && (
              <div className="commission-settled">
                <p style={{ color: "green", fontSize: "35px" }}>
                  Your proof has been settled.
                </p>
              </div>
            )}

            {proofStatus === "rejected" && (
              <div className="commission-rejected">
                <p style={{ color: "red", fontSize: "35px" }}>
                  Your proof has been rejected.
                </p>
              </div>
            )}

            <div className="auctioneer-commission-proof">
              <>
                <h2 className="commission-title">Auctioneer Commission Proof</h2>

                <div className="commission-user-info">
                  <p>
                    <strong>Name:</strong> {user.profilename}
                  </p>
                  <p>
                    <strong>Email:</strong> {user.email}
                  </p>
                </div>

                {isSubmitted ? (
                  <div className="commission-success">
                    ✅ Payment proof has been submitted. It is currently under
                    review. Your payment Proof Status is{" "}
                    <span style={{ color: "yellow" }}>{proofStatus}</span>
                  </div>
                ) : (
                  <div
                    className="commission-submitted-main-container"
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      gap: "20px",
                      justifyContent: "space-around",
                      width: "100%",
                    }}
                  >
                    <div className="auctioneer-commission-input-parent" style={{ paddingTop: "20px" }}>
                      <form
                        className="commission-form"
                        onSubmit={handleSubmit}
                        encType="multipart/form-data"
                      >
                        <div>
                          <label>Amount (in $):</label>
                          <br />
                          <input
                            className="auctioneer-commission-input"
                            type="number"
                            value={amount}
                            readOnly
                            required
                          />
                        </div>

                        <div>
                          <label>Comment:</label>
                          <br />
                          <textarea
                            className="auctioneer-commission-input"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                          />
                        </div>

                        <div>
                          <label>Upload Proof (image):</label>
                          <br />
                          <input
                            className="auctioneer-commission-input form-control"
                            style={{ padding: "5px" }}
                            type="file"
                            accept="image/*,application/pdf"
                            onChange={(e) => setProof(e.target.files[0])}
                          />
                        </div>

                        <button
                          className="primary-btn"
                          type="submit"
                          disabled={loading}
                        >
                          {loading ? <span className="loader"></span> : "Submit Proof"}
                        </button>
                      </form>
                    </div>
                  </div>
                )}
              </>
            </div>
          </div>
          <div className="commission-proof-container-3" >
            <div className="commission-proof-container-3-main" >
              <h3 style={{ color: "white" }}>All Submitted Proofs</h3>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "15px",
                }}
              >
                {allProofs.map((proof, index) => (
                  <div
                    key={index}
                    style={{
                      border: "1px solid gray",
                      padding: "10px",
                      borderRadius: "8px",
                      backgroundColor: "#1c1c1c",
                      color: "white",
                      width: "100%",
                    }}
                  >
                    <p>
                      <strong>Submitted:</strong>{" "}
                      {new Date(proof.uploadedat).toLocaleString()}
                    </p>
                    <p>
                      <strong>Amount:</strong> ${proof.amount}
                    </p>
                    <p>
                      <strong>Comment:</strong> {proof.comment || "—"}
                    </p>
                    <p>
                      <strong>Status:</strong>{" "}
                      <span
                        style={{
                          color:
                            proof.status === "pending" ||
                            proof.status === "approved"
                              ? "yellow"
                              : proof.status === "rejected"
                              ? "red"
                              : "lightgreen",
                          fontWeight: "bold",
                        }}
                      >
                        {proof.status.toUpperCase()}
                      </span>
                    </p>
                    {proof.image && (
                      <img
                        src={`http://localhost:3000/uploads/${proof.image}`}
                        alt="proof"
                        style={{
                          maxWidth: "100px",
                          maxHeight: "100px",
                          marginTop: "5px",
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
