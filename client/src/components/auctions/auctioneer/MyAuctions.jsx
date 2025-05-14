import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./MyAuction.css";
import { Navbar } from "../../Navbar/Navbar";
import {
  getTimeRemaining,
  getAuctionStatus,
  formatTime,
} from "../../../../utils/AuctionUtils";

// Initialize Socket.io connection
const socket = io("https://artmart-rr3n.onrender.com");

export const MyAuctions = () => {
  const [auctions, setAuctions] = useState([]);
  const [userRole, setUserRole] = useState("");
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();
  const [haveAuction, setHaveAuction] = useState(true);
  const [initialLoading, setInitialLoading] = useState(false);
  const [loadingStates, setLoadingStates] = useState({});

  useEffect(() => {
    fetchAuctions();
    fetchProfile();
  }, []);

  const fetchAuctions = async () => {
    try {
      setInitialLoading(true); // Set loading state to true
      const response = await fetch(
        "https://artmart-rr3n.onrender.com/api/v1/auction/myauctions",
        {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch auctions");
      }

      const data = await response.json();
      console.log("auction data", data);
      setInitialLoading(false); // Set loading state to false

      if (data.length > 0) {
        setHaveAuction(false);
      }

      data.sort((a, b) => new Date(b.starttime) - new Date(a.starttime));

      const updatedData = data.map((auction) => ({
        ...auction,
        currentbid: auction.currentbid ?? auction.startingprice,
      }));

      setAuctions(updatedData);
    } catch (error) {
      console.error("Error fetching auctions:", error);
    }
  };

  const fetchProfile = async () => {
    try {
      const response = await fetch(
        "https://artmart-rr3n.onrender.com/api/v1/user/profile",
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch profile");
      }

      const datas = await response.json();
      setUserRole(datas.user.role);
      setUserId(datas.user._id);
    } catch (error) {
      console.error("Profile fetch error:", error.message);
    }
  };

  useEffect(() => {
    const handleBidUpdate = (updatedAuction) => {
      setAuctions((prevAuctions) =>
        prevAuctions.map((auction) =>
          auction._id === updatedAuction.auctionId
            ? { ...auction, currentbid: updatedAuction.currentbid }
            : auction
        )
      );
    };

    socket.on("updateBid", handleBidUpdate);
    return () => socket.off("updateBid", handleBidUpdate);
  }, []);

  const deleteAuction = async (auctionId) => {
    try {
      setLoadingStates((prev) => ({ ...prev, [auctionId]: true }));

      const response = await fetch(
        `https://artmart-rr3n.onrender.com/api/v1/auction/delete/${auctionId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete auction");
      }

      setAuctions((prevAuctions) =>
        prevAuctions.filter((auction) => auction._id !== auctionId)
      );

      toast.success("Auction deleted successfully!");
    } catch (error) {
      console.error("Error deleting auction:", error);
      toast.error("Failed to delete auction. Please try again.");
    } finally {
      setLoadingStates((prev) => ({ ...prev, [auctionId]: false }));
    }
  };

  return (
    <div className="auctions-container">
      <ToastContainer position="top-right" autoClose={3000} />
      <Navbar />
      {initialLoading ? (
        <div className="loader-wrapper">
          <span className="main-loader"></span>
        </div>
      ) : (
        <>
          <h2>My Auctions</h2>
          {haveAuction ? (
            <h1 className="no-auction-h1">you haven't create any auction</h1>
          ) : (
            <div className="auctions-grid">
              {auctions.map((auction) => (
                <div key={auction._id} className="auction-card">
                  <img
                    src={
                      auction.images?.length > 0
                        ? auction.images[0].url
                        : "fallback-image-url"
                    }
                    alt={auction.title}
                    className="auction-image"
                    onClick={() => navigate(`/auction/${auction._id}`)}
                    style={{ cursor: "pointer" }}
                  />
                  <div className="auction-text">
                    <h3
                      style={{ cursor: "pointer" }}
                      onClick={() => navigate(`/auction/${auction._id}`)}
                      className="auction-title"
                    >
                      {auction.title}
                    </h3>
                    <p className="auction-description">{auction.description}</p>
                    <p className="auction-price">
                      Artist:{" "}
                      <span className="auction-text-span">
                        {auction.artcreater}
                      </span>
                    </p>
                    <p className="auction-price">
                      Category:{" "}
                      <span className="auction-text-span">
                        {auction.category}
                      </span>
                    </p>
                    <p className="auction-price">
                      Starting Price:{" "}
                      <span style={{ fontWeight: "700" }}>
                        ${auction.startingprice}
                      </span>
                    </p>
                    <p className="auction-price">
                      Payment:{" "}
                      {auction.isPaymentCompleted === true ? (
                        <span className="auction-text-span">Paid</span>
                      ) : (
                        <span className="auction-text-span">Not Paid</span>
                      )}
                    </p>
                    <AuctionCountdown auction={auction} />

                    {userRole === "auctioneer" &&
                      userId === auction.createdby && (
                        <div className="auction-btns">
                          <button
                            onClick={() => deleteAuction(auction._id)}
                            className="delete-btn secondary-btn"
                            disabled={loadingStates[auction._id]}
                          >
                            {loadingStates[auction._id] ? (
                              <span className="loader"></span>
                            ) : (
                              "Delete Auction"
                            )}
                          </button>

                          {new Date() > new Date(auction.endtime) && (
                            <button
                              onClick={() =>
                                navigate(`/republish-auction/${auction._id}`)
                              }
                              className="republish-btn primary-btn"
                            >
                              Republish Auction
                            </button>
                          )}
                        </div>
                      )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

const AuctionCountdown = ({ auction }) => {
  const [timeLeft, setTimeLeft] = useState(
    getTimeRemaining(auction.starttime, auction.endtime)
  );
  const [status, setStatus] = useState(
    getAuctionStatus(auction.starttime, auction.endtime)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeRemaining(auction.starttime, auction.endtime));
      setStatus(getAuctionStatus(auction.starttime, auction.endtime));
    }, 1000);

    return () => clearInterval(interval);
  }, [auction.starttime, auction.endtime]);

  return (
    <div className="auction-count">
      <p className={`auction-timer ${status.color}`}>
        {status.text} - <span>{formatTime(timeLeft)}</span>
      </p>
    </div>
  );
};
