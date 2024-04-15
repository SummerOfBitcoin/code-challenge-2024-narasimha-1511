function coinBase() {
  let serialize = "";
  serialize += "01000000"; // Version -> 4 bytes -> Little Endian
  serialize += "01"; // Number of inputs -> 1 byte
  serialize += (0).toString(16).padStart(64, "0"); // Previous Transaction Hash -> 32 bytes -> Little Endian
  serialize += "ffffffff"; // Previous Txout-index -> 4 bytes -> Little Endian (Max Value)
  serialize += "00"; // Txin-script length -> 1 byte
  serialize += "ffffffff"; // Sequence -> 4 bytes -> Little Endian (Max Value)
  serialize += "01"; // Number of outputs -> 1 byte
  // serialize += Amount.toString(16)
  // .padStart(16, "0")
  // .match(/../g)
  // .reverse()
  // .join(""); // Amount -> 8 bytes -> Little Endian
  // serialize += (SctiptPubKey.length / 2).toString(16).padStart(2, "0"); // ScriptPubKey length -> 1 byte
  // serialize += SctiptPubKey; // ScriptPubKey -> 25 bytes
  serialize +=
    "30490b2a010000004341047eda6bd04fb27cab6e7c28c99b94977f073e912f25d1ff7165d9c95cd9bbe6da7e7ad7f2acb09e0ced91705f7616af53bee51a238b7dc527f2be0aa60469d140ac";
  serialize += "00000000"; // Locktime -> 4 bytes -> Little Endian

  return serialize;
}

export { coinBase };
