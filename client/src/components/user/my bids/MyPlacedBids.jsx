// MyBids.js
import React, { useEffect, useState } from 'react';
import './MyBids.css'; // External CSS
import { useNavigate } from 'react-router-dom';
import {Navbar} from '../../Navbar/Navbar'; // Assuming you have a NavBar component

export const MyPlacedBids = () => {
    const [bids, setBids] = useState([]);
    const navigate = useNavigate();
  
    useEffect(() => {
      fetch('https://artmart-rr3n.onrender.com/api/v1/user/my-placed-bids', {
        credentials: 'include',
      })
        .then(response => response.json())
        .then(data => {
          data.bids.sort((a, b) => new Date(b.biddingtime) - new Date(a.biddingtime));
          if (data.bids) {
            setBids(data.bids);
          }
        })
        .catch(error => console.error('Error fetching bids:', error));
    }, []);
  
    return (
        <>  
        <Navbar /> {/* Assuming you have a NavBar component */}
      <div className="mybids-container">
        <h2>My Placed Bids</h2>
        <table className="mybids-table">
          <thead>
            <tr>
              <th>Bid Amount</th>
              <th>Auction Item ID</th>
              <th>Bidding Time</th>
            </tr>
          </thead>
          <tbody>
            {bids.map(bid => (
              <tr key={bid._id}>
                <td>{bid.amount}</td>
                <td>
                  <span
                    className="auction-link"
                    onClick={() => navigate(`/auction/${bid.auctionitem}`)}
                    style={{ cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    {bid.auctionitem}
                  </span>
                </td>
                <td>{new Date(bid.biddingtime).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </>
    );
  };