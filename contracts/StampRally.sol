pragma solidity 0.5.0;


contract StampRally {
  string public prefix; // url prefix for the stamp images
  uint8 public numStamps;
  struct Stamp {
    bytes32 hashedPassphrase;
  }

  // All the hashed passphrases are stored here 
  Stamp[] internal stampKey;
  
  // Represents one users Stamp Rally "Card" 
  struct RallyCard {
    bool[] stamps;
  }

  // all cards in the game
  RallyCard[] internal cards;

  // links to a Rally Card
  struct PlayerRallyCard {
    uint64 id;
    bool valid;
  }

  // lookup table between player addresses and card id
  mapping (address => PlayerRallyCard) public playerToRallyCard;

  constructor(uint8 _numStamps, string memory _prefix) public {
    prefix = _prefix;
    numStamps = _numStamps;
    stampKey.length = numStamps;
  }

  function setPassphraseForStamp(uint8 _position, bytes32 _hashedPassphrase) public {

  }

  // Unsalted hash
  function generateHash(bool _passphrase) public pure returns (bytes32 hashed) {
    return keccak256(abi.encode(_passphrase));
  }
				 
  function initializeRally(address _player) internal {
    uint64 max = 2**64 - 1;
    require(cards.length < max, "Reached maximum number of players");
    PlayerRallyCard memory prc = playerToRallyCard[_player];
    require(!prc.valid, "Player already has a card");
    uint64 id = uint64(cards.length);
    bool[] memory s;
    cards.push(RallyCard(s));
    playerToRallyCard[_player] = PlayerRallyCard(id, true);
    //RallyCard storage rally = playerToRallyCard[_player];
    //rally.valid = true;
    //rally.stamps = new bool[](numStamps);
  }
  
  function collectStamp(uint8 _position, string memory _passphrase) public {
    //Rally memory rally = playerToRally[msg.sender];
    //if (!rally.valid) {
    //  initializeRally(msg.sender);
    //}
    // todo
  }

  function getStamp(uint8 position) public view returns (string memory) {


  }
  
}
