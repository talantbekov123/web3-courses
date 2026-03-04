// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { FunctionsClient } from "@chainlink/contracts/src/v0.8/functions/v1_0_0/FunctionsClient.sol";
import { FunctionsRequest } from "@chainlink/contracts/src/v0.8/functions/v1_0_0/libraries/FunctionsRequest.sol";
import { ConfirmedOwner } from "@chainlink/contracts/src/v0.8/shared/access/ConfirmedOwner.sol";

contract SepoliaWeatherMini is FunctionsClient, ConfirmedOwner {
    using FunctionsRequest for FunctionsRequest.Request;

    // Sepolia Functions Router
    address public constant ROUTER = 0xb83E47C2bC239B3bf370bc41e1459A34b41238D0;

    // DON ID for Ethereum Sepolia: fun-ethereum-sepolia-1
    bytes32 public constant DON_ID =
        0x66756e2d657468657265756d2d7365706f6c69612d3100000000000000000000;

    // Fixed location (as strings to keep JS simple)
    string public constant LAT = "42.882004";
    string public constant LON = "74.582748";

    uint64 public subscriptionId;
    uint32 public callbackGasLimit = 300_000;

    bytes32 public lastRequestId;
    bytes public lastError;

    // Temperature in Celsius * 100 (e.g., 2534 => 25.34°C)
    int256 public lastTempX100;

    event WeatherRequested(bytes32 indexed requestId);
    event WeatherUpdated(bytes32 indexed requestId, int256 tempX100, bytes err);

    error UnexpectedRequestID(bytes32 requestId);

    constructor(uint64 _subscriptionId) FunctionsClient(ROUTER) ConfirmedOwner(msg.sender) {
        subscriptionId = _subscriptionId;
    }

    function setCallbackGasLimit(uint32 _gasLimit) external onlyOwner {
        callbackGasLimit = _gasLimit;
    }

    // Triggers a Functions request for the fixed LAT/LON
    function requestWeather() external onlyOwner returns (bytes32 requestId) {
    string memory source = string.concat(
        "const lat = args[0];",
        "const lon = args[1];",
        "const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;",
        "const resp = await fetch(url);",
        "if (!resp.ok) throw Error(`HTTP ${resp.status}`);",
        "const data = await resp.json();",
        "const t = data.current_weather.temperature;",
        "return Functions.encodeInt256(Math.round(t * 100));"
    );

    FunctionsRequest.Request memory req;
    req.initializeRequestForInlineJavaScript(source);
    
    // ✅ Declare and allocate the array
    string[] memory requestArgs = new string[](2);
    requestArgs[0] = LAT;
    requestArgs[1] = LON;
    req.setArgs(requestArgs);

    lastRequestId = _sendRequest(
        req.encodeCBOR(),
        subscriptionId,
        callbackGasLimit,
        DON_ID
    );
    emit WeatherRequested(lastRequestId);
    return lastRequestId;
}


    // Called by Chainlink Functions Router
    function fulfillRequest(bytes32 requestId, bytes memory response, bytes memory err) internal override {
        if (requestId != lastRequestId) revert UnexpectedRequestID(requestId);

        lastError = err;

        if (err.length == 0) {
            lastTempX100 = abi.decode(response, (int256));
        }

        emit WeatherUpdated(requestId, lastTempX100, err);
    }
}

// https://functions.chain.link
