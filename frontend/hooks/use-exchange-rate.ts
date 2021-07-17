import useSWR from "swr";

const fetcher = async (url: string) => {
    const response = await fetch(url);
    return response.json();
};

const useExchangeRate = () => {
    const { data } = useSWR("https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD", fetcher);
    return {
        usd: data?.USD || 1800,
    };
};

export default useExchangeRate;
