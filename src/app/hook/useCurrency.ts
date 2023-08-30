"use client"

import moment from 'moment-timezone';

import { CURRENCY_SITE_TYPE, EXCHANGE_RATE_URL, FETCH_METHOD, REWRITE_ENDPOINT } from "@/config/enum";
import { ICurrencyDunamuResponse, ICurrencyInfo, ICurrencyInfos, ICurrencyInvestringResponse, ICurrencyWeebullResponse, ICurrencyYahooResponse } from "@/config/interface";

function useCurrency() {
  let listenerMap = new Map()
  let monitorInterval: any;
  let currencyInfos: Map<CURRENCY_SITE_TYPE, ICurrencyInfo> = new Map<CURRENCY_SITE_TYPE, ICurrencyInfo>();
  let firstCallback: boolean = false;

  const currency_addListener = (key: string, callback: any) => {
    listenerMap.set(key, callback);
    notifyCurrency();
  }

  const currency_removeListener = (key: string) => {
    listenerMap.delete(key);
  }

  const notifyCurrency = () => {
    if (listenerMap.size === 0) {
      return;
    }
    if (!currencyInfos || currencyInfos.size == 0) {
      return;
    }
    listenerMap.forEach((callback: any, key: string) => {
      callback(currencyInfos);
    });
  }

  const currency_start = async () => {
    if (monitorInterval != null) {
        console.log('CurrencyHandler monitor alread started. skip start.');
        return;
    }
    console.log('CurrencyHandler monitor start');
    intervalProcess();
    monitorInterval = setInterval(() => {
      intervalProcess();
    }, 10 * 1000);
  };

  const currency_stop = () => {
    console.log('CurrencyInfo monitor stop');
    if (monitorInterval != null) {
        clearInterval(monitorInterval);
        monitorInterval = null;
    }
  }

  const intervalProcess = () => {
    let dunamuReady: any;
    let investingReady: any;
    let yahooReady: any;
    let weebullReady: any;
    fetchCurrencyDunamu()
        .then((data) => {
          // .debug('Success to fetchData currency');
          currencyInfos.set(CURRENCY_SITE_TYPE.DUNAMU, data as ICurrencyInfo)
          dunamuReady = true;
        })
        .catch((err) => {
          console.log(`[${Date.now().toLocaleString()}] Fail to fetchData Dunamu currency. err:`, err);
          dunamuReady = true;
        });

    // fetchCurrencyInvestring()
    // .then((data: any) => {
          // .debug('Success to fetchData CurrencyInfo');
          // currencyInfos.set(CURRENCY_SITE_TYPE.INVESTING, data as ICurrencyInfo)
    // })
    // .catch((err) => {
    //   .debug(`[${Date.now()}] Fail to fetchData Investring CurrencyInfo. err:`, err);
    // });
    investingReady = true;

    fetchCurrencyYahoo()
    .then((data: any) => {
      // .debug('Success to fetchData CurrencyInfo');
      currencyInfos.set(CURRENCY_SITE_TYPE.YAHOO, data as ICurrencyInfo)
      yahooReady = true;
    })
    .catch((err) => {
      console.log(`[${Date.now().toLocaleString()}] Fail to fetchData Yahoo CurrencyInfo. err:`, err);
      yahooReady = true;
    });

    fetchCurrencyWeebull()
    .then((data: any) => {
      // .debug('Success to fetchData CurrencyInfo');
      currencyInfos.set(CURRENCY_SITE_TYPE.WEBULL, data as ICurrencyInfo)
      weebullReady= true;
    })
    .catch((err) => {
      console.log(`[${Date.now().toLocaleString()}] Fail to fetchData WeeBull CurrencyInfo. err:`, err);
      weebullReady= true;
    });
    
    const interval = setInterval(() => {
      if (firstCallback === false && dunamuReady === true && investingReady === true && yahooReady === true && weebullReady === true) {
        clearInterval(interval)
        notifyCurrency();  
      }
    }, 100)
      
    notifyCurrency();
  }

  const fetchCurrencyDunamu = async () => {
    const response = await fetch(REWRITE_ENDPOINT.CURRENCY_DUNAMU, {
      method: FETCH_METHOD.GET,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36'
      },
      body: null})
    if (!response) {
        return null;
    }
    if (response.status !== 200) {
        console.log("fetchCurrencyDunamu error: ", response);
        return null;
    }
    const jsonData: ICurrencyDunamuResponse[] = await response.json();    
    // log?.debug("Weebull", jsonData)
    if (jsonData && jsonData.length > 0) {
        const currencyInfo: ICurrencyInfo = {
          type: CURRENCY_SITE_TYPE.DUNAMU,
          price: jsonData[0].basePrice,
          timestamp: jsonData[0].timestamp,
        };
        return currencyInfo;
    }
    return null;
  }
  
  const fetchCurrencyInvestring = async () => {
    const response = await fetch(REWRITE_ENDPOINT.CURRENCY_INVESTING, {
      method: FETCH_METHOD.GET,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36'
      },
      body: null})
    if (!response) {
        return null;
    }
    if (response.status !== 200) {
        console.log("fetchCurrencyInvestring error: ", response);
        return null;
    }
    const jsonData: ICurrencyInvestringResponse[] = await response.json();    
    // log?.debug("Weebull", jsonData)
    if (jsonData && jsonData.length > 0) {
      const currencyInfo: ICurrencyInfo = {
        type: CURRENCY_SITE_TYPE.INVESTRING,
        price: jsonData[jsonData.length - 1].price,
        timestamp: jsonData[jsonData.length - 1].timestamp
      };
      return currencyInfo;
    }
    return null;
  }

  const fetchCurrencyYahoo = async () => {
    const response = await fetch(REWRITE_ENDPOINT.CURRENCY_YAHOO, {
      method: FETCH_METHOD.GET,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36'
      },
      body: null})
    if (!response) {
        return null;
    }
    if (response.status !== 200) {
        console.log("fetchCurrencyYahoo error: ", response);
        return null;
    }
    const json: any = await response.json()
    const jsonData: ICurrencyYahooResponse = json.chart?.result[0];
        
    // console.log("Yahoo jsonData", jsonData)
    if (jsonData) {
      if (!jsonData.indicators?.quote[0]?.close?.length) {
        return null;
      }
      let cnt = 0;
      let len = jsonData.indicators?.quote[0]?.close?.length-1;
      let sum = 0;
      for (let i=len; i>0; i--) {
        if (cnt >= 10) {
          break;
        }
        if (!jsonData.indicators?.quote[0]?.close[i]) {
          continue
        }
        sum+=jsonData.indicators?.quote[0]?.close[i];              
        cnt++;
      }
      const currencyInfo: ICurrencyInfo = {
        type: CURRENCY_SITE_TYPE.YAHOO,
        price: jsonData.meta.regularMarketPrice,
        avgPrice: sum / cnt,
        timestamp: jsonData.meta.regularMarketTime * 1000
      };
      // console.log("yahoo", currencyInfo);
      return currencyInfo;
    }
    return null;
  }

  const fetchCurrencyWeebull = async () => {
    const response = await fetch(REWRITE_ENDPOINT.CURRENCY_WEEBULL, {
      method: FETCH_METHOD.GET,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36'
      },
      body: null})
    if (!response) {
        return null;
    }
    if (response.status !== 200) {
        console.log("fetchCurrencyWeebull error: ", response);
        return null;
    }
    const jsonData: ICurrencyWeebullResponse = await response.json();    
    // log?.debug("Weebull", jsonData)
    if (jsonData) {    
      const currencyInfo: ICurrencyInfo = {
        type: CURRENCY_SITE_TYPE.WEBULL,
        price: parseFloat(jsonData.close),
        timestamp: moment.tz(jsonData.tradeTime, jsonData.timeZone).valueOf(),
      };
      return currencyInfo;
    }
    return null;
  }

  return {
    currency_addListener,
    currency_removeListener,
    currency_start,
    currency_stop,
  }
}

export default useCurrency