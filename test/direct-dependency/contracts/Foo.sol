pragma solidity ^0.5.0;

contract Foo {
  uint256 public value;

  function bar() public pure returns (string memory) {
    return "bar";
  }

  function set(uint256 _value) public returns (uint256) {
    value = _value;
    return value;
  }
}
