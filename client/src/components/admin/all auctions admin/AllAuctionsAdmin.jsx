import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { useNavigate, useLocation } from "react-router-dom";
import "../../auctions/all auctions/AllAuctions.css";
import { Navbar } from "../../Navbar/Navbar";
import { ArtBannerTwo } from "../../extra component/ArtBannerTwo";
import { Footer } from "../../footer/Footer";
import {
  getTimeRemaining,
  getAuctionStatus,
  formatTime,
} from "../../../../utils/AuctionUtils";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


// Initialize socket
const socket = io("http://localhost:3000");

export const AllAuctionsAdmin = () => {
  const [auctions, setAuctions] = useState([]);
  const [userRole, setUserRole] = useState("");
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const categories = [
    "Renaissance",
    "Romanticism",
    "Impressionism",
    "Surrealism",
    "Abstract",
    "Baroque",
    "Modern",
    "Contemporary",
    "Cubism",
    "Pop Art",
  ];

  useEffect(() => {
    fetchAuctions();
    fetchProfile();
  }, []);

  const fetchAuctions = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "http://localhost:3000/api/v1/admin/all-auctions-admin",
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
      if (!Array.isArray(data)) {
        throw new Error("Invalid data format received");
      }

      const sortedData = data.sort(
        (a, b) => new Date(b.starttime) - new Date(a.starttime)
      );
      const updatedData = sortedData.map((auction) => ({
        ...auction,
        currentbid: auction.currentbid ?? auction.startingprice,
        blacklisted: auction.isBlacklisted ?? false, // 👈 add this line
      }));

      setTimeout(() => {
        setAuctions(updatedData);
        setLoading(false);
      }, 2000);
    } catch (error) {
      console.error("Error fetching auctions:", error.message);
      setLoading(false);
    }
  };

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


  const toggleBlacklist = async (auctionId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/v1/admin/blacklist/${auctionId}`, {
        method: "PATCH", // or "POST" depending on your API
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) throw new Error("Failed to toggle blacklist");
  
      const updatedAuction = await response.json();
      
  
      setAuctions((prevAuctions) =>
        prevAuctions.map((auction) =>
          auction._id === auctionId
            ? { ...auction, blacklisted: updatedAuction.blacklisted }
            : auction
        )
      );

      // toast.success("Auction blacklisted successfully!");
    } catch (err) {
      console.error("Error toggling blacklist:", err.message);
    }
  };
  

  useEffect(() => {
    const handleBidUpdate = (updatedAuction) => {
      setAuctions((prev) =>
        prev.map((auction) =>
          auction._id === updatedAuction.auctionId
            ? { ...auction, currentbid: updatedAuction.currentbid }
            : auction
        )
      );
    };

    socket.on("updateBid", handleBidUpdate);
    return () => socket.off("updateBid", handleBidUpdate);
  }, []);

  useEffect(() => {
    if (location.state?.preSelectedCategory) {
      setSelectedCategories([location.state.preSelectedCategory]);
      setFilterOpen(true);
    }
  }, [location.state]);

  const getStatusPriority = (statusText) => {
    switch (statusText) {
      case "Auction Active":
        return 0;
      case "Auction Not Started":
        return 1;
      case "Auction Ended":
        return 2;
      default:
        return 3;
    }
  };

  const filteredAuctions = auctions
    .filter((auction) => {
      const status = getAuctionStatus(auction.starttime, auction.endtime).text;
      const statusMatch = filter === "all" || status === filter;
      const categoryMatch =
        selectedCategories.length === 0
          ? true
          : selectedCategories.some((cat) =>
              auction.category?.toLowerCase().includes(cat.toLowerCase())
            );
      return statusMatch && categoryMatch;
    })
    .sort((a, b) => {
      const aStatus = getAuctionStatus(a.starttime, a.endtime).text;
      const bStatus = getAuctionStatus(b.starttime, b.endtime).text;
      return getStatusPriority(aStatus) - getStatusPriority(bStatus);
    });

  if (userRole !== "admin") {
    return (
      <div className="not-authorized">
        <h2>You are not authorized to view this page.</h2>
        <button onClick={() => navigate("/")}>Go to Home</button>
      </div>
    );
  }

  return (
    <div className="auctions-container">
      <ToastContainer position="top-right" autoClose={3000} />
      <Navbar />
      <ArtBannerTwo />
      <h2>All Auctions</h2>

      <div className="auction-filter">
        {["all", "Auction Active", "Auction Not Started", "Auction Ended"].map(
          (type) => (
            <label key={type}>
              <input
                type="radio"
                name="filter"
                value={type}
                checked={filter === type}
                onChange={() => setFilter(type)}
              />
              {type}
            </label>
          )
        )}
      </div>

      {loading ? (
        <div className="loader-wrapper">
          <span className="main-loader"></span>
        </div>
      ) : (
        <div className="category-sidebar-main">
          {!filterOpen && (
            <div
              className="filter-category"
              onClick={() => setFilterOpen(true)}
            >
              <i className="fa-solid fa-filter filter-icon-auction"></i>
              <span className="filter-auction-text-span"> Filter</span>
            </div>
          )}

          <div
            className={`category-sidebar ${filterOpen ? "filter-open" : ""}`}
          >
            {filterOpen && (
              <div
                className="close-filter"
                onClick={() => setFilterOpen(false)}
              >
                ✖
              </div>
            )}
            <h4>Filter by Category</h4>
            {categories.map((category) => (
              <label key={category}>
                <input
                  type="checkbox"
                  value={category}
                  checked={selectedCategories.includes(category)}
                  onChange={() =>
                    setSelectedCategories((prev) =>
                      prev.includes(category)
                        ? prev.filter((c) => c !== category)
                        : [...prev, category]
                    )
                  }
                />
                {category}
              </label>
            ))}
            <div className="auction-filter-2">
              {[
                "all",
                "Auction Active",
                "Auction Not Started",
                "Auction Ended",
              ].map((type) => (
                <label key={type}>
                  <input
                    type="radio"
                    name="filter"
                    value={type}
                    checked={filter === type}
                    onChange={() => setFilter(type)}
                    className="radio-input-auction"
                  />
                  {type}
                </label>
              ))}
            </div>
          </div>

          <div className="auctions-grid-main">
            {filteredAuctions.map((auction) => (
              <div
                key={auction._id}
                className="card"
                onClick={() => navigate(`/auction/${auction._id}`)}
              >
                <div
                  className="card-image"
                  style={{
                    backgroundImage: `url(${
                      auction.images?.[0]?.url || "fallback-image-url"
                    })`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                ></div>
                <div className="category">
                  {auction.category || "Uncategorized"}
                </div>
                <div className="heading">
                  {auction.title}
                  <div className="author">
                    By <span className="name">{auction.artcreater}</span> •{" "}
                    {new Date(auction.starttime).toLocaleDateString()}
                  </div>
                  <div className="price-all-auction">
                    <span className="current-bid-all-auction">
                      ${auction.startingprice}
                    </span>
                  </div>
                  <div className="auction-status-all-auction">
                    <AuctionCountdown auction={auction} />
                  </div>
                  {userRole === "admin" && (
                    <div className="">
                      <button
                        className={`btn btn-info blacklist-button ${
                          auction.blacklisted ? "blacklisted" : "whitelisted"
                        }`}
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent navigation on card click
                          toggleBlacklist(auction._id);
                        }}
                      >
                        {auction.blacklisted
                          ? "Remove from Blacklist"
                          : "Blacklist"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

// Countdown Component
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
      <p className="auction-timer-all-auction">
        {status.text} - <span>{formatTime(timeLeft)}</span>
      </p>
    </div>
  );
};

// Optional: Bid History component if needed
const BidHistory = ({ bids }) => {
  if (!bids || bids.length === 0) {
    return <p className="bid-history">No bids yet.</p>;
  }

  return (
    <div className="bid-history">
      <h4>Bid History</h4>
      <ul>
        {bids.map((bid, index) => (
          <li key={index}>
            <span className="bid-amount">${bid.amount}</span> by{" "}
            <span className="bid-user">{bid.bidderName}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
