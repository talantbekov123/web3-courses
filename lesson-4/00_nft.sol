// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @notice Minimal, self-contained ERC-721 with metadata + tokenURI.
///         Designed to be easy to deploy + show in MetaMask as an NFT collection.
contract SimpleERC721 {
    // --- ERC721 metadata ---
    string public name;
    string public symbol;

    // --- ERC721 state ---
    uint256 public totalSupply; // simple counter for minted tokens

    mapping(uint256 => address) private _ownerOf;
    mapping(address => uint256) private _balanceOf;

    mapping(uint256 => address) public getApproved;
    mapping(address => mapping(address => bool)) public isApprovedForAll;

    // tokenId => URI (can be ipfs://..., https://..., or data:application/json,...)
    mapping(uint256 => string) private _tokenURI;

    // --- ERC721 events ---
    event Transfer(address indexed from, address indexed to, uint256 indexed id);
    event Approval(address indexed owner, address indexed spender, uint256 indexed id);
    event ApprovalForAll(address indexed owner, address indexed operator, bool approved);

    // --- Constructor: optional initial mint ---
    constructor(
        string memory _name,
        string memory _symbol,
        address initialHolder,
        string memory initialURI
    ) {
        name = _name;
        symbol = _symbol;

        // optional: mint tokenId 1 at deploy time
        if (initialHolder != address(0)) {
            _mint(initialHolder, 1);
            if (bytes(initialURI).length != 0) {
                _tokenURI[1] = initialURI;
            }
        }
    }

    // --- ERC721 view functions ---

    function ownerOf(uint256 id) public view returns (address owner) {
        owner = _ownerOf[id];
        require(owner != address(0), "ERC721: not minted");
    }

    function balanceOf(address owner) public view returns (uint256) {
        require(owner != address(0), "ERC721: zero address");
        return _balanceOf[owner];
    }

    function tokenURI(uint256 id) external view returns (string memory) {
        require(_ownerOf[id] != address(0), "ERC721: not minted");
        return _tokenURI[id];
    }

    // --- ERC721 approvals ---

    function approve(address spender, uint256 id) external {
        address owner = ownerOf(id);
        require(spender != owner, "ERC721: approve to owner");
        require(
            msg.sender == owner || isApprovedForAll[owner][msg.sender],
            "ERC721: not authorized"
        );

        getApproved[id] = spender;
        emit Approval(owner, spender, id);
    }

    function setApprovalForAll(address operator, bool approved) external {
        isApprovedForAll[msg.sender][operator] = approved;
        emit ApprovalForAll(msg.sender, operator, approved);
    }

    // --- ERC721 transfers ---

    function transferFrom(address from, address to, uint256 id) public {
        require(from == ownerOf(id), "ERC721: wrong from");
        require(to != address(0), "ERC721: to zero address");

        require(
            msg.sender == from ||
                msg.sender == getApproved[id] ||
                isApprovedForAll[from][msg.sender],
            "ERC721: not authorized"
        );

        // effects
        unchecked {
            _balanceOf[from] -= 1;
            _balanceOf[to] += 1;
        }
        _ownerOf[id] = to;

        // clear per-token approval
        if (getApproved[id] != address(0)) {
            delete getApproved[id];
            emit Approval(from, address(0), id);
        }

        emit Transfer(from, to, id);
    }

    /// @notice Safe transfer (minimal): does NOT call onERC721Received.
    ///         MetaMask doesn't need receiver checks; marketplaces may.
    function safeTransferFrom(address from, address to, uint256 id) external {
        transferFrom(from, to, id);
    }

    function safeTransferFrom(address from, address to, uint256 id, bytes calldata) external {
        transferFrom(from, to, id);
    }

    // --- Simple minting (for testing/teaching UX) ---

    /// @notice Mints the next tokenId to msg.sender with a URI.
    function mint(string calldata uri) external returns (uint256 id) {
        id = totalSupply + 1;
        _mint(msg.sender, id);
        if (bytes(uri).length != 0) {
            _tokenURI[id] = uri;
        }
    }

    /// @notice Optional: update URI if you own the token (simple demo UX).
    function setTokenURI(uint256 id, string calldata uri) external {
        require(msg.sender == ownerOf(id), "ERC721: not owner");
        _tokenURI[id] = uri;
    }

    // --- Internal mechanics ---

    function _mint(address to, uint256 id) internal {
        require(to != address(0), "ERC721: mint to zero address");
        require(_ownerOf[id] == address(0), "ERC721: already minted");

        _ownerOf[id] = to;
        _balanceOf[to] += 1;
        totalSupply += 1;

        emit Transfer(address(0), to, id);
    }
}

https://amethyst-real-fowl-370.mypinata.cloud/ipfs/bafybeia4vjbjawwaibbys7xwh3r7vwb6ve45cdylihc5stzyluzo4py4va/