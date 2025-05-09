import React, { useEffect, useState } from "react";
import "./MyBiddedAuctions.css";
import { Navbar } from "../../Navbar/Navbar";

export const MyBiddedAuctions = () => {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetchBiddedAuctions();
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/v1/user/profile",
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (response.ok) {
          const data = await response.json();
          setProfile(data.user);
          // console.log("User Profile:", data.user);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  const fetchBiddedAuctions = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/v1/user/my-bidded-auctions", {
        credentials: "include",
      });
      const data = await res.json();
      // console.log("Bidded Auctions Data:", data);
      if (data.success) {
        setAuctions(data.auctions);
      }
    } catch (err) {
      console.error("Error fetching bidded auctions:", err);
    } finally {
      setLoading(false);
    }
  };

  const getAuctionStatus = (auction) => {
    const now = new Date();
    const endtime = new Date(auction.endtime);

    if (endtime > now) {
      return "Ongoing";
    }

    const highestBidderId = typeof auction.highestbidder === "object"
      ? auction.highestbidder._id
      : auction.highestbidder;

    if (highestBidderId?.toString() === profile?._id?.toString()) {
      return "Won";
    }

    return "Lost";
  };

  const handlePayment = async (auctionId, bidAmount) => {
    try {
      const res = await fetch("http://localhost:3000/api/v1/payment/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ auctionId, bidAmount }),
      });

      const data = await res.json();
      console.log("Payment Response:", data);

      if (data.success && data.url) {
        window.location.href = data.url;
      } else {
        alert(data.message || "Payment session creation failed");
      }
    } catch (err) {
      console.error("Payment Error:", err);
      alert("Something went wrong!");
    }
  };

  return (
    <>
    <Navbar/>
    <div className="bidded-auctions-container">
      <h2 className="page-title">My Bidded Auctions</h2>
      <hr className="separator" />

      {loading ? (
        <p className="loading">Loading auctions...</p>
      ) : auctions.length === 0 ? (
        <p className="no-auctions">You haven't bidded on any auctions yet.</p>
      ) : (
        <div className="auction-list">
          {auctions.map((auction) => {
           const status = getAuctionStatus(auction);
           const userBids = auction.bids.filter(
             (bid) => bid.bidder === profile?._id
           );
           const myBid = userBids.length
             ? Math.max(...userBids.map((bid) => Number(bid.amount)))
             : null;

            // console.log("Current Bid:", myBid);
            

            return (
              <div className="auction-item" key={auction._id}>
                <h3 className="auction-title">
                  {auction.title}
                  {status === "Won" && (
                    <span className="won-badge">🏆 You Won!</span>
                  )}
                </h3>
                <p>My Highest Bid: {myBid !== null ? `$${myBid}` : "No bids placed"}</p>
                <p><strong>Status:</strong> <span className={`status ${status.toLowerCase()}`}>{status}</span></p>
                <p><strong>Ends On:</strong> {new Date(auction.endtime).toLocaleString()}</p>

                {status === "Won" && (
                  auction.isPaymentCompleted ? (
                    <p className="payment-completed-payment-session">✅ Payment Completed</p>
                  ) : (
                    <button className="pay-btn" onClick={() => handlePayment(auction._id, auction.currentbid)}>
                      Pay Now
                    </button>
                  )
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
    </>
  );
};
