// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract NFT is ERC721 {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    constructor() ERC721("Sloth NFT", "SNFT") {}

    function _baseURI() internal pure override returns (string memory) {
        return "http://sloth/";
    }

    function mint() public {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(msg.sender, tokenId);
    }
}

// chain: rinkeby
// address: 0x23fCaEE59b7092071bC4A0b2bA3afB0e89eEBB3b