import {  Typography, Rate } from 'antd';
import React from 'react';

export const Favorite = (props: any) => {
    if (!props.data) return null;
    const favorite = props?.data?.favorite;
    return (
        <div>
            <Rate count={1} defaultValue={favorite === true? 1: 0} />
        </div>
    );
};

export default Favorite;