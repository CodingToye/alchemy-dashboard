import React from 'react';
import { render, screen } from '@testing-library/react';
import Tag from './Tag';

describe('Tag', () => {
    const handleClick = jest.fn();
    const tagText = 'Tag 1';

    const renderTag = (activated: true | false) => {
        return render(
            <Tag onClick={handleClick} activated={activated}>
                {tagText}
            </Tag>
        );
    };

    test('renders Tag in deactivated state', () => {
        renderTag(false);
        const tagComp = screen.getByTestId('tag-test');
        expect(tagComp).toBeInTheDocument();
    });

    test('renders Tag in activated state', () => {
        renderTag(true);
        const tagComp = screen.getByTestId('tag-test');
        expect(tagComp).toBeInTheDocument();
    });
});
