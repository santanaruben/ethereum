pragma solidity >=0.4.21 <0.6.0;

import "../node_modules/zos-lib/contracts/Initializable.sol";

contract Note is Initializable {
  uint256 private number;

  function initialize(uint256 _number) public initializer {
    number = _number;
  }

  function getNumber() public view returns (uint256 _number) {
    return number;
  }

  function setNumber(uint256 _number) public {
    number = _number;
  }

  function eraseNumber()public {
    number = 0;
  }
}
