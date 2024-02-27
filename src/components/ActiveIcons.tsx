import React, { useState } from 'react';

import { FireIcon, LightBulbIcon, HeartIcon } from '@heroicons/react/24/solid';

const ActiveIcon = ({ Icon }) => {
    const [activeIcon, setActiveIcon] = useState(false);

    const activateIcon = async () => {
        setActiveIcon(!activeIcon);
    };

    return (
        <Icon
            className={`h-4 w-4 ${
                activeIcon ? 'text-white' : 'text-white/15 hover:text-white/30'
            } transition cursor-pointer`}
            title='Settings'
            onClick={() => activateIcon()}
        />
    );
};

export const HeatingActive = () => <ActiveIcon Icon={FireIcon} />;
export const WaterActive = () => <ActiveIcon Icon={FireIcon} />;
export const ElectricityActive = () => <ActiveIcon Icon={LightBulbIcon} />;
export const EnergySavingActive = () => <ActiveIcon Icon={HeartIcon} />;
