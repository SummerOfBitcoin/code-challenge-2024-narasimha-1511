// import { messageDigest } from "./Helpers/messageDigest.js";
// import { OP_HASH160, doubleSha256 } from "./Helpers/Hashes.js";
import fs from "fs";

import pkg from "elliptic";
const { ec: EC } = pkg;
import { merkle_root } from "./Helpers/Block/merkleroot.js";
import { messageDigest_p2sh } from "./Helpers/digests/messageDigest_p2sh.js";
import { messageDigestp2wpkh } from "./Helpers/digests/messageDigestp2wpkh.js";
import { SHA256, doubleSha256, OP_HASH160 } from "./Helpers/Hashes.js";
import { serializeTxn } from "./Helpers/digests/serialize.js";
import { verify } from "crypto";
import { messageDigest } from "./Helpers/digests/messageDigest.js";
import { transferableAbortSignal } from "util";
import { coinBase } from "./Helpers/Block/coinBase.js";
// import { messageDigest } from "./Helpers/messageDigest.js";
// import { messageDigest } from "./Helpers/messageDigest.js";
// readAllFilesGetData("mempool");

function getFileName(JsonData) {
  let serialized = serializeTxn(JsonData);
  let doubleSha256Hash = doubleSha256(serialized.filename);
  let file = SHA256(doubleSha256Hash.match(/../g).reverse().join(""));
  return file;
}

function isValidFileName(JsonData, fileName) {
  let serialized = serializeTxn(JsonData);
  let types = Array.from(serialized.types);
  let file = SHA256(
    doubleSha256(serialized.filename).match(/../g).reverse().join("")
  );
  if (file == fileName) {
    return { fileName, types };
  }
  return false;
}

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

const transaction = {
  version: 2,
  locktime: 832539,
  vin: [
    {
      txid: "7c218cbf0fe023d15b71e401b34d6841f3cdf5617a42eddf32708fcf4c3236cb",
      vout: 0,
      prevout: {
        scriptpubkey: "76a9144e30f8fd336a83e1d6910fb9713d21f6dda1ff5a88ac",
        scriptpubkey_asm:
          "OP_DUP OP_HASH160 OP_PUSHBYTES_20 4e30f8fd336a83e1d6910fb9713d21f6dda1ff5a OP_EQUALVERIFY OP_CHECKSIG",
        scriptpubkey_type: "p2pkh",
        scriptpubkey_address: "188SNe6fRhVm2hd3PZ3TwsBSWchFZak2Th",
        value: 36882,
      },
      scriptsig:
        "47304402202bce610e94ec86bcdda2622158bd021640722acbbbb506cc11fb3c1a10b5d562022014bd28a276f44a86b9987daa0555525d60f602b2f52ef4bd4e07f9bad8041b6c01210227ce4c39213f865f1c18987079557548748e83126fcc11293fbd8eac4b0671eb",
      scriptsig_asm:
        "OP_PUSHBYTES_71 304402202bce610e94ec86bcdda2622158bd021640722acbbbb506cc11fb3c1a10b5d562022014bd28a276f44a86b9987daa0555525d60f602b2f52ef4bd4e07f9bad8041b6c01 OP_PUSHBYTES_33 0227ce4c39213f865f1c18987079557548748e83126fcc11293fbd8eac4b0671eb",
      is_coinbase: false,
      sequence: 4294967293,
    },
  ],
  vout: [
    {
      scriptpubkey: "76a914090a212ddb7211158409534bce9f6d553bcd028788ac",
      scriptpubkey_asm:
        "OP_DUP OP_HASH160 OP_PUSHBYTES_20 090a212ddb7211158409534bce9f6d553bcd0287 OP_EQUALVERIFY OP_CHECKSIG",
      scriptpubkey_type: "p2pkh",
      scriptpubkey_address: "1poDYYTsXhXimWRiKRjVCokoLzzbjR25q",
      value: 24200,
    },
    {
      scriptpubkey: "a914f15ac47ae6eb8f8da450ba7787b6a8c0059b076087",
      scriptpubkey_asm:
        "OP_HASH160 OP_PUSHBYTES_20 f15ac47ae6eb8f8da450ba7787b6a8c0059b0760 OP_EQUAL",
      scriptpubkey_type: "p2sh",
      scriptpubkey_address: "3PhBWQp766Lr5p4HqWFkEsMraLW2h918LV",
      value: 410000,
    },
  ],
};

function verifyECDSASignature(publicKeyHex, signatureHex, messageHex) {
  // Import the public key
  const ecdsa = new EC("secp256k1");
  const key = ecdsa.keyFromPublic(publicKeyHex, "hex");
  const signature = parseDER(signatureHex);
  const isValid = key.verify(messageHex, signature);
  return isValid;
}
// const prevouts = tx.vin
//   .map(
//     (input) =>
//       input.txid.match(/../g).reverse().join("") +
//       input.vout.toString(16).padStart(8, "0").match(/../g).reverse().join("")
//   )
//   .join("");
// let hashPrevouts = SHA256(prevouts);
// console.log(hashPrevouts);
// console.log("message digest ", messageDigest(tx, 0));

