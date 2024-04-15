function createBlock(merkle_root, nonce) {
  /* 
    Block header -> 80 bytes -> 320 weight units
    
  */
  //  console.log("merkle_root", merkle_root);
  let serialize = "";
  serialize += "11000000"; // Version -> 4 bytes -> Little Endian
  serialize += (0).toString(16).padStart(64, "0"); // Previous Block Hash -> 32 bytes -> Natural byte order
  serialize += merkle_root; // Merkle Root -> 32 bytes -> Natural Byte Order
  const Time = Math.floor(Date.now() / 1000);
  serialize += Time.toString(16)
    .padStart(8, "0")
    .match(/../g)
    .reverse()
    .join(""); // Time -> 4 bytes -> Little Endian
  serialize += "ffff001f"; // Bits -> 4 bytes -> Little Endian -> this is Current Target
  serialize += nonce.toString(16).padStart(8, "0"); // Nonce -> 4 bytes -> Little Endian
  // serialize += transactions.length.toString(16).padStart(2, "0"); // Number of Transactions -> 1 byte -> Little Endian

  // serialize += transactions.reduce((acc, tx) => acc + tx, "");
  return serialize;
}

export { createBlock };
