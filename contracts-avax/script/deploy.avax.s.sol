// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;
import "forge-std/Script.sol";
import "../contracts/StorytimeNFT.sol";

contract DeployGoerli is Script {
    uint256 deployerPrivateKey = vm.envUint("ETH_PRIVATE_KEY");

    function run() external {
        vm.startBroadcast(deployerPrivateKey);
        address owner = vm.addr(deployerPrivateKey);

        StorytimeNFT storytime = new StorytimeNFT(owner);

        vm.stopBroadcast();
    }
}
