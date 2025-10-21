import axios from "axios";

export const getTokenPrice = async (token: "solana" | "bitcoin") => {
  try {
    const res = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price?ids=${token}&vs_currencies=usd`
    );
    return Number(res.data[token]?.usd ?? "0");
  } catch (ex) {
    console.error(ex);
    return 0;
  }
};
