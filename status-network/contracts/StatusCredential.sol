// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/// @title StatusCredential - Minimal attestation contract for Status Network testnet demos
/// @notice Allows the contract owner (agent) to issue XP-based credentials with an off-chain proof URI to any learner address.
contract StatusCredential {
    struct Credential {
        uint256 xp;
        string proofUri;
        uint64 issuedAt;
        address issuer;
    }

    address public immutable owner;

    mapping(address => Credential[]) private _credentials;

    event CredentialIssued(address indexed learner, uint256 indexed index, uint256 xp, string proofUri, uint64 issuedAt, address indexed issuer);

    error NotOwner();
    error InvalidLearner();
    error InvalidProof();

    constructor(address _owner) {
        require(_owner != address(0), "owner required");
        owner = _owner;
    }

    /// @notice Issues a credential for a learner with XP + proof metadata.
    /// @param learner Address receiving the credential.
    /// @param xp Amount of XP awarded (arbitrary units).
    /// @param proofUri Off-chain or on-chain URI referencing concrete proof (e.g., IPFS, Arweave, https link).
    /// @return index The index of the credential in the learner's history for explorer verification.
    function issueCredential(address learner, uint256 xp, string calldata proofUri) external returns (uint256 index) {
        if (msg.sender != owner) revert NotOwner();
        if (learner == address(0)) revert InvalidLearner();
        if (bytes(proofUri).length == 0) revert InvalidProof();

        Credential memory record = Credential({
            xp: xp,
            proofUri: proofUri,
            issuedAt: uint64(block.timestamp),
            issuer: msg.sender
        });

        _credentials[learner].push(record);
        index = _credentials[learner].length - 1;

        emit CredentialIssued(learner, index, xp, proofUri, record.issuedAt, msg.sender);
    }

    /// @notice Returns the total number of credentials issued for a learner.
    function credentialCount(address learner) external view returns (uint256) {
        return _credentials[learner].length;
    }

    /// @notice Reads a credential at a specific index for a learner.
    function credentialAt(address learner, uint256 index) external view returns (Credential memory) {
        require(index < _credentials[learner].length, "index out of range");
        return _credentials[learner][index];
    }
}
