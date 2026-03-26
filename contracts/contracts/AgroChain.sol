// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract AgroChain {
    string public name = "AgroChain";
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    function getName() public view returns (string memory) {
        return name;
    }
}
