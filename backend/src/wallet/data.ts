export const ethSignatureTypes = {
  Person: [
    { name: "name", type: "string" },
    { name: "wallet", type: "address" },
  ],
  Transaction: [
    { name: "from", type: "Person" },
    { name: "to", type: "Person" },
    { name: "transaction", type: "string" },
    { name: "tokenAmount", type: "string" },
    { name: "tokenAddress", type: "string" },
    { name: "chainId", type: "string" },
  ],
};
