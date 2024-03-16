// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

contract Counter {
    uint256 public number;
    event NumberChanged(uint256 newNumber);

    function setNumber(uint256 newNumber) public {
        number = newNumber;
    }

    function increment() public {
        number++;
        emit NumberChanged(number);
    }
}
