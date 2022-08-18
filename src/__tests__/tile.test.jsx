import Tile from '../componets/tile';
import {render, screen} from '@testing-library/react'

let testProps = {
  score: 8, 
  mark: null,
  active: true,
};

test('Tile that is active should have green border', () => {
    render(<Tile { ...testProps } />);
    const tile = screen.queryByTestId('tile');
    expect(tile).toHaveStyle('border-color: green');
});

test('Tile that has "spare" mark has propper css', () => {
  testProps.mark = 'spare';
  render(<Tile { ...testProps } />);
  const tile = screen.queryByTestId('tile');
  expect(tile).toHaveClass('spare');
});

test('Tile that has "strike" mark has propper css', () => {
  testProps.mark = 'strike';
  render(<Tile { ...testProps } />);
  const tile = screen.queryByTestId('tile');
  expect(tile).toHaveClass('strike');
});

test('Tile displays the proper score', () => {
  render(<Tile { ...testProps } />);
  const tile = screen.queryByTestId('tile');
  expect(tile).toHaveTextContent('8');
});