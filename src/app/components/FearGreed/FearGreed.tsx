'use client'

import React, { useEffect, useRef, memo } from 'react';

export function FearGreed({exchange, coinPair, width, height}: any) {
    return (
        <img src="https://alternative.me/crypto/fear-and-greed-index.png" alt="Latest Crypto Fear & Greed Index" style={{width: "100%", height: "100%"}} />
    );
}

export default memo(FearGreed);
