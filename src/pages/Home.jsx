import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";

export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    const walletAddress = localStorage.getItem("walletAddress");
    if (walletAddress) {
      navigate("/dashboard"); // Redirect if already connected
    }
  }, [navigate]);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });

        console.log("Wallet connected:", accounts[0]);

        localStorage.setItem("walletAddress", accounts[0]); // Store wallet address

        navigate("/dashboard");
      } catch (err) {
        console.error("Connection rejected by user:", err);
      }
    } else {
      alert("MetaMask not detected! Please install MetaMask extension.");
    }
  };

  return (
    <div className="home-wrapper">
      <iframe
        src="https://my.spline.design/perisoft3dphonesoftwaredevelopment-b6d232a6e2833e914236e06052d18d1f/"
        frameBorder="0"
        className="spline-bg"
        title="3D Background"
      ></iframe>

      <div className="home-container">
        <div className="glass-card">
          <h1>🔐 Welcome to <span className="brand">EduChain</span></h1>
          <p>Experience blockchain-powered credential verification!</p>
          <button className="connect-btn" onClick={connectWallet}>
             Connect Wallet
          </button>
        </div>
      </div>
    </div>
  );
}
