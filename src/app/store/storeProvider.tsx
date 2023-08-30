import { coindex_getAllCoins, coindex_getDominance } from "../lib/crypto3partyAPI/coindex/coindex";
import { ACTIONS } from "./actions";
import { GlobalStoreContext, initialState, reducer } from "./store";
import { useReducer, useEffect, useState, useRef } from 'react'
import { IMG_TYPE } from "./../../config/enum"
import { ICurrencyInfos, IDominanceChartInfo, IImgInfo, IMarketcapInfo } from "@/config/interface";
import { Spin } from "antd";
import useExchange from "../hook/useExchange";
import useCurrency from "../hook/useCurrency";
import useDominance from "../hook/useDominance";
import { getAllMarketcap } from "../lib/exchange/upbit/upbitCtrl";

// Create the provider component with types
export function GlobalStoreProvider({children}: any) {
    const { getInitialInfo } = useExchange()
    const { currency_addListener, currency_removeListener, currency_start, currency_stop } = useCurrency()
    const { dominance_addListener, dominance_removeListener, dominance_start, dominance_stop } = useDominance()
    const [state, dispatch] = useReducer(reducer, initialState);
    const isMount = useRef(false);
    const [isInitDone, setIsInitDone] = useState(false)

    useEffect(() => {
        if (isMount.current === true) {
            return;
        }
        isMount.current = true;
        console.log("create GlobalStore")
        initialize();
        return () => {
            isMount.current = false;
            currency_stop();
            currency_removeListener("storeProvider");
            dominance_stop();
            dominance_removeListener("storeProvider");
        }
    }, [])

    const initialize = async () => {
        let promises: any = []
        initDominanceInfoMonitor();
        initCurrencyInfoMonitor();
        promises.push(getInitialInfo())
        promises.push(createImgInfoMap())
        promises.push(fetchMarketCapInfo())
        const promiseRet = await Promise.all(promises);
        if (promiseRet[0]) {
            dispatch({ type: ACTIONS.UPDATE_EXCHANGE_COIN_INFO, value: promiseRet[0]})
        }
        setIsInitDone(true);
    }

    const initDominanceInfoMonitor = async () => {
        dominance_addListener("storeProvider", (dominanceInfo: IDominanceChartInfo) => {
            // console.log("dominanceInfo: ", dominanceInfo);
            dispatch({ type: ACTIONS.UPDATE_DOMINANCE_INFO, value: dominanceInfo})
        })
        dominance_start();
    }

    const initCurrencyInfoMonitor = async () => {
        currency_addListener("storeProvider", (currencyInfos: ICurrencyInfos) => {
            // console.log("currencyInfos: ", currencyInfos);
            dispatch({ type: ACTIONS.UPDATE_CURRENCY_INFO, value: currencyInfos})
        })
        currency_start();
    }

    const fetchMarketCapInfo = async () => {
        const marketCapInfos = await getAllMarketcap()
        if (!marketCapInfos) return;
        dispatch({ type: ACTIONS.UPDATE_MARKETCAP_INFO, value: marketCapInfos})
    }

    const createImgInfoMap = async () => {
        //const res = await coindex_getAllCoins();
        let res = await fetch('/coindex_symbolImg.json')
        let symbolImgs: [{symbol: string, imgId: string}]  = await res.json()

        let symbolImgInfos: IImgInfo[] = []
        symbolImgs.forEach(element => {
            symbolImgInfos.push({imgType: IMG_TYPE.SYMBOL, id: element.symbol, path: `https://imagedelivery.net/4-5JC1r3VHAXpnrwWHBHRQ/${element.imgId}/coin64`})
        });
        dispatch({ type: ACTIONS.ADD_IMG_INFO, key: IMG_TYPE.SYMBOL, value: symbolImgInfos})

        // res = await fetch('/coindex_exchangeImg.json')
        // let exchangeImgs: [{id: string, imgId: string}]  = await res.json()

        // let exchangeImgInfos: IImgInfo[] = []
        // exchangeImgs.forEach(element => {
        //     exchangeImgInfos.push({imgType: IMG_TYPE.EXCHANGE, id: element.id, path: `https://imagedelivery.net/4-5JC1r3VHAXpnrwWHBHRQ/${element.imgId}/coin128`})
        // });
        // dispatch({ type: ACTIONS.ADD_IMG_INFO, key: IMG_TYPE.EXCHANGE, value: exchangeImgInfos})

        res = await fetch('/coingecko_exchangeImg.json')
        let exchangeImgs: [{id: string, imgId: string}]  = await res.json()
        let exchangeImgInfos: IImgInfo[] = []
        exchangeImgs.forEach(element => {
            exchangeImgInfos.push({imgType: IMG_TYPE.EXCHANGE, id: element.id, path: `https://assets.coingecko.com/markets/images/${element.imgId}`})
        });
        dispatch({ type: ACTIONS.ADD_IMG_INFO, key: IMG_TYPE.EXCHANGE, value: exchangeImgInfos})
    }
    return (
        <GlobalStoreContext.Provider value={{ state, dispatch }}>
            {
                isInitDone === false 
                ? <Spin></Spin>
                : children
            }
        </GlobalStoreContext.Provider>
    );
};