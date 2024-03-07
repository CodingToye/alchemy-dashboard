import React, { useState } from 'react';

import {
    FireIcon,
    LightBulbIcon,
    HeartIcon,
    SunIcon,
} from '@heroicons/react/24/solid';

const GetIcon = ({ type }) => {
    const [activated, setActivated] = useState(false);
    const handleOnClick = () => {
        setActivated(!activated);
    };
    const iconClass = `w-4 h-4 transition cursor-pointer  ${
        activated ? 'text-white' : 'text-white/50'
    }`;
    switch (type) {
        case 'Heating':
            return <FireIcon className={iconClass} onClick={handleOnClick} />;
        case 'Water':
            return <SunIcon className={iconClass} onClick={handleOnClick} />;
        case 'Electricity':
            return (
                <LightBulbIcon className={iconClass} onClick={handleOnClick} />
            );
        case 'Energy Saving':
            return <HeartIcon className={iconClass} onClick={handleOnClick} />;
        default:
            return 'DEFAULT';
    }
};

export default GetIcon;
