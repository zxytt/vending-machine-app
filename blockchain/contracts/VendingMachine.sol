// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract VendingMachine {
    address public owner;
    mapping(address => uint) public donutBalanaces;

    constructor() {
        owner = msg.sender;
        donutBalanaces[address(this)] = 100;
    }

    function getVendingMachineBalanace() public view returns (uint) {
        return donutBalanaces[address(this)];
    }

    function restock(uint amount) public {
        require(msg.sender == owner, "Only the owner can restock this machine");
        donutBalanaces[address(this)] += amount;
    }

    function purchase(uint amount) public payable {
        require(msg.value >= amount * 0.0001 ether, "You must pay at least 0.0001 ether per dount");
        require(donutBalanaces[address(this)] >= amount, "Not enough donuts in stock to fulfill request");
        donutBalanaces[address(this)] -= amount;
        donutBalanaces[msg.sender] += amount;
    }
}