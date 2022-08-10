import Reset from '../componets/reset';
import {render, screen} from '@testing-library/react'

let testProps = {
  activeFrame: 4,
  rolledFirstBall: false,
  resetModalToggle: ()=>{}
};

test('Reset should have 10 frames', () => {
    render(<Reset { ...testProps } />);
    const frames = screen.getAllByLabelText("Frame");
    expect(frames).toHaveLength(10);
});

test('the active frame should be green', () => {
  render(<Reset { ...testProps } />);
  const activeFrame = screen.getByText(4);
  expect(activeFrame).toHaveClass('activeNumber');
});

test('Reset button should not be displayed on first roll', () => {
  render(<Reset { ...testProps } />);
  const button = screen.queryByTestId("ResetButton");
  expect(button).toHaveStyle('visibility: hidden');
});

