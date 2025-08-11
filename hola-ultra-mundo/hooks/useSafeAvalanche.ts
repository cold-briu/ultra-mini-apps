import { useState, useEffect } from "react";
import { getSafeInfo, getSafeBalances } from "../lib/safe-api";

const SAFE_ADDRESS = "0x52110a2Cc8B6bBf846101265edAAe34E753f3389";

type TokenInfo = {
    address: string;
    symbol: string;
    name: string;
    decimals: number;
    logoUri: string;
};

type SafeToken = {
    tokenInfo: TokenInfo;
    balance: string;
    fiatBalance: string;
};

export function useSafeAvalanche() {
    const [owners, setOwners] = useState<string[]>([]);
    const [threshold, setThreshold] = useState<number | null>(null);
    const [fiatTotal, setFiatTotal] = useState(0);
    const [tokens, setTokens] = useState<SafeToken[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchInfo = async () => {
        setLoading(true);
        try {
            const data = await getSafeInfo(SAFE_ADDRESS);
            setOwners(data.owners || []);
            setThreshold(data.threshold);

            const fiatData = await getSafeBalances(SAFE_ADDRESS);
            setFiatTotal(Math.floor(Number(fiatData.fiatTotal))); // Sin decimales para evitar movimiento visual
            setTokens(fiatData.items || []);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : String(err));
        } finally {
            setLoading(false);
        }
    };

    const refresh = async () => {
        await fetchInfo();
    };

    useEffect(() => {
        fetchInfo();
    }, []);

    return { owners, threshold, fiatTotal, tokens, loading, error, refresh };
}
