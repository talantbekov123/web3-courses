// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract SimpleERC20 {
    // --- ERC20 metadata ---
    string public name;
    string public symbol;
    uint8 public immutable decimals;

    // --- ERC20 state ---
    uint256 public totalSupply;
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    // --- ERC20 events ---
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    // --- Constructor: optional initial mint ---
    constructor(
        string memory _name,
        string memory _symbol,
        uint8 _decimals,
        uint256 initialSupply,
        address initialHolder
    ) {
        name = _name;
        symbol = _symbol;
        decimals = _decimals;

        if (initialSupply > 0) {
            _mint(initialHolder, initialSupply);
        }
    }

    // --- ERC20 core functions ---

    function transfer(address to, uint256 value) external returns (bool) {
        _transfer(msg.sender, to, value);
        return true;
    }

    function approve(address spender, uint256 value) external returns (bool) {
        allowance[msg.sender][spender] = value;
        emit Approval(msg.sender, spender, value);
        return true;
    }

    function transferFrom(address from, address to, uint256 value) external returns (bool) {
        uint256 allowed = allowance[from][msg.sender];
        require(allowed >= value, "ERC20: allowance too low");

        // save gas on repeated transferFrom calls when allowance is max uint
        if (allowed != type(uint256).max) {
            allowance[from][msg.sender] = allowed - value;
            emit Approval(from, msg.sender, allowance[from][msg.sender]);
        }

        _transfer(from, to, value);
        return true;
    }

    // Optional convenience functions (nice for teaching UX)

    function increaseAllowance(address spender, uint256 added) external returns (bool) {
        uint256 newAllowance = allowance[msg.sender][spender] + added;
        allowance[msg.sender][spender] = newAllowance;
        emit Approval(msg.sender, spender, newAllowance);
        return true;
    }

    function decreaseAllowance(address spender, uint256 subtracted) external returns (bool) {
        uint256 current = allowance[msg.sender][spender];
        require(current >= subtracted, "ERC20: decreased below zero");
        uint256 newAllowance = current - subtracted;
        allowance[msg.sender][spender] = newAllowance;
        emit Approval(msg.sender, spender, newAllowance);
        return true;
    }

    // --- Internal mechanics ---

    function _transfer(address from, address to, uint256 value) internal {
        require(from != address(0), "ERC20: from zero address");
        require(to != address(0), "ERC20: to zero address");

        uint256 bal = balanceOf[from];
        require(bal >= value, "ERC20: balance too low");

        // effects
        balanceOf[from] = bal - value;
        balanceOf[to] += value;

        emit Transfer(from, to, value);
    }

    function _mint(address to, uint256 value) internal {
        require(to != address(0), "ERC20: mint to zero address");

        totalSupply += value;
        balanceOf[to] += value;

        emit Transfer(address(0), to, value);
    }

    function _burn(address from, uint256 value) internal {
        require(from != address(0), "ERC20: burn from zero address");

        uint256 bal = balanceOf[from];
        require(bal >= value, "ERC20: burn exceeds balance");

        balanceOf[from] = bal - value;
        totalSupply -= value;

        emit Transfer(from, address(0), value);
    }
}
