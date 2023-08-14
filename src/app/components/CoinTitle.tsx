import { Avatar, Row, Col, Typography } from 'antd';
import React from 'react';
const { Title, Text } = Typography;

export const CoinTitle = (props: any) => {
    if (!props.data) return null;
    // console.log(props.data)
    const symbol = props?.data?.symbol;
    const coinPair = props?.data?.coinPair;
    const symbolImg = props?.data?.symbolImg;
    return (
        <div>
            <Row>
                <Col>
                    <div style={{display: 'flex', flexDirection: "column", alignItems: "flex-start", justifyContent: "center", height: '50px', margin: 0, padding: 0}}>
                        <Avatar src={symbolImg} style={{ backgroundColor: "white", verticalAlign: 'middle'}} size="default" gap={5}>
                            {symbolImg? null: symbol}
                        </Avatar>
                    </div>
                </Col>
                <Col>
                    <div style={{display: 'flex', flexDirection: "column", alignItems: "flex-start", justifyContent: "center", height: '50px', margin: 0, padding: 0, paddingLeft: 6}}>
                        <Title level={5} style={{margin: 0, padding: 0, gap: 0}}>{symbol}</Title>
                        <Text style={{fontSize: '10px', margin: 0, padding: 0, gap: 0}}>{coinPair}</Text>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default CoinTitle;