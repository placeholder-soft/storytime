// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Script.sol";

contract DeployGoerli is Script {
    using Strings for address;
    uint256 deployerPrivateKey = vm.envUint("ETH_PRIVATE_KEY");
    using Address for address payable;

    function run() external {
        vm.startBroadcast(deployerPrivateKey);
        address owner = vm.addr(deployerPrivateKey);
    }
}
