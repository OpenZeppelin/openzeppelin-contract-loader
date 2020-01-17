pragma solidity ^0.5.0;

contract Bar {
  uint256 public value;

  function foo() public pure returns (string memory) {
    return "foo";
  }

  function set(uint256 _value) public returns (uint256) {
    value = _value;
    return value;
  }
}
