import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PaymentFailed.css';

function PaymentFailed() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => prev - 1);
    }, 1000);

    const redirectTimer = setTimeout(() => {
      navigate('/my-bidded-auctions');
    }, 3000);

    return () => {
      clearInterval(timer);
      clearTimeout(redirectTimer);
    };
  }, [navigate]);

  return (
    <div className="payment-failed-container">
      <div className="payment-card">
        <div className="icon failed">&#10007;</div>
        <h1>Payment Failed</h1>
        <p>Oops! Something went wrong with your transaction. Please try again.</p>
        <button className="failed-button">
          Redirecting in {countdown}...
        </button>
      </div>
    </div>
  );
}

export default PaymentFailed;
