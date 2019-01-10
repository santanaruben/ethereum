pragma solidity ^0.4.24;

import "../node_modules/openzeppelin-solidity/contracts/math/SafeMath.sol";

contract ERC721Enumerable {

  using SafeMath for uint256;

  // Mapping from owner to list of owned token IDs
  mapping(address => uint256[]) internal _ownedTokens;

  // Mapping from token ID to index of the owner tokens list
  mapping(uint256 => uint256) internal _ownedTokensIndex;

  // Array with all token ids, used for enumeration
  uint256[] internal _allTokens;

  // Mapping from token id to position in the allTokens array
  mapping(uint256 => uint256) internal _allTokensIndex;

  function tokenOfOwnerByIndex(
    address owner,
    uint256 index
  )
    public
    view
    returns (uint256)
  {
    return _ownedTokens[owner][index];
  }

  function totalSupply() public view returns (uint256) {
    return _allTokens.length;
  }

  function tokenByIndex(uint256 index) public view returns (uint256) {
    require(index < totalSupply());
    return _allTokens[index];
  }

  function _addTokenTo(address to, uint256 tokenId) internal {
    uint256 length = _ownedTokens[to].length;
    _ownedTokens[to].push(tokenId);
    _ownedTokensIndex[tokenId] = length;
  }

  function _removeTokenFrom(address from, uint256 tokenId) internal {
    
    // To prevent a gap in the array, we store the last token in the index of the token to delete, and
    // then delete the last slot.
    uint256 tokenIndex = _ownedTokensIndex[tokenId];
    uint256 lastTokenIndex = _ownedTokens[from].length.sub(1);
    uint256 lastToken = _ownedTokens[from][lastTokenIndex];

    _ownedTokens[from][tokenIndex] = lastToken;
    // This also deletes the contents at the last position of the array
    _ownedTokens[from].length--;

    // Note that this will handle single-element arrays. In that case, both tokenIndex and lastTokenIndex are going to
    // be zero. Then we can make sure that we will remove tokenId from the ownedTokens list since we are first swapping
    // the lastToken to the first position, and then dropping the element placed in the last position of the list

    _ownedTokensIndex[tokenId] = 0;
    _ownedTokensIndex[lastToken] = tokenIndex;
  }

  function _mint(uint256 tokenId) internal {
    
    _allTokensIndex[tokenId] = _allTokens.length;
    _allTokens.push(tokenId);
  }

  function _burn(uint256 tokenId) internal {
    
    // Reorg all tokens array
    uint256 tokenIndex = _allTokensIndex[tokenId];
    uint256 lastTokenIndex = _allTokens.length.sub(1);
    uint256 lastToken = _allTokens[lastTokenIndex];

    _allTokens[tokenIndex] = lastToken;
    _allTokens[lastTokenIndex] = 0;

    _allTokens.length--;
    _allTokensIndex[tokenId] = 0;
    _allTokensIndex[lastToken] = tokenIndex;
  }
}
