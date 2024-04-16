import { doubleSha256 } from "./Hashes.js";

function witness_TxId(transaction) {
  let serialized = "";
  let type = "";
  let witness = [];
  let stack_items = 0;
  let stack_items_witness = "";
  // Serialize version (little-endian) must be 4 bytes
  serialized += transaction.version
    .toString(16)
    .padStart(8, "0")
    .match(/../g)
    .reverse()
    .join("");
  const set = new Set();
  serialized += "0001"; // marker + Flag

  // Serialize number of inputs must be 1 byte
  serialized += transaction.vin.length.toString(16).padStart(2, "0");
  // Serialize inputs
  transaction.vin.forEach((input) => {
    stack_items = 0; // setting up the stack items
    stack_items_witness = ""; // setting up the stack items witness

    // Serialize txid (little-endian) must be 32 bytes
    serialized += input.txid.match(/../g).reverse().join("");

    //setting up the witness field
    stack_items = input.witness.length.toString(16).padStart(2, "0");
    // Serialize signature length
    input.witness.forEach((witness) => {
      stack_items_witness += (witness.length / 2).toString(16).padStart(2, "0");
      stack_items_witness += witness;
    });

    witness.push(stack_items + stack_items_witness);

    // Serialize vout (little-endian) must be 4 bytes
    serialized += input.vout
      .toString(16)
      .padStart(8, "0")
      .match(/../g)
      .reverse()
      .join("");

    // Serialize scriptSig length
    serialized += (input.scriptsig.length / 2).toString(16).padStart(2, "0");
    // Serialize scriptSig
    serialized += input.scriptsig;

    // Serialize sequence (little-endian)
    // Serialize sequence (little-endian) must be 4 bytes
    serialized += input.sequence
      .toString(16)
      .padStart(8, "0")
      .match(/../g)
      .reverse()
      .join("");

    // serialized += input.sequence.toString(16).padStart(4, "0");
  });

  // Serialize number of outputs
  serialized += transaction.vout.length.toString(16).padStart(2, "0");
  if (!set.has(type)) {
    set.add(type);
  }

  // Serialize outputs
  transaction.vout.forEach((output) => {
    // Serialize value (little-endian)
    // Assuming 'output.value' is in Bitcoins, convert it to satoshis
    const satoshis = output.value; // no need to conver to sathsis as they are already in sathosis

    // Serialize the satoshis value
    serialized += satoshis
      .toString(16)
      .padStart(16, "0")
      .match(/../g)
      .reverse()
      .join("");

    // Serialize scriptPubKey length
    serialized += (output.scriptpubkey.length / 2)
      .toString(16)
      .padStart(2, "0");
    // Serialize scriptPubKey
    serialized += output.scriptpubkey;
  });

  serialized += witness.join(""); // stack items

  serialized += transaction.locktime
    .toString(16)
    .padStart(8, "0")
    .match(/../g)
    .reverse()
    .join("");

  const txid = doubleSha256(serialized).match(/../g).reverse().join("");

  return txid;
}

function diff(tx) {
  const vincount = tx.slice(12, 14);
  console.log(vincount);

  for (var i = 0; i < vincount; i++) {
    const txid = tx.slice(14 + i * 64, 14 + i * 64 + 64);
    const vout = tx.slice(14 + i * 64 + 64, 14 + i * 64 + 64 + 8);
    const scriptSigLength = tx.slice(
      14 + i * 64 + 64 + 8,
      14 + i * 64 + 64 + 8 + 2
    );
    const scriptSig = tx.slice(
      14 + i * 64 + 64 + 8 + 2,
      14 + i * 64 + 64 + 8 + 2 + parseInt(scriptSigLength, 16) * 2
    );
    const sequence = tx.slice(
      14 + i * 64 + 64 + 8 + 2 + parseInt(scriptSigLength, 16) * 2,
      14 + i * 64 + 64 + 8 + 2 + parseInt(scriptSigLength, 16) * 2 + 8
    );
    console.log(txid, vout, scriptSig, sequence);
  }

  const voutcount = tx.slice(14 + vincount * 64, 14 + vincount * 64 + 2);

  console.log(voutcount);
  for (var i = 0; i < voutcount; i++) {
    const value = tx.slice(
      14 + vincount * 64 + 2 + i * 24,
      14 + vincount * 64 + 2 + i * 24 + 16
    );
    const scriptPubKeyLength = tx.slice(
      14 + vincount * 64 + 2 + i * 24 + 16,
      14 + vincount * 64 + 2 + i * 24 + 16 + 2
    );
    const scriptPubKey = tx.slice(
      14 + vincount * 64 + 2 + i * 24 + 16 + 2,
      14 +
        vincount * 64 +
        2 +
        i * 24 +
        16 +
        2 +
        parseInt(scriptPubKeyLength, 16) * 2
    );
    console.log(value, scriptPubKey);
  }
  const witness = tx.slice(14 + vincount * 64 + voutcount * 24);
  const locktime = tx.slice(14 + vincount * 64 + voutcount * 24 + 8);
  console.log(witness, locktime);
}

export { witness_TxId };
// Path: solution/serialize.js