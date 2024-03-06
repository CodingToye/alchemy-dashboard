import React from 'react';
import { Card, Flowbite, Progress } from 'flowbite-react';
import { PlusIcon } from '@heroicons/react/24/solid';
import { TagIcon } from '@heroicons/react/16/solid';

import type { CustomFlowbiteTheme } from 'flowbite-react';

import { valueDifference, calcPercentage } from '../../utils/panels.utils';

const customTheme: CustomFlowbiteTheme = {
    progress: {
        bar: 'bg-iron/50',
    },
};

const StarterPanel = ({ handleClick }) => {
    const progressToTarget = calcPercentage(1000, 2000);
    return (
        <Card
            className='bg-white/10  hover:bg-white/15 border border-dashed border-white/10 text-white/40 rounded justify-start p-3 cursor-pointer'
            onClick={handleClick}
        >
            <header className='w-full mb-3 text-center'>
                <h2 className='uppercase text-sm flex items-center justify-center gap-0'>
                    Click to add new panel{' '}
                    <PlusIcon className='ml-2 h-4 w-4 text-white/4' />
                </h2>
            </header>
            <div className='text-5xl flex justify-between items-end opacity-10'>
                <div data-testid='panel-value-test'>
                    1000
                    <small className='text-lg '>kw/h</small>
                </div>
            </div>
            <div className='bg-charcoal p-4 rounded-md opacity-10'>
                <div className='flex justify-between items-center mb-2 '>
                    <h2>Goal</h2>
                    <span className='text-xs' data-testid='panel-target-test'>
                        2000
                    </span>
                </div>
                <div className='flex justify-end mb-2'>
                    <span>{valueDifference('0', '1000')}</span>
                </div>

                <Flowbite theme={{ theme: customTheme }}>
                    <Progress
                        progress={progressToTarget}
                        size='lg'
                        textLabel='test'
                        color='bg-orange'
                        className='mb-2'
                    />
                </Flowbite>
            </div>
            <footer className='flex items-center px-1 opacity-10'>
                <TagIcon className='w-3 h-3 mr-2 ' />
                <small className=''>tag</small>
            </footer>
        </Card>
    );
};

export default StarterPanel;
