
import React from 'react';
import type { CustomTagProps } from 'rc-select/lib/BaseSelect';
import { Select, Tag } from 'antd';

const CustomTag = (props: CustomTagProps) => {
    const { label, value, closable, onClose } = props;
    const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
        event.preventDefault();
        event.stopPropagation();
    };

    return (
        <Tag
            color={"success"}
            onMouseDown={onPreventMouseDown}
            closable={closable}
            onClose={onClose}
            style={{ marginRight: 3 }}
            >
            {label}
        </Tag>
    );
};

export default CustomTag;

