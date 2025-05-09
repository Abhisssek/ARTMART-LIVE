import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route, createBrowserRouter, RouterProvider } from "react-router-dom";
import './index.css'
import App from './App.jsx'
import React from 'react';
import { Home } from './components/home/Home.jsx';
import { MyAccount } from './components/myaccounts/MyAccount.jsx';
import { UpdateAccount } from './components/updateAcc/UpdateAccount.jsx';
// import { ChangePassword } from './components/updateAcc/ChangePassword.jsx';
import { CreateAuction } from './components/auctions/CreateAuction.jsx';
import { MyAuctions } from './components/auctions/auctioneer/MyAuctions.jsx';
import { SingleAuction } from './components/auctions/single Auction/SingleAuction.jsx';
import { AllAuctions } from './components/auctions/all auctions/AllAuctions.jsx';
import { RepublishAuction } from './components/auctions/auctioneer/RepublishAuction.jsx';
import { CommissionProof } from './components/auctions/auctioneer/commission/CommissionProof.jsx';
import { AllPaymentProofs } from './components/admin/payment proofs/AllPaymentProofs.jsx';
import { SinglePaymentProof } from './components/admin/payment proofs/SinglePaymentProof.jsx';
import { AllUser } from './components/admin/User/AllUser.jsx';
import { MonthlyRevenue } from './components/admin/revenue/MonthlyRevenue.jsx';
import { ChatWithAdmin } from './components/admin/ChatWithAdmin.jsx';
import { MyPlacedBids } from './components/user/my bids/MyPlacedBids.jsx';
// import { MyPlacedAuction } from './components/user/my auctions/MyPlacedAuction.jsx';
import { ReportAuction } from './components/user/report/ReportAuction.jsx';
import { AllReport } from './components/admin/reports/AllReport.jsx';
import { MySubmittedReport } from './components/user/report/MySubmittedReport.jsx';
import { MyBiddedAuctions } from './components/user/my auctions/MyBiddedAuctions.jsx';
import PaymentSuccess from './components/payment/PaymentSuccess.jsx';
import PaymentFailed from './components/payment/PaymentFailed.jsx';
import { Category } from './components/categories/Category.jsx';
import { Contact } from './components/contact/Contact.jsx';
import { Announcement } from './components/admin/announcements/Announcement.jsx';
import { AllAuctionsAdmin } from './components/admin/all auctions admin/AllAuctionsAdmin.jsx';




const router = createBrowserRouter([
  {path: '/', element: <Home />},
  {path: '/myaccount', element: <MyAccount />},
  {path: "/update-account", element: <UpdateAccount />},
  // {path: "/change-password", element: <ChangePassword />},
  {path: '/create-auction', element: <CreateAuction />},
  {path: '/my-auctions', element: <MyAuctions />},
  {path: "/auction/:id", element: <SingleAuction />},
  {path: "/all-auctions", element: <AllAuctions />},
  {path: "/republish-auction/:auctionId", element: <RepublishAuction />},
  {path: "/commission-proof", element: <CommissionProof />},
  {path: '/all-payment-proof', element: <AllPaymentProofs />},
  {path: '/single-payment-proof/:id', element: <SinglePaymentProof />},
  {path:'all-users', element: <AllUser />},
  {path: 'monthly-revenue', element: <MonthlyRevenue />},
  {path: '/chat-with-admin', element: <ChatWithAdmin />},
  {path: '/my-placed-bids', element: <MyPlacedBids />},
  // {path: '/my-placed-auctions', element: <MyPlacedAuction />},
  {path:"/report-auction/:id", element:<ReportAuction />},
  {path: '/all-reports', element:<AllReport/>},
  {path: '/my-submitted-report', element:<MySubmittedReport/>},
  {path: '/payment-success', element: <PaymentSuccess/>},
  {path: '/payment-failed', element: <PaymentFailed/>},
  {path: '/my-bidded-auctions', element: <MyBiddedAuctions />},
  {path: '/category', element: <Category />},
  {path: '/contact-page', element: <Contact />},
  {path: '/announcement', element: <Announcement />},
  {path: '/all-auctions-admin', element: <AllAuctionsAdmin />},

])

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>,
)
