import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";
import pkg from "elliptic";
import { performance } from "perf_hooks";
const { ec: EC } = pkg;
import { ImpelmentCommands } from "./Helpers/ImplementCommands.js";
import { SHA256, doubleSha256, OP_HASH160 } from "./Helpers/Hashes.js";
import { serializeTxn } from "./Helpers/digests/serialize.js";
import { messageDigestp2wpkh } from "./Helpers/digests/messageDigestp2wpkh.js";
import { messageDigest_p2sh } from "./Helpers/digests/messageDigest_p2sh.js";

readAllFilesGetData("mempool");
// readfilesFromFile();
function readfilesFromFile() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);

  // Replace 'all_p2pkh.txt' with the path to your text file
  const filePath = path.join(__dirname, "all_p2pkh.txt");

  // Read the file line by line
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading the file:", err);
      return;
    }

    // Split the file content by new lines
    const lines = data.split(/\r?\n/);

    // Extract and print each filename
    const inValidTransactions = [];
    lines.forEach((line) => {
      if (line) {
        // Assuming the filename is the first word of the line
        const filename = line.split(" ")[0];
        const filePath = `mempool/${filename}.json`;
        const fileContent = fs.readFileSync(filePath, "utf8");
        const JsonData = JSON.parse(fileContent);
        if (!verifyTransaction(JsonData)) {
          inValidTransactions.push(getFileName(JsonData));
        }
        // console.log(inValidTransactions);
      }
    });
    // write invalid transactions to the file
    fs.writeFileSync(
      "invalid_transactions.txt",
      inValidTransactions.join("\n")
    );
  });
}

function readAllFilesGetData(FolderPath) {
  //read the valid transactions from the file if file not present keep it empty
  const files = fs.readdirSync(FolderPath); // Reading all the files
  let ValidData = [];
  let count = 0;
  const startTime = performance.now();
  files.forEach((fileName) => {
    const filePath = `${FolderPath}/${fileName}`;
    const fileContent = fs.readFileSync(filePath, "utf8");
    const JsonData = JSON.parse(fileContent);
    const valid = isValidFileName(JsonData, fileName.slice(0, -5));
    if (valid.types != undefined && valid.types.length == 1) {
      valid.fileContent = JsonData;
      valid.types = valid.types[0];
      ValidData.push(valid);
      // valid => { fileName, types } currently types has 1 element
    }
  });
  let p2sh_valid = 0,
    p2sht = 0;
  let p2pkh_valid = 0,
    p2pkht = 0;
  let v0_p2wpkh_valid = 0,
    v0_p2wpkht = 0;
  let v0_p2wsh_valid = 0,
    v0_p2wsht = 0;
  let v1_p2trt = 0,
    v1_p2tr_valid = 0;

  let Data = [];
  ValidData.forEach((e) => {
    if (e.types == "p2sh") {
      p2sht++;
    } else if (e.types == "p2pkh") {
      p2pkht++;
    } else if (e.types == "v0_p2wpkh") {
      v0_p2wpkht++;
    } else if (e.types == "v0_p2wsh") {
      v0_p2wsht++;
    } else if (e.types == "v1_p2tr") {
      v1_p2trt++;
    }

    if (verifyTransaction(e.fileContent, e.types)) {
      e.serializetx = serializeTxn(e.fileContent).filename;
      Data.push(e);
      if (e.types == "p2sh") {
        p2sh_valid++;
      } else if (e.types == "p2pkh") {
        p2pkh_valid++;
      } else if (e.types == "v0_p2wpkh") {
        v0_p2wpkh_valid++;
      } else if (e.types == "v0_p2wsh") {
        v0_p2wsh_valid++;
      } else if (e.types == "v1_p2tr") {
        v1_p2tr_valid++;
      }
    }
  });

  // fs.writeFileSync("valid_transactions.txt", JSON.stringify(Data));
  fs.writeFileSync(
    "valid_transactions_Count.json",
    JSON.stringify({
      Data,
    })
  );

  // let CountOfTypes = fs.readFileSync("valid_transactions_Count.json", "utf8");
  console.log("----transaction types-----");
  const endTime = performance.now();
  console.log(`Time taken: ${endTime - startTime} ms`);
  console.log("p2pkh", p2pkh_valid, p2pkht);
  console.log("p2sh", p2sh_valid, p2sht);
  console.log("v0_p2wpkh", v0_p2wpkh_valid, v0_p2wpkht);
  console.log("v0_p2wsh", v0_p2wsh_valid, v0_p2wsht);
  console.log("v1_p2tr", v1_p2tr_valid, v1_p2trt);

  let set = new Set();

  // ValidData.forEach((e) => {
  //   // console.log(e.types[0]);
  //   console.log(e.types);
  // });
  // now every file has been read and we have the valid data with its types

  //write the fileNames to the
  // let sets = new Set();
  // // console.log(ValidData[0], "Valid Transactions");
  // ValidData.forEach((e) => {
  //   if (e.types.size != 1) {
  //     if (!sets.has(e.types)) {
  //       sets.add(e.types);
  //     }
  //   }
  // });

  //write this to the file
  // let setArray = Array.from(sets); // Assuming 'sets' is an iterable of Set objects
  // for (let i = 0; i < setArray.length; i++) {
  //   // Convert each Set to an Array to use the join method
  //   setArray[i] = Array.from(setArray[i]).join(" ");
  // }

  // fs.writeFileSync("set.txt", setArray.join("\n"));

  // fs.writeFileSync("_transactions.txt", ValidData);
  // Return the valid data
  return ValidData;
}

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

