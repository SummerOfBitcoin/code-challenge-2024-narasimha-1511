import { doubleSha256 } from "../Hashes.js";
import { merkle_root } from "./merkleroot.js";

function coinBase(witnessTxs) {
  let serialize = "";
  serialize += "01000000"; // Version -> 4 bytes -> Little Endian
  serialize += "00"; // Marker ->  1 byte
  serialize += "01"; // Flag -> 1 byte
  serialize += "01"; // Number of inputs -> 1 byte
  serialize += (0).toString(16).padStart(64, "0"); // Previous Transaction Hash -> 32 bytes -> Little Endian
  serialize += "ffffffff"; // Previous Txout-index -> 4 bytes -> Little Endian (Max Value)
  serialize += "25"; // Txin-script length -> 1 byte
  serialize +=
    "246920616d206e61726173696d686120616e64206920616d20736f6c76696e672062697463";
  // the above is the ascii coding of( I am narasimha and i am solving bitc)
  serialize += "ffffffff"; // Sequence -> 4 bytes -> Little Endian (Max Value)
  serialize += "02"; // Number of outputs -> 1 byte
  // First Output
  serialize += "f595814a00000000";
  // Amount 1 -> 8 bytes -> Little Endian
  serialize += "19"; // Txout-script length -> 1 byte
  serialize += "76a914edf10a7fac6b32e24daa5305c723f3de58db1bc888ac"; // random script pub key
  // Second Output
  serialize += "0000000000000000"; // Amount 2 -> 8 bytes -> Little Endian
  let script = `6a24aa21a9ed${witnessCommitment(witnessTxs)}`;
  serialize += (script.length / 2).toString(16); // Txout-script length -> 1 byte
  // Locktime
  serialize += "0120";
  serialize += (0).toString(16).padStart(64, "0"); // Locktime -> 4 bytes -> Little Endian
  serialize += "00000000"; // Locktime -> 4 bytes -> Little Endian

  return serialize;
}

function witnessCommitment(witnessTxs) {
  const merkle = merkle_root(witnessTxs);
  const witness_value = Buffer.from(
    "0000000000000000000000000000000000000000000000000000000000000000",
    "hex"
  );
  const reserved_value = witness_value.toString("hex");
  return doubleSha256(merkle + reserved_value);
}

export { coinBase };
