import axios from "axios";

export const getTokensUSDValue = async (id: string) => {
  const tokenData = await axios.get(
    `https://api.coingecko.com/api/v3/coins/${id}`
  );

  return parseFloat(tokenData?.data?.market_data?.current_price?.usd);
};
