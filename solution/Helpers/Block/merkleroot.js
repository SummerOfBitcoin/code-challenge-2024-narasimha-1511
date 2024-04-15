import { doubleSha256 } from "../Hashes.js";

function merkle_root(txids) {
  let hashes = txids.map((txid) =>
    Buffer.from(txid.match(/../g).reverse().join(""), "hex")
  ); //convert the txid to little endian => thats the probelem

  while (hashes.length > 1) {
    let newHashes = [];
    for (let i = 0; i < hashes.length; i += 2) {
      let left = hashes[i];
      let right = i + 1 === hashes.length ? left : hashes[i + 1];
      let hash = doubleSha256(Buffer.concat([left, right]));
      newHashes.push(Buffer.from(hash, "hex"));
    }
    hashes = newHashes;
  }

  return hashes[0].toString("hex");
};


export { merkle_root };
