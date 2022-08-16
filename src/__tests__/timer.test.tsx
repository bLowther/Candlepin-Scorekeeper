import Timer from '../componets/timer';
import {render, screen} from '@testing-library/react'

const testProps = {lane: 5, active: true, reset: false};

test('Timer should have a lane number', () => {
    render(<Timer  { ...testProps }/>);
    const lane = screen.getByText("Lane: 5");
    expect(lane).toBeDefined();
});

test('Timer should have a timer display', () => {
    render(<Timer  { ...testProps }/>);
    const timer = screen.getByText("Elapsed: 00:00");
    expect(timer).toBeDefined();
});