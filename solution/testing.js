import { messageDigest } from "./Helpers/digests/messageDigest.js";
// // import { OP_HASH160, doubleSha256 } from "./Helpers/Hashes.js";
import fs from "fs";
import { SHA256, doubleSha256 } from "./Helpers/Hashes.js";
import { witness_TxId } from "./Helpers/witnessTxId.js";

import pkg from "elliptic";
const { ec: EC } = pkg;
// import { merkle_root } from "./Helpers/Block/merkleroot.js";
// import { messageDigest_p2sh } from "./Helpers/digests/messageDigest_p2sh.js";
// import { messageDigestp2wpkh } from "./Helpers/digests/messageDigestp2wpkh.js";
// import { SHA256, doubleSha256, OP_HASH160 } from "./Helpers/Hashes.js";
// import { serializeTxn } from "./Helpers/digests/serialize.js";
// import { verify } from "crypto";
// import { messageDigest } from "./Helpers/digests/messageDigest.js";
// import { transferableAbortSignal } from "util";
// import { coinBase } from "./Helpers/Block/coinBase.js";
// // import { messageDigest } from "./Helpers/messageDigest.js";
// // import { messageDigest } from "./Helpers/messageDigest.js";
// // readAllFilesGetData("mempool");

// function getFileName(JsonData) {
//   let serialized = serializeTxn(JsonData);
//   let doubleSha256Hash = doubleSha256(serialized.filename);
//   let file = SHA256(doubleSha256Hash.match(/../g).reverse().join(""));
//   return file;
// }

// function isValidFileName(JsonData, fileName) {
//   let serialized = serializeTxn(JsonData);
//   let types = Array.from(serialized.types);
//   let file = SHA256(
//     doubleSha256(serialized.filename).match(/../g).reverse().join("")
//   );
//   if (file == fileName) {
//     return { fileName, types };
//   }
//   return false;
// }

fs.readdirSync("mempool").forEach((file) => {
  let data = fs.readFileSync(`mempool/${file}`);
  let JsonData = JSON.parse(data);
  // let serialized = messageDigest(JsonData);
});

function parseDER(serialized) {
  // Extract the length of the R element
  const rLength = parseInt(serialized.substring(6, 8), 16) * 2;
  // Calculate the start and end positions of R
  const rStart = 8;
  const rEnd = rStart + rLength;
  // Extract R
  const r = serialized.substring(rStart, rEnd);

  // Extract the length of the S element
  const sLength = parseInt(serialized.substring(rEnd + 2, rEnd + 4), 16) * 2;
  // Calculate the start and end positions of S
  const sStart = rEnd + 4;
  const sEnd = sStart + sLength;
  // Extract S
  const s = serialized.substring(sStart, sEnd);
  return { r, s };
}

function verifyECDSASignature(publicKeyHex, signatureHex, messageHex) {
  // Import the public key
  const ecdsa = new EC("secp256k1");
  const key = ecdsa.keyFromPublic(publicKeyHex, "hex");
  const isValid = key.verify(messageHex, signatureHex);
  return isValid;
}
