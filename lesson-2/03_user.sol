// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Users {
    struct User {
        string name;
        uint age;
    }

    mapping(string => integer) public users;
    can i call users['key'] 
    function setUser(string calldata name, uint age) public {
        users[msg.sender] = User(name, age);
    }
}


setString(string calldata name) {
    mapping(string => uint) public users;
    users[name] += 1
}


users.name

User({
    name: name,
    age: age
});

// User(name, age);

msg is a global Solidity object that contains information about the current transaction or call.
msg.sender → the address of the account or contract that called the function.
msg.value → the amount of Ether (in wei) sent with the call.
msg.data → the raw calldata sent with the function call.
