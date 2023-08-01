import prisma from '@/app/lib/prisma'

export interface IInitialData {
    exhcnageCoinInfos: Map<string, any>
}

export async function GET() {
    const exchangeCoinInfos = await prisma.exchangeCoinInfo.findMany()
    let initialData: IInitialData = {
        exhcnageCoinInfos: new Map<string, any>()
    }
    exchangeCoinInfos?.forEach((obj) => {
        initialData.exhcnageCoinInfos.set(`${obj.exchange}_${obj.market}_${obj.coinPair}`, obj)
    })
    return new Response(JSON.stringify(initialData))
}
