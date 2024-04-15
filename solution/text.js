const { ec: EC } = require("elliptic");
const crypto = require("crypto");

// Create a new ECDSA instance using the secp256k1 curve, commonly used in Bitcoin
const ecdsa = new EC("secp256k1");

function doubleSha256(input) {
  let firstHash = crypto.createHash("sha256").update(input).digest();
  let secondHash = crypto.createHash("sha256").update(firstHash).digest();
  return secondHash;
}

function serializeTxn(transaction) {
  let serialized = "";

  // Serialize version
  serialized += transaction.version.toString(16).padStart(8, "0");

  // Serialize number of inputs
  serialized += transaction.vin.length.toString(16).padStart(2, "0");

  // Serialize inputs
  transaction.vin.forEach((input) => {
    // Serialize txid (little-endian)
    serialized += Buffer.from(input.txid, "hex").reverse().toString("hex");
    // Serialize vout (little-endian)
    serialized += input.vout.toString(16).padStart(8, "0");
    // Serialize scriptSig length
    serialized += input.scriptsig.length.toString(16).padStart(2, "0");
    // Serialize scriptSig
    serialized += input.scriptsig;
    // Serialize sequence (little-endian)
    serialized += input.sequence.toString(16).padStart(8, "0");
  });

  // Serialize number of outputs
  serialized += transaction.vout.length.toString(16).padStart(2, "0");

  // Serialize outputs
  transaction.vout.forEach((output) => {
    // Serialize value (little-endian)
    serialized += output.value.toString(16).padStart(16, "0");
    // Serialize scriptPubKey length
    serialized += output.scriptpubkey.length.toString(16).padStart(2, "0");
    // Serialize scriptPubKey
    serialized += output.scriptpubkey;
  });
// console.log('Message Digest:', message.toString('hex'));

// Function to verify the ECDSA signature
function verifyECDSASignature(publicKeyHex, signatureHex, messageHex) {
  // Import the public key
  const key = ecdsa.keyFromPublic(publicKeyHex, "hex");

  // Hash the message
  const messageHash = crypto
    .createHash("sha256")
    .update(Buffer.from(messageHex, "hex"))
    .digest();

  // Verify the signature
  const signature = {
    r: signatureHex.slice(8),
    s: signatureHex.slice(signatureHex.length - 32 * 2),
  };
  const isValid = key.verify(messageHash, signature);

  return isValid;
}

const tx = {
  version: 1,
  locktime: 0,
  vin: [
    {
      txid: "4a57d9377965809c621281030cc82160800e9ad27eded4bde75d7830b855491c",
      vout: 0,
      prevout: {
        scriptpubkey: "76a914a520c86a08366941cd90d22e11ac1c7eefa2db3788ac",
        scriptpubkey_asm:
          "OP_DUP OP_HASH160 OP_PUSHBYTES_20 a520c86a08366941cd90d22e11ac1c7eefa2db37 OP_EQUALVERIFY OP_CHECKSIG",
        scriptpubkey_type: "p2pkh",
        scriptpubkey_address: "1G47mSr3oANXMafVrR8UC4pzV7FEAzo3r9",
        value: 50068515,
      },
      scriptsig:
        "483045022100adb81c16389c76361546a1bb8323f89a52ade6714f11ed6d1a9bfe9433f74d28022027d77b5ccdfae57834bdd67897d6b4ae3c59940ff97e7fcadafd7380c7048fb5012103f3f44c9e80e2cedc1a2909631a3adea8866ee32187f74d0912387359b0ff36a2",
      scriptsig_asm:
        "OP_PUSHBYTES_72 3045022100adb81c16389c76361546a1bb8323f89a52ade6714f11ed6d1a9bfe9433f74d28022027d77b5ccdfae57834bdd67897d6b4ae3c59940ff97e7fcadafd7380c7048fb501 OP_PUSHBYTES_33 03f3f44c9e80e2cedc1a2909631a3adea8866ee32187f74d0912387359b0ff36a2",
      is_coinbase: false,
      sequence: 0,
    },
  ],
  vout: [
    {
      scriptpubkey: "76a914f1f9c09ffc8f3da65976ec972b8cf4ed8aa9628488ac",
      scriptpubkey_asm:
        "OP_DUP OP_HASH160 OP_PUSHBYTES_20 f1f9c09ffc8f3da65976ec972b8cf4ed8aa96284 OP_EQUALVERIFY OP_CHECKSIG",
      scriptpubkey_type: "p2pkh",
      scriptpubkey_address: "1P4T3LRpuwZqJGzfYAq1nUo8E6fWcspCEq",
      value: 194500,
    },
    {
      scriptpubkey: "76a914a520c86a08366941cd90d22e11ac1c7eefa2db3788ac",
      scriptpubkey_asm:
        "OP_DUP OP_HASH160 OP_PUSHBYTES_20 a520c86a08366941cd90d22e11ac1c7eefa2db37 OP_EQUALVERIFY OP_CHECKSIG",
      scriptpubkey_type: "p2pkh",
      scriptpubkey_address: "1G47mSr3oANXMafVrR8UC4pzV7FEAzo3r9",
      value: 15182365,
    },
    {
      scriptpubkey: "0014e7327abcaee6f5057425d158c5120c15db3fa355",
      scriptpubkey_asm:
        "OP_0 OP_PUSHBYTES_20 e7327abcaee6f5057425d158c5120c15db3fa355",
      scriptpubkey_type: "v0_p2wpkh",
      scriptpubkey_address: "bc1quue8409wum6s2ap969vv2ysvzhdnlg64fghfkf",
      value: 34175000,
    },
    {
      scriptpubkey: "a914bb2324046fad1819443cc86b8309ee1cb236141387",
      scriptpubkey_asm:
        "OP_HASH160 OP_PUSHBYTES_20 bb2324046fad1819443cc86b8309ee1cb2361413 OP_EQUAL",
      scriptpubkey_type: "p2sh",
      scriptpubkey_address: "3JkWP2wDbay3QD7Zrj94jFrkctQduAQ7bF",
      value: 509097,
    },
  ],
};

const message = doubleSha256(serializeTxn(tx));

const publicKeyHex =
  "03f3f44c9e80e2cedc1a2909631a3adea8866ee32187f74d0912387359b0ff36a2";
const signatureHex =
  "3045022100adb81c16389c76361546a1bb8323f89a52ade6714f11ed6d1a9bfe9433f74d28022027d77b5ccdfae57834bdd67897d6b4ae3c59940ff97e7fcadafd7380c7048fb501";
// const messageHex = createMessageDigest(tx);

console.log(
  "Is the signature valid?",
  verifyECDSASignature(publicKeyHex, signatureHex, message)
);