function verifyECDSASignature(publicKeyHex, signatureHex, messageHex) {
  // Import the public key
  const ecdsa = new EC("secp256k1");
  const key = ecdsa.keyFromPublic(publicKeyHex, "hex");
  const signature = parseDER(signatureHex);
  const isValid = key.verify(messageHex, signature);
  return isValid;
}

function verifyTransaction(transaction, type) {
  // Assuming 'vin' is an array and we need to check every transaction

  if (type == "v0_p2wpkh") {
    let valid = true;
    transaction.vin.forEach((e, index) => {
      const message = messageDigestp2wpkh(transaction, index);
      const hash = doubleSha256(message);
      const isValid = verifyECDSASignature(e.witness[1], e.witness[0], hash);
      if (!isValid) {
        valid = false;
      }
    });

    return valid;
  } else if (type == "p2sh" && transaction.vin[0].witness == undefined) {
    let validTransaction = true;
    transaction.vin.forEach((e, index) => {
      //combine the signature scrpit and pubkey script
      let commands = "";
      commands = e.scriptsig_asm + " " + e.prevout.scriptpubkey_asm;
      commands = commands.split(" ");
      // console.log(commands);
      let stack = [];
      stack = ImpelmentCommands(stack, commands, type, transaction, index);
      if (stack.pop() == false) validTransaction = false;
      commands = e.inner_redeemscript_asm.split(" ");
      stack = ImpelmentCommands(stack, commands, type, transaction, index);
      if (validTransaction && stack[0] == true && stack.length == 1);
      else {
        validTransaction = false;
      }
    });
    return validTransaction;
  } else if (type == "p2pkh") {
    let stack = [];
    let result = true;
    transaction.vin.forEach((e, index) => {
      stack = [];
      let commands = "";
      commands = e.scriptsig_asm + " " + e.prevout.scriptpubkey_asm;
      commands = commands.split(" ");
      stack = ImpelmentCommands(stack, commands, type, transaction, index);
      if (stack[0] == true && stack.length == 1);
      else {
        result = false;
      }
    });
    if (result == false) return false;
    if (stack[0] == true && stack.length == 1) return true;
    return false;
  } else if (type == "v0_p2wsh") {
    let valid = true;
    transaction.vin.forEach((e, index) => {
      const message = messageDigestp2wpkh(transaction, index, "p2wsh");
      const messagehash = doubleSha256(message);
      const getsignatures = e.inner_witnessscript_asm
        .split(" ")[0]
        .split("_")[2];
      let stack = [];
      for (let i = 0; i < getsignatures; i++) {
        stack.push(e.witness[i + 1]);
      }
      let commands = e.inner_witnessscript_asm.split(" ");
      commands.forEach((command) => {
        if (command.startsWith("OP_PUSHBYTES_") || command == "OP_0") {
          // Just Leave them as the next bytes will be auto matically pushed
        } else if (command === "OP_HASH160") {
          // console.log(commands);
          valid = false;
          // let stackElement = stack.pop();
          // const hash = OP_HASH160(stackElement);
          // stack.push(hash);
        } else if (command === "OP_EQUAL" || command === "OP_EQUALVERIFY") {
          let stackElement1 = stack.pop();
          let stackElement2 = stack.pop();
          stack.push(stackElement1 === stackElement2);
        } else if (command == "OP_DUP") {
          let stackElement = stack.pop();
          stack.push(stackElement);
          stack.push(stackElement);
        } else if (command.startsWith("OP_PUSHNUM")) {
          stack.push(parseInt(command.split("_")[2]));
        } else if (command == "OP_CHECKMULTISIG") {
          let noOfKeys = stack.pop();
          let keys = [];
          for (let i = 0; i < noOfKeys; i++) {
            keys.push(stack.pop());
          }
          let noOfSignatures = stack.pop();
          let signatures = [];
          for (let i = 0; i < noOfSignatures; i++) {
            signatures.push(stack.pop());
          }
          //now we have the keys and signatures
          //check if the signatures are valid with trial of all the public keys
          for (let i = 0; i < noOfSignatures; i++) {
            let isValid = false;
            for (let j = 0; j < noOfKeys; j++) {
              isValid = verifyECDSASignature(
                keys[j],
                signatures[i],
                messagehash
              );
              if (isValid) break;
            }
            if (!isValid) {
              valid = false;
            }
          }
          if (valid == false) return false;
          stack.push(true);
          // console.log(stack);
        } else {
          stack.push(command); // Push other commands directly onto the stack
        }
      });
    });

    return valid;
  } else if (type == "p2sh") {
    if (transaction.vin[0].witness.length == 2) {
      type = "p2wpkh";
      const messagedigest = messageDigestp2wpkh(transaction, 0, "p2sh_p2wpkh");
      const message = doubleSha256(messagedigest);
      const signature = transaction.vin[0].witness[0];
      const pubkey = transaction.vin[0].witness[1];
      const valid = verifyECDSASignature(pubkey, signature, message);
      return valid;
    }
    // console.log(transaction.vin[0].witness.length);
  }
}
