pragma solidity ^0.4.24;
import "./almacenamiento.sol";
contract Coin is SimpleStorage{
    address public minter;
    mapping (address => uint) public balances;
    event Sent(address from, address to, uint amount);

    constructor () public {
        minter = msg.sender;
    }
    
    function valor(uint x) public returns (uint) {
        storedData = x;
        return storedData;
    }

    function mint(address receiver, uint amount) public {
        if (msg.sender != minter) return;
        balances[receiver] += amount;
    }

    function send(address receiver, uint amount) public {
        if (balances[msg.sender] < amount) return;
        balances[msg.sender] -= amount;
        balances[receiver] += amount;
        emit Sent(msg.sender, receiver, amount);
    }
}