import { doubleSha256 } from "../Hashes.js";

function merkle_root(txids) {
    if (txids.length === 0) return null;

    // reverse the txids
    let level = txids.map((txid) =>
      Buffer.from(txid, "hex").reverse().toString("hex")
    );

    while (level.length > 1) {
      const nextLevel = [];

      for (let i = 0; i < level.length; i += 2) {
        let pairHash;
        if (i + 1 === level.length) {
          // In case of an odd number of elements, duplicate the last one
          pairHash = doubleSha256(level[i] + level[i]);
        } else {
          pairHash = doubleSha256(level[i] + level[i + 1]);
        }
        nextLevel.push(pairHash);
      }

      level = nextLevel;
    }

    return level[0];
  };


export { merkle_root };
