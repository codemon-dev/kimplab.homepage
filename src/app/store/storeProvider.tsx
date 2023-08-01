import { coindex_getAllCoins } from "../lib/crypto3partyAPI/coindex/coindex";
import { ACTIONS } from "./actions";
import { GlobalStoreContext, initialState, reducer } from "./store";
import { useReducer, useEffect, useState } from 'react'
import { IMG_TYPE } from "./../../config/enum"
import { IImgInfo } from "@/config/interface";


// Create the provider component with types
export function GlobalStoreProvider({children}: any) {
    const [state, dispatch] = useReducer(reducer, initialState);
    const [isInitDone, setIsInitDon] = useState(false)    
    useEffect(() => {
        createImgInfoMap();
    }, [])

    const createImgInfoMap = async () => {
        //const res = await coindex_getAllCoins();
        const res = await fetch('/coindex_symbolImg.json')
        const symbolImgs: [{symbol: string, imgId: string}]  = await res.json()

        let symbolImgInfos: IImgInfo[] = []
        symbolImgs.forEach(element => {
            symbolImgInfos.push({imgType: IMG_TYPE.SYMBOL, id: element.symbol, path: `https://imagedelivery.net/4-5JC1r3VHAXpnrwWHBHRQ/${element.imgId}/coin64`})
        });
        
        dispatch({ type: ACTIONS.ADD_IMG_INFO, key: IMG_TYPE.SYMBOL, value: symbolImgInfos})
        // dispatch({ type: ACTIONS.ADD_SYMBOL_IMG_INFO, key, value });
        setIsInitDon(true);
    }

    if (isInitDone === false) {
        <p>loding data!!!!</p>
    }
    return (
        <GlobalStoreContext.Provider value={{ state, dispatch }}>
            {children}
        </GlobalStoreContext.Provider>
    );
};