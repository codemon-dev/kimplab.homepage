

// function useGlobalStore() {
//   const symbolImgMap: Map<string, IImgInfo> = new Map<string, IImgInfo>()
//   const exchangeImgMap: Map<string, IImgInfo> = new Map<string, IImgInfo>()
//   const etcImgMap: Map<string, IImgInfo> = new Map<string, IImgInfo>()

//   const setImgInfo = (imgType:IMG_TYPE, imgInfos: IImgInfo[]) => {    
//     if (imgType === IMG_TYPE.SYMBOL) {
//       imgInfos.forEach((obj: IImgInfo) => {
//         symbolImgMap.set(obj.id, obj);
//       })
//     } else if (imgType === IMG_TYPE.EXCHANGE) {
//       imgInfos.forEach((obj: IImgInfo) => {
//         exchangeImgMap.set(obj.id, obj);
//       })
//     } else if (imgType === IMG_TYPE.ETC) {
//       imgInfos.forEach((obj: IImgInfo) => {
//         etcImgMap.set(obj.id, obj);
//       })
//     }
    
//   }

//   return [
//     symbolImgMap,
//     exchangeImgMap,
//     etcImgMap,
//     setImgInfo]
// }

// export default useGlobalStore


import {useContext} from 'react'
import { GlobalStoreContext } from '../store/store';
// Create the custom hook to access the global store with types
export const useGlobalStore = () => {
  const context = useContext(GlobalStoreContext);
  if (!context) {
    throw new Error('useGlobalStore must be used within a GlobalStoreProvider');
  }
  return context;
};