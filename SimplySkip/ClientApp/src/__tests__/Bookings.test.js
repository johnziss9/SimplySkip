import React from 'react';
import Bookings from '../../src/pages/Bookings/Bookings';
import { BrowserRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';

describe('Bookings component', () => {
    afterEach(() => {
        jest.clearAllMocks(); // Clear mocks after each test
    });

    test('renders without crashing', () => {
        render(<BrowserRouter><Bookings /></BrowserRouter>);
    });

    test('initial state values are set correctly', () => {
        render(<BrowserRouter><Bookings /></BrowserRouter>);

        // Check that there's no data before skips are fetched
        expect(screen.queryAllByRole('listitem')).toHaveLength(0);
    });
});