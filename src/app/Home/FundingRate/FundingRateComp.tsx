import { removeTrailingZeros } from '@/app/helper/cryptoHelper';
import { convertKoreanCurrency } from '@/app/lib/tradeHelper';
import { IFundingFeeInfo } from '@/config/interface';
import { Typography } from 'antd';
import React, { useState, useEffect } from 'react';
const { Title, Text } = Typography;

interface Props {
    fundingFeeInfo: IFundingFeeInfo
}

export const FundingRateComp = ({fundingFeeInfo}: Props) => {    
    const [fundingRate, setFundingRate] = useState<string>('-');
    const [fundingTime, setFundingTime] = useState<string>('');
    const [color, setColor] = useState<string>('black')    

    useEffect(() => {
        if (!fundingFeeInfo) return;
        if (fundingFeeInfo.fundingRate > 0) setColor('#089981')
        else if (fundingFeeInfo.fundingRate < 0) setColor('#f23645')

        if (!fundingFeeInfo.fundingRate || fundingFeeInfo.fundingRate === 0) {
            setFundingRate("-") 
        } else {
            setFundingRate(`${fundingFeeInfo.fundingRate.toFixed(6)}%`)
            setFundingTime(new Date(fundingFeeInfo.nextTimestamp).toLocaleTimeString())
        }
    }, [fundingFeeInfo])

    return (
        <div style={{display: 'flex', flexDirection: "row", alignItems: "center", justifyContent: "flex-end", margin: 0, padding: 0}}>
            <Text style={{color: color, margin: 0, fontSize: "14px"}}>{fundingRate}</Text>
            <Text style={{color: "black", margin: 0, fontSize: "14px", marginLeft: "8px"}}>{fundingTime}</Text>
        </div>
    );
};

export default FundingRateComp;