import { removeTrailingZeros } from '@/app/helper/cryptoHelper';
import { getCountdown } from '@/app/helper/timestampHelper';
import { convertKoreanCurrency } from '@/app/lib/tradeHelper';
import { IFundingFeeInfo } from '@/config/interface';
import { Typography } from 'antd';
import React, { useState, useEffect, useRef } from 'react';
const { Title, Text } = Typography;

interface Props {
    fundingFeeInfo: IFundingFeeInfo
}

export const FundingRateComp = ({fundingFeeInfo}: Props) => {    
    const [fundingRate, setFundingRate] = useState<string>('-');
    const nextTimestameRef = useRef(0);
    const [countdown, setCountdown] = useState<string>('');
    const [color, setColor] = useState<string>('black')

    const isMounted = useRef(false)
    const interval = useRef<any>();

    useEffect(() => {
        if (isMounted.current === true) return;
        isMounted.current = true;
        interval.current = setInterval(()=> {
            if (nextTimestameRef.current === 0) return;
            setCountdown(getCountdown(nextTimestameRef.current))
        }, 1000)
        return () => {
            isMounted.current = false;
            if (interval.current) {
                clearInterval(interval.current)
            }
            interval.current = null;
            return;
        }
    }, [])

    useEffect(() => {
        if (!fundingFeeInfo) return;
        if (fundingFeeInfo.fundingRate > 0) setColor('#089981')
        else if (fundingFeeInfo.fundingRate < 0) setColor('#f23645')

        if (!fundingFeeInfo.fundingRate || fundingFeeInfo.fundingRate === 0) {
            setFundingRate("-") 
        } else {
            setFundingRate(`${fundingFeeInfo.fundingRate.toFixed(6)}%`)
            if (nextTimestameRef.current === 0) {
                setCountdown(getCountdown(fundingFeeInfo.nextTimestamp))
            }
            nextTimestameRef.current = fundingFeeInfo.nextTimestamp;
        }
    }, [fundingFeeInfo])

    return (
        <div style={{display: 'flex', flexDirection: "row", alignItems: "center", justifyContent: "flex-end", margin: 0, padding: 0}}>
            <Text style={{color: color, margin: 0, fontSize: "14px"}}>{fundingRate}</Text>
            <Text style={{color: "black", margin: 0, fontSize: "14px", marginLeft: "8px"}}>{countdown}</Text>
        </div>
    );
};

export default FundingRateComp;