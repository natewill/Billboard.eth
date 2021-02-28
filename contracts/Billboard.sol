//SPDX-License-Identifier: Unlicense
pragma solidity ^0.7.0;

import "hardhat/console.sol";


contract Billboard {
  string public phrase;
  uint public curprice = 0;

  function changeBillboard(string memory _message) payable external {
    require(msg.value>curprice, "msg.value must be greater than the curprice");
    console.log("%s sent the message %s at %s", msg.sender, _message, msg.value);
    phrase = _message;
    curprice = msg.value;
  }
}