// console.log(doubleSha256(messageDigest(tx, 0)));

// console.log(
//   parseDER(
//     "30440220364b1ef5c5eb33e148c7dfad232a35f0a7832a91b8897b0cc562997d6232353d02200ff0ffd239ccef87319ae07ab68d46679d0bd15208a304cc6c38a905401b2ac401"
//   )
// );

// console.log(OP_HASH160("0014ba34e8e444e2a74e6517c14f5e330bf6f87d1c5b"));

// const message = mesqqsageDigest(tx, 0);
// const digest = doubleSha256(message);

// console.log(
//   parseDER(
//     "304402203adf81697ad98e38b6c1d8fcf53bdbf657ec619e10fd00bb5f0f07f90e669ebc02202acf894513e3cfa05e32f46f9c9ab5548a8da6023c59241b780b9255b2b25c0901"
//   )
// );
// console.log(
//   verifyECDSASignature(
//     "03211aec906e232ad96f2d52e849cf2798f4cf2d3d3463f608a7638054542defd6",
//     "3044022065b884e14705c85b462b41fdfe295f4f0e53baf780840b30c0b90f71833dd64d02206ac04c63828ba80e274c4ff96a03f39f450b4bedcb70b415047ea1ee7c71257001",
//     digest
//   )
// );

