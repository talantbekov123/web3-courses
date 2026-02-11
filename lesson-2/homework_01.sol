// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract RestaurantRating {
    address public owner;

    // Restaurant names mapping to a flag indicating if added
    mapping(string => bool) public restaurants;

    // User ratings: restaurantName => user => rating
    mapping(string => mapping(address => uint8)) public ratings;

    // Total ratings and count: restaurantName => (sum, count)
    mapping(string => uint256) public totalRatings;
    mapping(string => uint256) public ratingCounts;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    function addRestaurant(string calldata restaurantName) external onlyOwner {
        require(!restaurants[restaurantName], "Restaurant already exists");
        restaurants[restaurantName] = true;
    }

    function rateRestaurant(string calldata restaurantName, uint8 rating) external {
        require(restaurants[restaurantName], "Restaurant not found");
        require(rating >= 1 && rating <= 5, "Rating must be 1-5");
        require(ratings[restaurantName][msg.sender] == 0, "Already rated");

        ratings[restaurantName][msg.sender] = rating;
        totalRatings[restaurantName] += rating;
        ratingCounts[restaurantName] += 1;
    }

    function getAverageRating(string calldata restaurantName) external view returns (uint256) {
        require(ratingCounts[restaurantName] > 0, "No ratings yet");
        return totalRatings[restaurantName] / ratingCounts[restaurantName];
    }
}