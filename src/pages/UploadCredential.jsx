import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import CredentialVerificationABI from "./CredentialVerification.json"; // Import ABI JSON file
import "../styles/UploadCredential.css";

const CONTRACT_ADDRESS = "0x353D26023645d72e9ee2fEF71cF7b42739743d1e";

export default function UploadCredential() {
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    studentName: "",
    rollNo: "",
    dob: "",
    academicYear: "",
    course: "",
  });

  useEffect(() => {
    console.log("UploadCredential component mounted"); // Debugging
  }, []);

  const uploadToIPFS = async (file) => {
    if (!file) return alert("Please select a file!");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
        method: "POST",
        headers: {
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI4ZmEzNjU0Yi0xY2E4LTRlM2UtOTA5Ny00Mzc5YjY4YjY0NjkiLCJlbWFpbCI6ImRpbGxpYmFza2VyMUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJGUkExIn0seyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJOWUMxIn1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiMzI5MzRlMmMzMDBmOTRlNmVjNjciLCJzY29wZWRLZXlTZWNyZXQiOiJkODhlZjIxOTcwMDhhMjlmYjJhNjllNGRkYWZiYjhmYjVhZTY1NDI1MmM0ODI4ZDIxYjNhNGU2OGUyN2U1MTIwIiwiZXhwIjoxNzc0MjM2ODQ1fQ.tLnINkGqK56SmKDfjKzTLgSGVK26wFzzSdVVcM5DfZY`, // Replace with actual JWT token
        },
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to upload to IPFS");

      const data = await response.json();
      console.log("Uploaded IPFS Hash:", data.IpfsHash);
      return `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`;
    } catch (error) {
      console.error("IPFS Upload Error:", error);
      alert("IPFS upload failed!");
      return null;
    }
  };

  const storeOnBlockchain = async () => {
    if (!window.ethereum) return alert("Please install MetaMask!");

    try {
      const ipfsHash = await uploadToIPFS(file);
      if (!ipfsHash) return;

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CredentialVerificationABI, signer);

      const tx = await contract.addCredential(
        formData.studentName,
        formData.rollNo,
        formData.dob,
        formData.academicYear,
        formData.course,
        ipfsHash
      );

      await tx.wait();
      alert("Credential stored on blockchain!");
    } catch (error) {
      console.error("Transaction failed:", error);
      alert("Failed to store on blockchain!");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file!");
      return;
    }

    console.log("Uploading File:", file.name);
    await storeOnBlockchain();
  };

  return (
    <div className="upload-container">
      <h2>Upload Student Credential</h2>

      <input
        type="text"
        name="studentName"
        placeholder="Student Name"
        value={formData.studentName}
        onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
        className="upload-input"
      />

      <input
        type="text"
        name="rollNo"
        placeholder="Roll Number"
        value={formData.rollNo}
        onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
        className="upload-input"
      />

      <input
        type="date"
        name="dob"
        value={formData.dob}
        onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
        className="upload-input"
      />

      <input
        type="text"
        name="academicYear"
        placeholder="Academic Year (e.g. 2023-2024)"
        value={formData.academicYear}
        onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
        className="upload-input"
      />

      <input
        type="text"
        name="course"
        placeholder="Course"
        value={formData.course}
        onChange={(e) => setFormData({ ...formData, course: e.target.value })}
        className="upload-input"
      />

      <input
        type="file"
        id="fileInput"
        style={{ display: "none" }}
        onChange={(e) => setFile(e.target.files[0])}
      />

      <label htmlFor="fileInput" className="gradient-button choose-file">
        {file ? file.name : "Choose File"}
      </label>

      <button onClick={handleUpload} className="gradient-button">
        Upload
      </button>
    </div>
  );
}
