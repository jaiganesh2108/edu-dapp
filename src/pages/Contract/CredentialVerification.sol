// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract CredentialVerification {
    // Structure to store student credentials
    struct Credential {
        string name;
        string rollNo;
        string dob;
        string academicYear;
        string course;
        string ipfsHash;
    }

    // Mapping of registration number to student credential
    mapping(string => Credential) private credentials;

    // Event for logging credential addition
    event CredentialAdded(string indexed rollNo, string ipfsHash);

    // Function to add student credential
    function addCredential(
        string memory _name,
        string memory _rollNo,
        string memory _dob,
        string memory _academicYear,
        string memory _course,
        string memory _ipfsHash
    ) public {
        // Ensure credential is not already stored
        require(bytes(credentials[_rollNo].rollNo).length == 0, "Credential already exists!");

        // Store the credential
        credentials[_rollNo] = Credential(_name, _rollNo, _dob, _academicYear,_course, _ipfsHash);

        // Emit event
        emit CredentialAdded(_rollNo, _ipfsHash);
    }

    // Function to retrieve credential details
    function getCredential(string memory _rollNo) public view returns (
        string memory name,
        string memory dob,
        string memory academicYear,
        string memory course,
        string memory ipfsHash
    ) {
        // Ensure the credential exists
            
        require(bytes(credentials[_rollNo].rollNo).length != 0, "Credential not found!");

        // Return credential details
        Credential memory cred = credentials[_rollNo];
        return (cred.name, cred.dob, cred.academicYear, cred.course, cred.ipfsHash);
    }
}
