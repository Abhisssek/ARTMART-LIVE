import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PaymentSuccess.css';

function PaymentSuccess() {
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
    <div className="payment-success-container">
      <div className="payment-card">
        <div className="icon success">&#10003;</div>
        <h1>Payment Successful!</h1>
        <p>Thank you for your purchase. Your transaction was completed successfully.</p>
        <button className="success-button">
          Redirecting in {countdown}...
        </button>
      </div>
    </div>
  );
}

export default PaymentSuccess;
