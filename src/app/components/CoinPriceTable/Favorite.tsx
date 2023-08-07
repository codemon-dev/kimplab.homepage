import {  Typography, Rate } from 'antd';
import React from 'react';

export const Favorite = (props: any) => {
    if (!props.data) return null;
    const favorite = props?.data?.favorite;
    return (
        <div style={{display: 'flex', flexDirection: "column", alignItems: "center", justifyContent: "center", height: '50px', margin: 0, padding: 0}}>
            <Rate count={1} style={{flex: 1, margin: 0, padding: 0}} defaultValue={favorite === true? 1: 0} />
        </div>
    );
};

export default Favorite;