// console.log(messageDigestp2wpkh(tx, 0));
// console.log(messageDigest(tx, 0));
// const tx = {
//   version: 2,
//   locktime: 832539,
//   vin: [
//     {
//       txid: "7c218cbf0fe023d15b71e401b34d6841f3cdf5617a42eddf32708fcf4c3236cb",
//       vout: 0,
//       prevout: {
//         scriptpubkey: "76a9144e30f8fd336a83e1d6910fb9713d21f6dda1ff5a88ac",
//         scriptpubkey_asm:
//           "OP_DUP OP_HASH160 OP_PUSHBYTES_20 4e30f8fd336a83e1d6910fb9713d21f6dda1ff5a OP_EQUALVERIFY OP_CHECKSIG",
//         scriptpubkey_type: "p2pkh",
//         scriptpubkey_address: "188SNe6fRhVm2hd3PZ3TwsBSWchFZak2Th",
//         value: 36882,
//       },
//       scriptsig:
//         "47304402202bce610e94ec86bcdda2622158bd021640722acbbbb506cc11fb3c1a10b5d562022014bd28a276f44a86b9987daa0555525d60f602b2f52ef4bd4e07f9bad8041b6c01210227ce4c39213f865f1c18987079557548748e83126fcc11293fbd8eac4b0671eb",
//       scriptsig_asm:
//         "OP_PUSHBYTES_71 304402202bce610e94ec86bcdda2622158bd021640722acbbbb506cc11fb3c1a10b5d562022014bd28a276f44a86b9987daa0555525d60f602b2f52ef4bd4e07f9bad8041b6c01 OP_PUSHBYTES_33 0227ce4c39213f865f1c18987079557548748e83126fcc11293fbd8eac4b0671eb",
//       is_coinbase: false,
//       sequence: 4294967293,
//     },
//     {
//       txid: "869b62369426bac43369b49e62f5611f94f808a7c670875831c7f593eb7b5ba9",
//       vout: 0,
//       prevout: {
//         scriptpubkey: "76a914d74bce8fd3488eed4d449351feafdaca1d03b7d688ac",
//         scriptpubkey_asm:
//           "OP_DUP OP_HASH160 OP_PUSHBYTES_20 d74bce8fd3488eed4d449351feafdaca1d03b7d6 OP_EQUALVERIFY OP_CHECKSIG",
//         scriptpubkey_type: "p2pkh",
//         scriptpubkey_address: "1LdP6Q62wHkZwoBE62Gy4y2tuw9kZhTqmv",
//         value: 328797,
//       },
//       scriptsig:
//         "473044022019d625e3d2a77df31515113790c90c2f00e9200b22010717329a878246c9881e02203970dafda92f72cf3d8579509907e41099e9bdd6f3541eb46a6806697f407dd2012102a17743cdc1bf0f9adab350bba42658fca42c0d486ab0cc49e2451bb5be2295a7",
//       scriptsig_asm:
//         "OP_PUSHBYTES_71 3044022019d625e3d2a77df31515113790c90c2f00e9200b22010717329a878246c9881e02203970dafda92f72cf3d8579509907e41099e9bdd6f3541eb46a6806697f407dd201 OP_PUSHBYTES_33 02a17743cdc1bf0f9adab350bba42658fca42c0d486ab0cc49e2451bb5be2295a7",
//       is_coinbase: false,
//       sequence: 4294967293,
//     },
//     {
//       txid: "c0f0cf3896308fabf365f9430a5d42265efe4b9bda12f61e5146c21aed1b88f6",
//       vout: 0,
//       prevout: {
//         scriptpubkey: "76a9143b5428c5c51348a788afd5cc362f227d4c04c66288ac",
//         scriptpubkey_asm:
//           "OP_DUP OP_HASH160 OP_PUSHBYTES_20 3b5428c5c51348a788afd5cc362f227d4c04c662 OP_EQUALVERIFY OP_CHECKSIG",
//         scriptpubkey_type: "p2pkh",
//         scriptpubkey_address: "16Qhgomq9Jnh247Q5KCzXvLXhZv1VBzTrS",
//         value: 34100,
//       },
//       scriptsig:
//         "473044022034fdb2fdcf5b147f81c4a13350e9ee8c9f5de08d27103cf65e6a7c3b96042d2202206186ce4aa966c16e4671a35f766c17382c9c758d1622ef59bba6ef571c679f7a012103d23ad1dccc41cf313e2355fe220238260efde1fc156a9c4f7211898229db1139",
//       scriptsig_asm:
//         "OP_PUSHBYTES_71 3044022034fdb2fdcf5b147f81c4a13350e9ee8c9f5de08d27103cf65e6a7c3b96042d2202206186ce4aa966c16e4671a35f766c17382c9c758d1622ef59bba6ef571c679f7a01 OP_PUSHBYTES_33 03d23ad1dccc41cf313e2355fe220238260efde1fc156a9c4f7211898229db1139",
//       is_coinbase: false,
//       sequence: 4294967293,
//     },
//     {
//       txid: "f4482b2a061a321965c7ad1768fc80599ce36fbf693cfd95d23dd708e22c45cc",
//       vout: 0,
//       prevout: {
//         scriptpubkey: "76a914529a520fba93f9940fc113c803e04fb8e378af1c88ac",
//         scriptpubkey_asm:
//           "OP_DUP OP_HASH160 OP_PUSHBYTES_20 529a520fba93f9940fc113c803e04fb8e378af1c OP_EQUALVERIFY OP_CHECKSIG",
//         scriptpubkey_type: "p2pkh",
//         scriptpubkey_address: "18XmH7PEgjmBLqeee2nSSV6Qm5C5x2JNxs",
//         value: 41184,
//       },
//       scriptsig:
//         "47304402207d9a086b835659c2f45de8d2d85292f04ce8b833969cdd4f352b679a7b3775940220050cfec89f5a309799f3dc0628ff20fb696c43b1c6bee93066dfdab089da50b301210281e3301ea2655d695a1950f59456b27f8f3fbc0bbe6349cedc4121052a36b816",
//       scriptsig_asm:
//         "OP_PUSHBYTES_71 304402207d9a086b835659c2f45de8d2d85292f04ce8b833969cdd4f352b679a7b3775940220050cfec89f5a309799f3dc0628ff20fb696c43b1c6bee93066dfdab089da50b301 OP_PUSHBYTES_33 0281e3301ea2655d695a1950f59456b27f8f3fbc0bbe6349cedc4121052a36b816",
//       is_coinbase: false,
//       sequence: 4294967293,
//     },
//   ],
//   vout: [
//     {
//       scriptpubkey: "76a914090a212ddb7211158409534bce9f6d553bcd028788ac",
//       scriptpubkey_asm:
//         "OP_DUP OP_HASH160 OP_PUSHBYTES_20 090a212ddb7211158409534bce9f6d553bcd0287 OP_EQUALVERIFY OP_CHECKSIG",
//       scriptpubkey_type: "p2pkh",
//       scriptpubkey_address: "1poDYYTsXhXimWRiKRjVCokoLzzbjR25q",
//       value: 24200,
//     },
//     {
//       scriptpubkey: "a914f15ac47ae6eb8f8da450ba7787b6a8c0059b076087",
//       scriptpubkey_asm:
//         "OP_HASH160 OP_PUSHBYTES_20 f15ac47ae6eb8f8da450ba7787b6a8c0059b0760 OP_EQUAL",
//       scriptpubkey_type: "p2sh",
//       scriptpubkey_address: "3PhBWQp766Lr5p4HqWFkEsMraLW2h918LV",
//       value: 410000,
//     },
//   ],
// };

// console.log(messageDigest(tx, 0));
// console.log(messageDigestp2wpkh(tx, 0, "p2wsh"));

// console.log(messageDigestp2wpkh(tx, 0, "aa"));
// console.log(messageDigestp2wpkh(tx, 0));

console.log(merkle_root(txs));
// const merkle_root_digest = merkle_root(txs);

// console.log(merkle_root_digest);
