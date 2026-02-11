contract Receiver {
    uint public count;

    receive() external payable {
        count++; // SSTORE → ~20,000 gas
    }
}