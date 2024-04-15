function messageDigest_p2sh(transaction, inputIndex = -1) {
  let serialized = "";

  // Serialize version (little-endian) must be 4 bytes
  serialized += transaction.version
    .toString(16)
    .padStart(8, "0")
    .match(/../g)
    .reverse()
    .join("");

  // Serialize number of inputs must be 1 byte
  serialized += transaction.vin.length.toString(16).padStart(2, "0");

  // Serialize inputs
  transaction.vin.forEach((input, index) => {
    // Serialize txid (little-endian) must be 32 bytes
    serialized += input.txid.match(/../g).reverse().join("");

    // Serialize vout (little-endian) must be 4 bytes
    serialized += input.vout
      .toString(16)
      .padStart(8, "0")
      .match(/../g)
      .reverse()
      .join("");

    // Serialize scriptSig length
    if (index === inputIndex || inputIndex === -1) {
      // Serialize scriptSig

      let scriptsig_asm = input.scriptsig_asm || "SCRIPT SIG ASM: MISSING";
      let scriptsig_asm_slices = scriptsig_asm.split(" ");
      let redeem_script = "";
      if (scriptsig_asm_slices.length != 0) {
        redeem_script = scriptsig_asm_slices[scriptsig_asm_slices.length - 1];
      }
      serialized += (redeem_script.length / 2).toString(16).padStart(2, "0");
      serialized += redeem_script;
    } else {
      serialized += "00"; // Empty scriptSig
    }
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
  // Serialize locktime
  serialized += transaction.locktime
    .toString(16)
    .padStart(8, "0")
    .match(/../g)
    .reverse()
    .join("");

  return serialized + "01000000";
}

export { messageDigest_p2sh };
// Path: solution/Helpers/messageDigest_p2sh.js
