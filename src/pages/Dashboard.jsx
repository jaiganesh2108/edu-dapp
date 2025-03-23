import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ViewCredential from "./ViewCredential";
import UploadCredential from "./UploadCredential";
import Navbar from "../components/Navbar";
import "../styles/Dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("view");

  useEffect(() => {
    const walletAddress = localStorage.getItem("walletAddress");

    console.log("Wallet Address from Local Storage:", walletAddress); // Debugging

    if (!walletAddress) {
      console.warn("No wallet found, redirecting...");
      navigate("/"); // Redirect if no wallet connected
    }
  }, [navigate]);

  const disconnectWallet = () => {
    localStorage.removeItem("walletAddress"); // Remove wallet session
    navigate("/"); // Redirect to home
  };

  return (
    <>
      <Navbar />
      <div className="dashboard-container">
        <header className="dashboard-header">
          <h1 className="dashboard-title">🎓 EduChain Dashboard</h1>
          <p className="dashboard-subtitle">
            Manage and secure your academic credentials with ease.
          </p>
          <button className="disconnect-btn" onClick={disconnectWallet}>
            Disconnect Wallet
          </button>
        </header>

        <div className="tab-buttons">
          <button
            className={`tab-button ${activeTab === "view" ? "active" : ""}`}
            onClick={() => {
              console.log("Switching to View Tab"); // Debugging
              setActiveTab("view");
            }}
          >
            <span className="icon">
              <i className="fas fa-eye" aria-hidden="true"></i>
            </span>
            View Credentials
          </button>

          <button
            className={`tab-button ${activeTab === "upload" ? "active" : ""}`}
            onClick={() => {
              console.log("Switching to Upload Tab"); // Debugging
              setActiveTab("upload");
            }}
          >
            <span className="icon">
              <i className="fas fa-upload" aria-hidden="true"></i>
            </span>
            Upload Credential
          </button>
        </div>

        <div className="tab-content fade-in">
          {activeTab === "view" ? <ViewCredential /> : <UploadCredential />}
        </div>
      </div>
    </>
  );
}
