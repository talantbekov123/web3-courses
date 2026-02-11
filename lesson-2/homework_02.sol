// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract RestaurantReviews {
    address public owner;

    struct Restaurant {
        string name;
        bool approved;
        uint8 approvals;
    }

    struct Review {
        uint8 rating; // 1-5
        bool exists;
    }

    mapping(uint256 => Restaurant) public restaurants;
    mapping(uint256 => mapping(address => Review)) public reviews; // restaurantId => user => Review
    mapping(address => bool) public moderators;

    uint256 public nextRestaurantId;

    event RestaurantProposed(uint256 restaurantId, string name);
    event RestaurantApproved(uint256 restaurantId);
    event ReviewSubmitted(address user, uint256 restaurantId, uint8 rating);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    modifier onlyModerator() {
        require(moderators[msg.sender], "Not moderator");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    // Owner functions
    function addModerator(address mod) external onlyOwner {
        moderators[mod] = true;
    }

    function addRestaurantDirect(string calldata name) external onlyOwner {
        restaurants[nextRestaurantId] = Restaurant(name, true, 2); // approved immediately
        emit RestaurantApproved(nextRestaurantId);
        nextRestaurantId++;
    }

    // Moderator functions
    function proposeRestaurant(string calldata name) external onlyModerator {
        restaurants[nextRestaurantId] = Restaurant(name, false, 0);
        emit RestaurantProposed(nextRestaurantId, name);
        nextRestaurantId++;
    }

    function approveRestaurant(uint256 id) external onlyModerator {
        Restaurant storage r = restaurants[id];
        require(!r.approved, "Already approved");
        r.approvals++;
        if (r.approvals >= 2) {
            r.approved = true;
            emit RestaurantApproved(id);
        }
    }

    // User functions
    function submitReview(uint256 id, uint8 rating) external {
        require(restaurants[id].approved, "Restaurant not approved");
        require(rating >= 1 && rating <= 5, "Rating 1-5");
        Review storage r = reviews[id][msg.sender];
        require(!r.exists, "Already reviewed");

        r.rating = rating;
        r.exists = true;

        emit ReviewSubmitted(msg.sender, id, rating);
    }

    function getAverageRating(uint256 id) external view returns (uint256) {
        require(restaurants[id].approved, "Restaurant not approved");

        uint256 sum = 0;
        uint256 count = 0;

        // Iterate all users (simplified: in production, use an array of reviewers)
        // Minimal version does not store reviewer addresses separately
        for (uint256 i = 0; i < nextRestaurantId; i++) {
            Review storage r = reviews[i][msg.sender];
            if (r.exists) {
                sum += r.rating;
                count++;
            }
        }

        return count > 0 ? sum / count : 0;
    }
}