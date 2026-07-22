// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {ERC20Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import {ERC20PermitUpgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20PermitUpgradeable.sol";
import {ERC20VotesUpgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20VotesUpgradeable.sol";
import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {PausableUpgradeable} from "@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {NoncesUpgradeable} from "@openzeppelin/contracts-upgradeable/utils/NoncesUpgradeable.sol";
/// @title Auros Governance Token
/// @notice Delegatable voting token prepared for reward emissions.
contract AurosGovernanceToken is Initializable, ERC20Upgradeable, ERC20PermitUpgradeable, ERC20VotesUpgradeable, OwnableUpgradeable, PausableUpgradeable, UUPSUpgradeable {
    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() { _disableInitializers(); }
    function initialize(address owner_, uint256 supply) external initializer {
        __ERC20_init("Auros Governance Token", "AUR"); __ERC20Permit_init("Auros Governance Token"); __ERC20Votes_init();
        __Ownable_init(owner_); __Pausable_init(); _mint(owner_, supply);
    }
    function mintRewards(address recipient, uint256 amount) external onlyOwner { _mint(recipient, amount); }
    function pause() external onlyOwner { _pause(); } function unpause() external onlyOwner { _unpause(); }
    function _update(address from, address to, uint256 value) internal override(ERC20Upgradeable, ERC20VotesUpgradeable) {
        require(!paused(), "token paused"); super._update(from, to, value);
    }
    function nonces(address owner) public view override(ERC20PermitUpgradeable, NoncesUpgradeable) returns (uint256) { return super.nonces(owner); }
    function _authorizeUpgrade(address) internal override onlyOwner {}
}
