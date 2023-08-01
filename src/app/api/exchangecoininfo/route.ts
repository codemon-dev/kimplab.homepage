import prisma from '@/app/lib/prisma'
import { IExchangeCoinInfo } from '@/config/interface';

interface IExchangeCoinInfoReq {
    data: IExchangeCoinInfo[]
}

export async function POST(request: Request) {
  const body: IExchangeCoinInfoReq = await request.json()

  console.log("request: ", request);
  let retData: any = [];
  for (const obj of body.data) {  
    let exchangeCoinInfo = await prisma.exchangeCoinInfo.findFirst({
        where: {
            AND: [
                { exchange: obj.exchange},
                { symbol: obj.symbol},
                { coinPair: obj.coinPair},
                { market: obj.market},
            ],
        }
    })
    retData.push(await prisma.exchangeCoinInfo.upsert({
        where: { id: exchangeCoinInfo?.id ?? -1 },
        update: obj,
        create: obj,
    }))
  };
  return new Response(JSON.stringify(retData))
}

