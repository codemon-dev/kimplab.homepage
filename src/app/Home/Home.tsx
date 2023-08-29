"use client"

import React, {useEffect, useState} from 'react';
import { Col, Row, Space, Statistic } from 'antd';import PrimiumSummary from '../components/PrimiumSummary/PrimiumSummary';
import { TradingViewWidgetHeatMap } from '../components/TradingViewWidget/MarketcapHeatMap';
import { FearGreed } from '../components/FearGreed/FearGreed';
import LongShortRaio from '../components/LongShortRaio/LongShortRaio';
import { Card } from "antd";
import './HomeStyle.css';
import { useGlobalStore } from '../hook/useGlobalStore';
import { ICurrencyInfo } from '@/config/interface';
import { CURRENCY_SITE_TYPE } from '@/config/enum';
import { removeTrailingZeros } from '../helper/cryptoHelper';
import { Typography } from 'antd';
import { convertLocalTime } from '../lib/timestampHelper';
const { Title, Text } = Typography;

export default function Home() {
    const {state} = useGlobalStore();
    const [currencyPrice, setCurrencyPrice] = useState<string>("")
    const [currencyDate, setCurrencyDate] = useState<string>("")


    useEffect(() => {
        console.log(state.currencyInfos)
        const currencyInfo: any = state.currencyInfos.get(CURRENCY_SITE_TYPE.WEBULL)
        if (!currencyInfo) return;
        setCurrencyPrice(removeTrailingZeros(currencyInfo.price))
        setCurrencyDate(convertLocalTime(currencyInfo.timestamp))
    }, [state.currencyInfos])

    
    return (
        <div style={{width: "100%", height: "100%", padding: 0}}>
            <Row>
                <Col span={4} style={{backgroundColor: "gray"}}>
                    광고1
                </Col>
                <Col span={16}>
                    <Row justify="center" align="top">
                        <div style={{display: "flex",  padding: "0 4px", margin: "0 0 8px 0", width: "100%", height: "250px"}}>                            
                            <div style={{flex: 1, padding: 0, margin: 0, height: "100%"}}>
                                <TradingViewWidgetHeatMap />
                            </div>
                            <div style={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", padding: 0, margin: "0 0 0 8px", width: "180px", height: "100%"}}>
                                <Card bordered={false} size="small" style={{width: "180px", height: "120px"}} bodyStyle={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%", height: "100%"}}>
                                    <Text style={{color: "gray", margin: 0, padding: 0}}>환율 (WEEBULL)</Text>
                                    <Title level={3} style={{color: "#73a745", margin: 0, padding: 0}}>{currencyPrice} 원</Title>
                                    <Text style={{fontSize: "8px", color: "gray", margin: 0, padding: 0}}>{currencyDate}</Text>
                                </Card>    
                                <Card bordered={false} size="small" style={{width: "180px", height: "120px"}} bodyStyle={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%", height: "100%"}}>
                                    <Text style={{color: "gray", margin: 0, padding: 0}}>BTC 도미넌스</Text>
                                    <Title level={3} style={{color: "#73a745", margin: 0, padding: 0}}>{currencyPrice}%</Title>
                                    <Text style={{fontSize: "8px", color: "gray", margin: 0, padding: 0}}>{currencyDate}</Text>
                                </Card>   
                            </div>
                            <div style={{padding: 0, margin: "0 0 0 8px", width: "250px", height: "100%"}}>
                                <FearGreed />
                            </div>
                        </div>
                    </Row>                    
                    <Row gutter={[4, 8]} justify="center" align="top">
                        <Col flex="1 1 600px">
                            <div style={{padding: "0px 4px", margin: 0, height: "100%"}}>                            
                                <PrimiumSummary />
                            </div>
                        </Col>
                        <Col flex="1 1 600px">
                            <div style={{display: "flex", flexDirection: "column", padding: "0px 4px", margin: 0, height: "442px"}}>
                                <LongShortRaio />
                            </div>
                        </Col>

                        {/* <div style={{display: "flex",  padding: 0, margin: 0, marginTop: 8, width: "100%", height: "100%"}}>                            
                            <div style={{flex: 1, padding: "0px 4px", margin: 0, height: "100%"}}>                            
                                <PrimiumSummary />
                            </div>
                            <div style={{flex: 1, display: "flex", flexDirection: "column", padding: "0px 4px", margin: 0}}>
                                <LongShortRaio />
                            </div>
                        </div> */}
                    </Row>      
                </Col>
                <Col span={4} style={{backgroundColor: "gray"}}>
                    광고2
                </Col>

            </Row>
            
        </div>
    );
}
