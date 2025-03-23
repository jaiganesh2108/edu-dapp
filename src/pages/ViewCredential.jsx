import React, { useState } from "react";
import { ethers } from "ethers";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/ViewCredential.css";
import CredentialVerificationABI from "./CredentialVerification.json";

const contractAddress = "0x353D26023645d72e9ee2fEF71cF7b42739743d1e";

const containerVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.15, when: "beforeChildren" },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function ViewCredential() {
  const [formData, setFormData] = useState({
    studentName: "",
    rollNo: "",
    dob: "",
    academicYear: "",
    course: "",
    ipfsHash: "",
  });

  const [verificationMessage, setVerificationMessage] = useState("");
  const [verifiedData, setVerifiedData] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value.trim(),
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent page reload
    verifyCredential();
  };

  

  const normalizeIpfsHash = (hash) => {
    return hash.startsWith("https://gateway.pinata.cloud/ipfs/")
      ? hash.replace("https://gateway.pinata.cloud/ipfs/", "")
      : hash;
  };

  const verifyCredential = async () => {
    if (!window.ethereum) {
      setVerificationMessage("Please install MetaMask!");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(
        contractAddress,
        CredentialVerificationABI,
        provider
      );

      const result = await contract.getCredential(formData.rollNo.trim());
      if (!result || result.length === 0) {
        setVerificationMessage("Credential not found.");
        return;
      }

      const blockchainData = {
        name: result[0],
        dob: result[1],
        academicYear: result[2],
        course: result[3],
        ipfsHash: result[4],
      };

      console.log("User Input:", formData);
      console.log("Blockchain Data:", blockchainData);

      if (
        formData.studentName.toLowerCase() === blockchainData.name.toLowerCase() &&
        formData.dob === blockchainData.dob &&
        formData.academicYear === blockchainData.academicYear &&
        formData.course === blockchainData.course &&
        normalizeIpfsHash(formData.ipfsHash) === normalizeIpfsHash(blockchainData.ipfsHash)
      ) {
        setVerificationMessage("Credential Verified Successfully!");
        setVerifiedData(blockchainData);
      } else {
        setVerificationMessage("Credential Mismatch!");
        setVerifiedData(null);
      }
    } catch (err) {
      console.error("Error fetching credential:", err);
      setVerificationMessage("Credential not found or an error occurred.");
      setVerifiedData(null);
    }
  };

  return (
    <motion.div
      className="view-credential-container"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h2 className="section-title" variants={itemVariants}>
        Verify Credential
      </motion.h2>

      <motion.form className="credential-form" onSubmit={handleSubmit} variants={itemVariants}>
        <div className="form-group">
          <label htmlFor="studentName">Student Name</label>
          <input
            type="text"
            id="studentName"
            name="studentName"
            value={formData.studentName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="rollNo">Roll Number</label>
          <input
            type="text"
            id="rollNo"
            name="rollNo"
            value={formData.rollNo}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="dob">Date of Birth</label>
          <input
            type="date"
            id="dob"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="academicYear">Academic Year</label>
          <input
            type="text"
            id="academicYear"
            name="academicYear"
            value={formData.academicYear}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="course">Course</label>
          <input
            type="text"
            id="course"
            name="course"
            value={formData.course}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="ipfsHash">IPFS Hash</label>
          <input
            type="text"
            id="ipfsHash"
            name="ipfsHash"
            value={formData.ipfsHash}
            onChange={handleChange}
            required
          />
        </div>

        <motion.button
          type="submit"
          className="submit-button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          variants={itemVariants}
        >
          Submit Credential
        </motion.button>
      </motion.form>

      <AnimatePresence>
        {verificationMessage && (
          <motion.p
            className="verification-message"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {verificationMessage}
          </motion.p>
        )}
      </AnimatePresence>

      {verifiedData && (
        <motion.div className="credential-card" variants={itemVariants}>
          <p><strong>Name:</strong> {verifiedData.name}</p>
          <p><strong>DOB:</strong> {verifiedData.dob}</p>
          <p><strong>Academic Year:</strong> {verifiedData.academicYear}</p>
          <p><strong>Course:</strong> {verifiedData.course}</p>
          <p><strong>IPFS Hash:</strong> {verifiedData.ipfsHash}</p>
          // <iframe
                    src={verifiedData.ipfsHash}
                    width="100%"
                    height="600px"
                />
        </motion.div>
      )}
    </motion.div>
  );
}
