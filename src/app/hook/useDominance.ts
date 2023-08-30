"use client"

import _ from "lodash"
import { IDominanceChartInfo } from "@/config/interface";
import { coindex_getDominance } from "../lib/crypto3partyAPI/coindex/coindex";

function useDominance() {
  let listenerMap = new Map()
  let monitorInterval: any;
  let dominanceInfo: IDominanceChartInfo;

  const dominance_addListener = (key: string, callback: any) => {
    listenerMap.set(key, callback);
    notifyCurrency();
  }

  const dominance_removeListener = (key: string) => {
    listenerMap.delete(key);
  }

  const notifyCurrency = () => {
    if (listenerMap.size === 0) {
      return;
    }
    if (!dominanceInfo || dominanceInfo.curDominance == 0 || dominanceInfo.chart?.length === 0) {
      return;
    }
    listenerMap.forEach((callback: any, key: string) => {
      callback(dominanceInfo);
    });
  }

  const dominance_start = async (interval: number = 60 * 1000) => {
    if (monitorInterval != null) {
        console.log('DominanceHandler monitor alread started. skip start.');
        return;
    }
    console.log('DominanceHandler monitor start');
    intervalProcess();
    monitorInterval = setInterval(() => {
      intervalProcess();
    }, interval);
  };

  const dominance_stop = () => {
    console.log('DominanceHandler monitor stop');
    if (monitorInterval != null) {
        clearInterval(monitorInterval);
        monitorInterval = null;
    }
  }

  const intervalProcess = async () => {
    const newDominanceInfo: IDominanceChartInfo = await coindex_getDominance()
    dominanceInfo = _.cloneDeep(newDominanceInfo);
    notifyCurrency();
  }

  return {
    dominance_addListener,
    dominance_removeListener,
    dominance_start,
    dominance_stop,
  }
}

export default useDominance