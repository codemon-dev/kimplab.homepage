import { coindex_getAllCoins } from "../lib/crypto3partyAPI/coindex/coindex";
import { ACTIONS } from "./actions";
import { GlobalStoreContext, initialState, reducer } from "./store";
import { useReducer, useEffect, useState, useRef } from 'react'
import { IMG_TYPE } from "./../../config/enum"
import { IImgInfo } from "@/config/interface";
import { Spin } from "antd";
import useExchange from "../hook/useExchange";

// Create the provider component with types
export function GlobalStoreProvider({children}: any) {
    const { getInitialInfo } = useExchange()
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
        }
    }, [])

    const initialize = async () => {
        let promises: any = []
        promises.push(createImgInfoMap())
        promises.push(getInitialInfo())
        const promiseRet = await Promise.all(promises);
        if (promiseRet[1]) {
            dispatch({ type: ACTIONS.UPDATE_EXCHANGE_COIN_INFO, value: promiseRet[1]})
        }
        setIsInitDone(true);
    }

    const createImgInfoMap = async () => {
        //const res = await coindex_getAllCoins();
        const res = await fetch('/coindex_symbolImg.json')
        const symbolImgs: [{symbol: string, imgId: string}]  = await res.json()

        let symbolImgInfos: IImgInfo[] = []
        symbolImgs.forEach(element => {
            symbolImgInfos.push({imgType: IMG_TYPE.SYMBOL, id: element.symbol, path: `https://imagedelivery.net/4-5JC1r3VHAXpnrwWHBHRQ/${element.imgId}/coin64`})
        });
        dispatch({ type: ACTIONS.ADD_IMG_INFO, key: IMG_TYPE.SYMBOL, value: symbolImgInfos})
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