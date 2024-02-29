import React from 'react';
import { ArrowDownLeftIcon, ArrowUpRightIcon } from '@heroicons/react/24/solid';

export const valueDifference = (original: string, value: string) => {
    return original !== '' ? (
        <small
            className={`flex text-xs items-center ml-6 ${
                parseInt(value) < parseInt(original)
                    ? 'text-failure'
                    : 'text-success'
            }`}
        >
            {parseInt(value) < parseInt(original) ? (
                <ArrowDownLeftIcon className='w-3 h-3 text-inherit mr-1' />
            ) : (
                <ArrowUpRightIcon className='w-3 h-3 text-inherit mr-1' />
            )}
            {Math.abs(parseInt(value) - parseInt(original))}
        </small>
    ) : null;
};
