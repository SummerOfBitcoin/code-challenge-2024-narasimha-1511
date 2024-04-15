import fs from "fs";
import { createBlock } from "./Helpers/Block/createBlock.js";
import { merkle_root } from "./Helpers/Block/merkleroot.js";
import { doubleSha256 } from "./Helpers/Hashes.js";
import { serializeTxn } from "./Helpers/digests/serialize.js";
import { coinBase } from "./Helpers/Block/coinBase.js";
import { calculateWeight } from "./Helpers/Block/calculateWeight.js";

const validData = fs.readFileSync("valid_transactions_Count.json", "utf8");
const data = JSON.parse(validData);
console.log("Start Mining");
let validTransactions = [];
let txids = [];
let i = 0;
for (const key in data) {
  for (const transaction of data[key]) {
    const { fileName, types, fileContent, serializetx } = transaction;
    //Extracted the files that the valid and verification done

    const serialize = serializeTxn(fileContent);
    const txid = doubleSha256(serialize.filename)
      .match(/../g)
      .reverse()
      .join("");
    const data = fs.readFileSync("mempool/" + fileName + ".json", "utf8");
    const txn = JSON.parse(data);
    // console.log(txn);
    validTransactions[i] = txn;
    txids[i] = txid;
    i++;
  }
}

let max_weight = 4 * 1000 * 1000;
let current_weight = 0;
let transactions = [];
for (let i = 0; i < validTransactions.length; i++) {
  // console.log(validTransactions[i]);
  const cur = calculateWeight(validTransactions[i]);
  if (cur) {
    if (current_weight + cur <= max_weight) {
      transactions.push(txids[i]);
      current_weight += cur;
    } else {
      break;
    }
  }
}
let nonce = 0;
// const merkleRoot = merkle_root(txids);
const merkleRoot = merkle_root(transactions);
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
let blockHash = doubleSha256(block).match(/../g).reverse().join("");

while (parseInt(blockHash) >= parseInt("0000ffff")) {
  nonce++;
  console.log(parseInt(blockHash) - parseInt("0000ffff"));
  console.log("Mining again");
  block = createBlock(merkleRoot, nonce);
  blockHash = doubleSha256(block).match(/../g).reverse().join("");
}
fs.writeFileSync(
  "output.txt",
  block + "\n" + coinbaseTransacton + "\n" + coinBaseTxId + "\n" + txidsa
);
