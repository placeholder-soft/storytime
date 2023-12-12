import { HDKey } from "@scure/bip32";
import { mnemonicToSeedSync } from "@scure/bip39";

const seed = mnemonicToSeedSync(
  process.argv[2] ||
    "test test test test test test test test test test test junk"
);
const key = HDKey.fromMasterSeed(seed);

console.log(`private key: ${Buffer.from(key.privateKey!).toString("hex")}`);
console.log(`privateExtendedKey key: ${key.privateExtendedKey}`);
console.log(`publicExtendedKey key: ${key.publicExtendedKey}`);
