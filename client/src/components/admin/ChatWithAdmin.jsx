import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "./ChatWithAdmin.css";
import { Navbar } from "../Navbar/Navbar";

export const ChatWithAdmin = () => {
  const [role, setRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState("");
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [receiverRole, setReceiverRole] = useState("admin");
  const [socket, setSocket] = useState(null);
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const [profileData, setProfileData] = useState(null);
  const [senderId, setSenderId] = useState(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/v1/user/profile", {
          credentials: "include",
        });
        const data = await res.json();

        if (data.user?.role) {
          setRole(data.user.role);
          setUserName(data.user.profilename);
          setUserId(data.user._id);

          if (data.user.role === "auctioneer" || data.user.role === "bidder") {
            setReceiverRole("admin");
          } else if (data.user.role === "admin") {
            setReceiverRole("bidder");
          }
        } else {
          navigate("/login");
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        navigate("/login");
      }
    };

    fetchUserRole();
  }, [navigate]);

  useEffect(() => {
    if (role) {
      const socket = io("http://localhost:3000", {
        query: { role },
      });

      setSocket(socket);
      socket.emit("join_room", role);

      socket.on("receive_message", (newMessage) => {
        setMessages((prev) => [
          ...prev,
          {
            ...newMessage,
            self: newMessage.senderId === userId,
          },
        ]);
        // toast.info(`New message from ${newMessage.senderName}`);
      });

      return () => socket.disconnect();
    }
  }, [role, userId]);

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/v1/user/get-chats", {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();

        const formattedMessages = data.map((msg) => ({
          message: msg.message,
          senderName: msg.senderName,
          senderId: msg.userId,
          self: msg.userId === userId,
        }));

        setMessages(formattedMessages);
      } catch (error) {
        console.error("Error fetching chat history:", error);
      }
    };

    if (role && userId) {
      fetchChatHistory();
    }
  }, [role, userId]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (message.trim() && socket) {
      const newMessage = {
        message,
        senderName: userName,
        senderId: userId,
        self: true,
      };

      socket.emit("send_message", {
        message,
        receiverRole,
        senderName: userName,
        senderId: userId,
      });

      setMessages((prev) => [...prev, newMessage]);
      setMessage("");
      // toast.success("Message sent!");
    }
  };

  const fetchUserProfile = async (selectedUserId) => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/v1/admin/user-profile/${selectedUserId}`,
        {
          credentials: "include",
        }
      );
      const data = await res.json();

      if (data?.user) {
        setProfileData(data.user);
      } else {
        toast.error("User profile not found.");
      }
    } catch (error) {
      toast.error("Error fetching user profile.");
      console.error("Error fetching user profile:", error);
    }
  };

  const handleProfileClick = (selectedUserId) => {
    fetchUserProfile(selectedUserId);
  };

  const clearChats = async () => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/v1/admin/delete-all-chats`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (res.ok) {
        setMessages([]);
        toast.success("Chats cleared successfully!");
      } else {
        toast.error("Error clearing chats.");
      }
    } catch (error) {
      toast.error("Error clearing chats.");
      console.error(error);
    }
  };

  if (!role) return <p>Loading...</p>;

  return (
    <div>
      <Navbar />
      <div className="container">
      <div className="chat-container">
        <h2>Chat with {receiverRole}</h2>
        <div className="messages">
          <div className="chat-box">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`chat-message ${msg.self ? "right" : "left"}`}
              >
                <div className={`bubble ${msg.self ? "you" : ""}`}>
                  <strong>
                    {msg.self ? (
                      "You"
                    ) : role === "bidder" || role === "auctioneer" ? (
                      <span>{msg.senderName}</span>
                    ) : (
                      <span
                        style={{ color: "blue", cursor: "pointer" }}
                        onClick={() => handleProfileClick(msg.senderId)}
                      >
                        {msg.senderName}
                      </span>
                    )}
                    :
                  </strong>{" "}
                  {msg.message}
                </div>
              </div>
            ))}
            <div ref={scrollRef} />
          </div>
        </div>
        <div className="input-container">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault(); // prevents newline (if any) and unexpected behavior
                sendMessage();
              }
            }}
            placeholder="Type your message..."
          />
          <button onClick={sendMessage}>Send</button>
          {role === "admin" && (
            <div className="clear-chats-btn">
              <button onClick={clearChats}>Clear Chats</button>
            </div>
          )}
        </div>
      </div>

      {profileData && (
        <div className="profile-popup">
          <span className="close-btn" onClick={() => setProfileData(null)}>
            ×
          </span>
          <h3>User Profile</h3>
          <p>
            <strong>Name:</strong> {profileData.profilename}
          </p>
          <p>
            <strong>Email:</strong> {profileData.email}
          </p>
          <p>
            <strong>Money spent:</strong> {profileData.moneySpent}$
          </p>
          <p>
            <strong>Phone:</strong> {profileData.phone}
          </p>
          <p>
            <strong>Auction Won:</strong> {profileData.auctionWon}
          </p>
          <p>
            <strong>Role:</strong> {profileData.role}
          </p>
          <p>
            <strong>Suspended:</strong> {profileData.isSuspended ? "Yes" : "No"}
          </p>
        </div>
      )}

      <ToastContainer />
      </div>
    </div>
  );
};
