import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../auctions/CreateAuction.css";
import { Navbar } from "../../Navbar/Navbar.jsx";
import { useNavigate, useParams } from "react-router-dom";

export const RepublishAuction = () => {
  const { auctionId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // Separate states for better control
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startingBid, setStartingBid] = useState(""); // Updated this to `newStartingBid`
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");
  const [artCreator, setArtCreator] = useState("");
  const [artStyle, setArtStyle] = useState("");
  const [artMadeDate, setArtMadeDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endingTime, setEndingTime] = useState("");
  const [loader, setLoader] = useState(false)

  useEffect(() => {
    if (auctionId) {
      fetchAuctionDetails();
    }
  }, [auctionId]);

  const fetchAuctionDetails = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/auction/${auctionId}`,
        { method: "GET", credentials: "include" }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch auction details");
      }

      const data = await response.json();

      if (!data || !data.auctionItem) {
        toast.error("Auction not found.");
        setLoading(false);
        return;
      }

      const auction = data.auctionItem; // Extract the actual auction details

      // Update state with the fetched auction details
      setTitle(auction.title || "");
      setDescription(auction.description || "");
      setStartingBid(auction.startingprice || ""); // Ensure this is `startingBid`
      setCategory(auction.category || "");
      setCondition(auction.condition || "");
      setArtCreator(auction.artcreater || "");
      setArtStyle(auction.artstyle || "");
      setArtMadeDate(auction.artmadedate ? auction.artmadedate.split("T")[0] : "");
      setStartTime(
        auction.starttime
          ? new Date(Date.parse(auction.starttime)).toISOString().slice(0, 16)
          : ""
      );
      setEndingTime(
        auction.endtime
          ? new Date(Date.parse(auction.endtime)).toISOString().slice(0, 16)
          : ""
      );

      setLoading(false);
    } catch (error) {
      console.error("Error fetching auction:", error);
      toast.error("Failed to fetch auction details.");
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoader(true)
  
    try {
      const payload = {
        starttime: startTime ? new Date(startTime).toISOString() : null,
        endtime: endingTime ? new Date(endingTime).toISOString() : null,
        newStartingBid: Number(startingBid), // Correct key as per backend
      };


      // console.log("payload", payload);
      
  
      const response = await fetch(
        `http://localhost:3000/api/v1/auction/republish/${auctionId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
          credentials: "include",
        }
      );
  
      const data = await response.json();
      if (!response.ok) {
        toast.error(data.msg || "Failed to republish auction");
        setLoader(false)
        return;
      }
  
      toast.success("Auction republished successfully!");
      setLoader(false)
      setTimeout(() => navigate("/my-auctions"), 4000);
    } catch (error) {
      console.error("Error:", error.message);
      toast.error(error.message);
    }
  };

  return (
    <div className="create-auction">
      <ToastContainer position="top-right" autoClose={4000} />
      <Navbar />
      <div className="auction-container">
        <h2>Republish Auction</h2>
        {loading ? (
          <p>Loading auction details...</p>
        ) : (
          <form onSubmit={handleSubmit} className="auction-form" encType="multipart/form-data">
            <label htmlFor="title">Title</label>
            <input type="text" id="title" name="title" value={title} onChange={(e) => setTitle(e.target.value)} required />

            <label htmlFor="description">Description</label>
            <textarea id="description" name="description" value={description} onChange={(e) => setDescription(e.target.value)} required />

            <label htmlFor="startingBid">Starting Price</label>
            <input 
              type="number" 
              id="startingBid" 
              name="startingBid" 
              value={startingBid} 
              onChange={(e) => setStartingBid(e.target.value)} 
              required 
            />

            <label htmlFor="startTime">Auction Start Time</label>
            <input type="datetime-local" id="startTime" name="startTime" value={startTime} onChange={(e) => setStartTime(e.target.value)} required />

            <label htmlFor="endingTime">Auction End Time</label>
            <input type="datetime-local" id="endingTime" name="endingTime" value={endingTime} onChange={(e) => setEndingTime(e.target.value)} required />

            <button type="submit" className="primary-btn" disabled={loader}>
            {loader ? <span className="loader"></span> : "Republish Auction"}
          </button>
          </form>
        )}
      </div>
    </div>
  );
};
