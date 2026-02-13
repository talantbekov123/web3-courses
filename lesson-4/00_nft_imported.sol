// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title Fashion Girl NFT Collection
/// @notice ERC-721 NFT contract for a fashion-themed collection
contract FashionGirlNFT is ERC721URIStorage, Ownable {
    uint256 public nextTokenId;

    constructor() ERC721("FashionGirlNFT", "FGN") Ownable(msg.sender) {
        // ERC721 constructor sets the name and symbol
        // Ownable constructor sets the deployer as the owner
    }

    /// @notice Mint a new NFT to a specified address with a metadata URI
    /// @param to Recipient of the NFT
    /// @param tokenURI URI pointing to the NFT metadata JSON
    function mint(address to, string memory tokenURI) external onlyOwner {
        uint256 tokenId = nextTokenId;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);
        nextTokenId++;
    }

    /// @notice Optional base URI for token metadata
    function _baseURI() internal pure override returns (string memory) {
        return "https://amethyst-real-fowl-370.mypinata.cloud/ipfs/bafybeia4vjbjawwaibbys7xwh3r7vwb6ve45cdylihc5stzyluzo4py4va/"; // optional base URI if using IPFS
    }
}