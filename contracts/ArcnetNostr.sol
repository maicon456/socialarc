// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title ArcnetNostr
 * @notice Simple smart contract for registering event hashes on-chain
 * @dev This contract stores event metadata on Arcnet testnet
 */
contract ArcnetNostr {
    struct EventRecord {
        string eventId;
        address author;
        string ipfsUri;
        uint256 timestamp;
        bool exists;
    }

    mapping(string => EventRecord) public events;
    mapping(address => string[]) public userEvents;
    
    event EventRegistered(
        string indexed eventId,
        address indexed author,
        string ipfsUri,
        uint256 timestamp
    );

    /**
     * @notice Register an event hash on-chain
     * @param eventId The unique event identifier
     * @param ipfsUri The IPFS URI of the event content
     */
    function registerEvent(string memory eventId, string memory ipfsUri) external {
        require(bytes(eventId).length > 0, "Event ID cannot be empty");
        require(!events[eventId].exists, "Event already registered");
        
        events[eventId] = EventRecord({
            eventId: eventId,
            author: msg.sender,
            ipfsUri: ipfsUri,
            timestamp: block.timestamp,
            exists: true
        });
        
        userEvents[msg.sender].push(eventId);
        
        emit EventRegistered(eventId, msg.sender, ipfsUri, block.timestamp);
    }

    /**
     * @notice Get event record by ID
     * @param eventId The event identifier
     * @return EventRecord The event record
     */
    function getEvent(string memory eventId) external view returns (EventRecord memory) {
        require(events[eventId].exists, "Event does not exist");
        return events[eventId];
    }

    /**
     * @notice Get all event IDs for a user
     * @param user The user address
     * @return string[] Array of event IDs
     */
    function getUserEvents(address user) external view returns (string[] memory) {
        return userEvents[user];
    }

    /**
     * @notice Check if an event exists
     * @param eventId The event identifier
     * @return bool True if event exists
     */
    function eventExists(string memory eventId) external view returns (bool) {
        return events[eventId].exists;
    }
}



