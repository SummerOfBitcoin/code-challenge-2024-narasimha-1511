function calculateWeight(tx) {
  //here i will calculate the weight of the trasnsaction
  let tx_type = tx.vin.every((vin) => "scriptsig" in vin) ? "LEGACY" : "SEGWIT";
  //determining the type of the transaction

  let tx_weight = 0;
  let segwit_wt = 0;

  if (tx_type === "LEGACY") {
    //version -> in bytes
    tx_weight += 4;

    if (tx.vin.length >= 50) {
      //input count -> in bytes
      throw new Error("Too many inputs");
    }
    //input count -> in bytes
    tx_weight += 1;

    //input -> in bytes
    tx.vin.forEach((e) => {
      tx_weight += 32; //txid -> in bytes
      tx_weight += 4; //vout -> in bytes
      tx_weight += 1; //scriptSig length -> in bytes
      const scriptSig = Buffer.form(e.scriptSig, "hex");
      tx_weight += scriptSig.length; //scriptSig -> in bytes
      tx_weight += 4; //sequence -> in bytes
    });

    if (tx.vout.length >= 50) {
      //output count -> in bytes
      throw new Error("Too many outputs");
    }

    //output count -> in bytes
    tx_weight += 1;

    //output -> in bytes
    tx.vout.forEach((e) => {
      tx_weight += 8; //value -> in bytes
      tx_weight += 1; //scriptPubKey length -> in bytes
      const scriptPubKey = Buffer.from(e.scriptPubKey, "hex");
      tx_weight += scriptPubKey.length; //scriptPubKey -> in bytes
    });

    //locktime -> in bytes
    tx_weight += 4;
  } else {
    tx_weight += 4; //version -> in bytes

    //Marker and Flag -> in bytes
    segwit_wt += 2;

    if (tx.vin.length >= 50) {
      //input count -> in bytes
      throw new Error("Too many inputs");
    }

    //input count -> in bytes
    tx_weight += 1;

    //input -> in bytes
    tx.vin.forEach((e) => {
      tx_weight += 32; //txid -> in bytes
      tx_weight += 4; //vout -> in bytes
      tx_weight += 1; //scriptSig length -> in bytes
      const scriptSig = Buffer.from(e.scriptSig, "hex");
      tx_weight += scriptSig.length; //scriptSig -> in bytes
      tx_weight += 4; //sequence -> in bytes
    });

    if (tx.vout.length >= 50) {
      //output count -> in bytes
      throw new Error("Too many outputs");
    }

    //output count -> in bytes
    tx_weight += 1;

    //output -> in bytes
    tx.vout.forEach((e) => {
      tx_weight += 8; //value -> in bytes
      tx_weight += 1; //scriptPubKey length -> in bytes
      const scriptPubKey = Buffer.from(e.scriptPubKey, "hex");
      tx_weight += scriptPubKey.length; //scriptPubKey -> in bytes
    });

    //witness -> in bytes

    tx.vin.forEach((e) => {
      segwit_wt += 1; //number of stack items -> in bytes
      e.witness.forEach((w) => {
        const witness = Buffer.from(w, "hex");
        segwit_wt += 1 + witness.length; //witness -> in bytes
      });
    });

    //locktime -> in bytes
    tx_weight += 4;
  }

  const complete_weight = tx_weight * 4 + segwit_wt;
  return complete_weight;
}

function calculateFees(transaction) {
  let input_sum = 0;
  let output_sum = 0;

  transaction.vin.forEach((input) => {
    input_sum += input.value;
  });

  transaction.vout.forEach((output) => {
    output_sum += output.value;
  });

  return input_sum - output_sum;
}

export { calculateWeight, calculateFees };
