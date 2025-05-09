import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AllPaymentProofs.css';
import { Navbar } from '../../Navbar/Navbar';

export const AllPaymentProofs = () => {
  const [proofs, setProofs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [proofUser, setProofUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProofs = async () => {
      try {
        setLoading(true);
        const userRes = await fetch("http://localhost:3000/api/v1/user/profile", {
          credentials: "include",
        });
        const userData = await userRes.json();
        if (userData.user?.role !== "admin") {
          
          setIsAdmin(false);
          return;
        }
        console.log("userdata", userData);

        setIsAdmin(true);
        setLoading(false);

        const res = await fetch("http://localhost:3000/api/v1/admin/paymentproofs", {
          credentials: "include",
        });
        const data = await res.json();
        
        const sortedProofs = (data.Proof || []).sort(
          (a, b) => new Date(b.uploadedat) - new Date(a.uploadedat)
        );
        
        setProofUser(data.Proof?.userid);
        setProofs(sortedProofs);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch payment proofs", error);
        setLoading(false);
      }
    };

    fetchProofs();
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/v1/user/profile", {
          credentials: "include",
        });
        const data = await res.json();
        setIsAdmin(data.user?.role === "admin");
      } catch (error) {
        console.error("Failed to fetch user data", error);
      }
    };

    fetchUser();
  }, []);

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


  return (
    <>
    <Navbar />
    <div className="container">
      <div className="payment-proof-con">
      <h1 className="title">All Payment Proofs</h1>

      {proofs.length === 0 ? (
        <p className="loading">No payment proofs found.</p>
      ) : (
        <div className="grid">
          {proofs.map((proof) => (
            <div
              key={proof._id}
              className="proof-card-main"
              onClick={() => navigate(`/single-payment-proof/${proof._id}`)}
            >
              <p>
                <span className="label">User:</span> {proof.userid}
              </p>
              <p>
                <span className="label">Amount:</span> ₹{proof.amount}
              </p>
              <p>
                <span className="label">Status:</span> {proof.status}
              </p>
              <p>
                <span className="label">Date:</span> {new Date(proof.uploadedat).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
      </div>  
    </div>
    </>
  );
};
