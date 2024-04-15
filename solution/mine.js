import fs from "fs";
import { createBlock } from "./Helpers/Block/createBlock.js";
import { merkle_root } from "./Helpers/Block/merkleroot.js";
import { doubleSha256 } from "./Helpers/Hashes.js";
import { serializeTxn } from "./Helpers/digests/serialize.js";
import { coinBase } from "./Helpers/Block/coinBase.js";
const validData = fs.readFileSync("valid_transactions_Count.json", "utf8");
const data = JSON.parse(validData);
console.log("Start Mining");
const validTransactions = [];
const txids = [];
for (const key in data) {
  for (const transaction of data[key]) {
    const { fileName, types, fileContent, serializetx } = transaction;
    //Extracted the files that the valid and verification done
    const serialize = serializeTxn(fileContent);
    const txid = doubleSha256(serialize.filename)
      .match(/../g)
      .reverse()
      .join("");
    validTransactions.push(fileContent);
    txids.push(txid);
  }
}
let nonce = 0;
// const merkleRoot = merkle_root(txids);
const merkleRoot = merkle_root(txids);
let coinbaseTransacton = coinBase();
let block = createBlock(merkleRoot, nonce);
const coinBaseTxId = doubleSha256(coinbaseTransacton)
  .match(/../g)
  .reverse()
  .join("");
//write an output file
// name: output.txt
// 1 Line -> Block Header
// 2 Line -> Coinbase Transaction
// 3 Line -> No of transaction ids
const txidsa = txids.join("\n");
let blockHash = doubleSha256(block);

while (
  parseInt(blockHash) >=
  parseInt("0000ffff00000000000000000000000000000000000000000000000000000000")
) {
  nonce++;
  console.log(
    parseInt(blockHash) -
      parseInt(
        "0000ffff00000000000000000000000000000000000000000000000000000000"
      )
  );
  console.log("Mining again");
  block = createBlock(merkleRoot, nonce);
  blockHash = doubleSha256(block);
}
fs.writeFileSync(
  "output.txt",
  block + "\n" + coinbaseTransacton + "\n" + coinBaseTxId + "\n" + txidsa
);
