import axios from "axios";

export const getTokenLogo = async (networkId) => {
  const response = await axios.get(
    `https://api.coingecko.com/api/v3/coins/${networkId}`
  );
  return response?.data?.image?.small;
};
