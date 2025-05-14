import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import {
  getTimeRemaining,
  getAuctionStatus,
  formatTime,
} from "../../../../utils/AuctionUtils";
import { Navbar } from "../../Navbar/Navbar";
import "./SingleAuction.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
// import { createIndexes } from "../../../../../backend/models/auctionSchema";

const socket = io("https://artmart-rr3n.onrender.com");

export const SingleAuction = () => {
  const { id } = useParams();
  const [auction, setAuction] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [status, setStatus] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [bidAmount, setBidAmount] = useState("");
  const [auctionEnded, setAuctionEnded] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [winner, setWinner] = useState(null); // ✅ Add this near other useState hooks
  const [initialLoading, setInitialLoading] = useState(true); // ✅ For loader
  const [auctionStarted, setAuctionStarted] = useState(true);



 


  // ✅ Fetch auction details
  const refetchAuction = async () => {
    try {
      const res = await fetch(`https://artmart-rr3n.onrender.com/api/v1/auction/${id}`);
      if (!res.ok) throw new Error(`HTTP Error! Status: ${res.status}`);
      const data = await res.json();

      console.log("ReFetched auction data:", data.auctionItem);

      if (data.auctionItem) {
        setAuction(data.auctionItem);
        setMainImage(data.auctionItem.images?.[0]?.url || "/placeholder.jpg");
      } else {
        console.error("auctionItem not found in response");
      }
    } catch (error) {
      console.error("Error fetching auction:", error);
      toast.error("Failed to fetch auction data. Please try again later.");
    } finally {
      setInitialLoading(false); // ✅ Stop loader
    }
  };

  useEffect(() => {
    refetchAuction();
  }, [id]);

  useEffect(() => {
    if (auction) {
      setTimeLeft(getTimeRemaining(auction.starttime, auction.endtime));
      setStatus(getAuctionStatus(auction.starttime, auction.endtime));
    }
  }, [auction]);


   // ✅  refetch auction every 3 seconds 
  //  setInterval(() => {
  //   refetchAuction();
  // }, 3000);
   



  useEffect(() => {
    if (auction && auction.starttime) {
      const startTime = new Date(auction.starttime).getTime(); // Ensure correct date format
      if (startTime < Date.now()) {
        setAuctionStarted(true); // Auction has started
      } else {
        setAuctionStarted(false); // Auction hasn't started yet
      }
    }
  }, [auction]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(
          "https://artmart-rr3n.onrender.com/api/v1/user/profile",
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!response.ok) throw new Error("Failed to fetch profile");

        const userData = await response.json();
        setUserRole(userData.user.role);
        setUserId(userData.user._id);
      } catch (error) {
        console.error("Profile fetch error:", error.message);
      }
    };
    fetchProfile();
  }, []);


  
  
  useEffect(() => {
    if (!auction) return;
    console.log("auctions", auction);

    socket.emit("joinAuction", id);

    socket.on("updateBid", (bidData) => {
      if (bidData.auctionId === auction._id) {
        setAuction((prevAuction) => ({
          ...prevAuction,
          currentbid: bidData.currentbid,
          highestbidder: bidData.highestbidder,
          bids: bidData.auctionBids,
          time: new Date(bidData.time).toLocaleString()
        }));
      }


      // const bidTimes = bidData.auctionBids.map((bid) => {

      // })

      console.log("Bid data received:", bidData);
      
    });


    return () => {
      socket.off("updateBid");
    };
  }, [id, auction]);

  useEffect(() => {
    if (!auction) return;

    const interval = setInterval(() => {
      const remainingTime = getTimeRemaining(
        auction?.starttime,
        auction?.endtime
      );
      setTimeLeft(remainingTime);
      setStatus(getAuctionStatus(auction?.starttime, auction?.endtime));

      if (remainingTime?.total <= 0) {
        clearInterval(interval);
        setAuctionEnded(true);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [auction]);

  const handleNotifyMe = async () => {
    try {
      const response = await fetch(
        `https://artmart-rr3n.onrender.com/api/v1/user/notify/${id}`,
        {
          method: "POST",
          credentials: "include", // important if using cookies for auth
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "something is wrong with notification");
      } else {
        toast.info("you will be notified when auction is start");
      }
    } catch (err) {
      console.error("Notify error:", err);
      toast.error(data.message || "error on notify user");
    }
  };

  // ✅ Updated place bid function (no reload)
  const placeBid = async () => {
    if (auctionEnded) {
      toast.error("Auction has ended. No more bids allowed.");
      return;
    }

    const bidValue = parseFloat(bidAmount);
    if (
      !bidValue ||
      isNaN(bidValue) ||
      bidValue <= auction?.currentbid ||
      bidValue <= 0 ||
      bidValue < auction?.startingprice
    ) {
      toast.error(
        `Bid must be higher than the current bid ($${auction?.currentbid}) and starting price ($${auction?.startingprice})`
      );
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `https://artmart-rr3n.onrender.com/api/v1/bid/place/${auction._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ amount: bidValue }),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to place bid");
      }

      setBidAmount("");
      await refetchAuction(); // ✅ Refresh manually
      toast.success("Bid placed successfully!");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error(error.message || "Failed to place bid. Please try again.");
      console.error("Bid placement error:", error);
    }
  };

  useEffect(() => {
    if (!auction) return;

    const interval = setInterval(async () => {
      const remainingTime = getTimeRemaining(
        auction.starttime,
        auction.endtime
      );
      setTimeLeft(remainingTime);
      setStatus(getAuctionStatus(auction.starttime, auction.endtime));
      // console.log("Fetching auction data after end...", remainingTime);

      if (remainingTime <= 0) {
        clearInterval(interval);
        setAuctionEnded(true);

        try {
          const res = await fetch(`https://artmart-rr3n.onrender.com/api/v1/auction/${id}`);
          const data = await res.json();
          const updatedAuction = data.auctionItem;

          if (updatedAuction) {
            setAuction(updatedAuction);

            if (updatedAuction.bids?.length > 0) {
              const topBid = updatedAuction.bids.reduce((prev, curr) =>
                Number(curr.amount) > Number(prev.amount) ? curr : prev
              );
              setWinner(topBid.biddername || "Anonymous");
            } else {
              setWinner(null);
            }
          }
        } catch (error) {
          console.error("Failed to refetch auction after end:", error);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [id, auction?.starttime, auction?.endtime]);

  // const highestBid = Math.max(...auction.bids.map(bid => Number(bid.amount)));
  const highestBid = auction?.bids?.length
    ? Math.max(...auction.bids.map((bid) => Number(bid.amount)))
    : auction?.startingprice || 0; // Default to starting price if no bids

  // console.log("Highest bid:", highestBid);

  if (initialLoading) {
    return (
      <div className="loader-wrapper">
        <span className="main-loader"></span>
      </div>
    );
  }

  console.log(userRole);

  if (!auction) return <h2>Loading Auction...</h2>;

  return (
    <div className="single-auction">
      <Navbar />
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="container-2">
        <div className="single-auction-container">
          {/* Left Section */}
          <div className="image-gallery">
            <img className="main-image" src={mainImage} alt="Auction Item" />
            <div className="thumbnail-container">
              {auction.images?.map((image, index) => (
                <img
                  key={index}
                  className={`thumbnail ${
                    mainImage === image.url ? "selected" : ""
                  }`}
                  src={image.url}
                  alt={`Thumbnail ${index + 1}`}
                  onClick={() => setMainImage(image.url)}
                />
              ))}
            </div>
          </div>

          {/* Right Section */}
          <div className="auction-details">
            <h1 className="auction-title">{auction.title}</h1>
            <p className="auction-description">
              <strong>Description:</strong> {auction.description}
            </p>
            <p className="auction-seller">
              <strong>Created By:</strong> {auction.artcreater || "Unknown"}
            </p>
            <p className="item-info">
              <strong>Item condition:</strong> {auction.condition}
            </p>
            <p className="item-info">
              <strong>Starting price:</strong> ${auction.startingprice}
            </p>
            <p className="current-bid">
              <strong>Current bid:</strong> ${auction.currentbid}
            </p>
            <p className="auction-status">
              <strong>Status:</strong>{" "}
              <span style={{ color: status?.color }}>{status?.text}</span>
            </p>
            <p className="item-info">
              <strong>Ending Time:</strong>{" "}
              {new Date(auction.endtime).toLocaleString()}
            </p>

            {auctionEnded ? (
              <div className="auction-ended">
                🚨 Auction has ended. No more bids allowed.
                {winner && (
                  <div className="winner-announcement">
                    🏆 <strong>{winner}</strong> has won this auction!
                  </div>
                )}
              </div>
            ) : (
              <AuctionCountdown auction={auction} />
            )}

            {userRole === "bidder" && !auctionEnded && auctionStarted ? (
              <div className="bid-section">
                <input
                  type="number"
                  className="bid-input"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  placeholder="Enter bid amount"
                  disabled={loading}
                />
                <button
                  className="bid-button"
                  onClick={placeBid}
                  disabled={loading}
                >
                  {loading ? <span className="loader"></span> : "Place Bid"}
                </button>
              </div>
            ) : (
              userRole !== "admin" &&
              userRole !== "auctioneer" &&
              !auctionEnded && (
                <button
                  onClick={handleNotifyMe}
                  className="notify-button btn btn-info"
                >
                  Notify Me
                </button>
              )
            )}

            <div className="bid-history-container-1">
              <h3>Bid History</h3>
            <div className="bid-history">
              <ul className="bid-list">
                {auction.bids?.length > 0 ? (
                  auction.bids.map((bid, index) => {
                    const isTopBid = Number(bid.amount) === highestBid;
                    return (
                      <li
                        key={index}
                        className={`bid-item ${isTopBid ? "top-bid" : ""}`}
                      >
                        <strong>{bid.biddername || "Anonymous"}</strong>$
                        {bid.amount}
                        <span className="bid-timestamp">
                        {console.log("Bid time:", bid)}
                          ({new Date(bid.time).toLocaleString()})
                        </span>
                      </li>
                    );
                  })
                ) : (
                  <p>No bids yet.</p>
                )}
              </ul>
            </div>
            </div>

            <div className="bidding-rules">
              <h3>Bidding Rules:</h3>
              <ul>
                <li>
                  The bid amount must be higher than the current highest bid.
                </li>
                <li>Bids are final and cannot be withdrawn.</li>
                <li>
                  Ensure that your payment method is valid before bidding.
                </li>
                <li>The highest bidder at the end of the auction wins.</li>
              </ul>
            </div>
            {userRole === "bidder" || userRole === "auctioneer" ? (
              <div className="report-auction">
                <h3>Report Auction</h3>
                <p>
                  If you find any issues with this auction, please report it.
                </p>
                <Link to={`/report-auction/${id}`}>
                  <button className="report-button btn btn-danger">
                    Report Auction
                  </button>
                </Link>
              </div>
            ) : null}
          </div>
        </div>
      </div>
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
