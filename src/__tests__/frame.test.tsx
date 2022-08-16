import FrameCom from '../componets/frame';
import { Frame } from '../core/player';
import {render, screen} from '@testing-library/react'

let testFrame = new Frame(1,{
  downed: [],
  completed: false,
  mark: null,
});

test('Frame should contain two tiles', () => {
  render(<FrameCom frame={testFrame} isActivePlayer={true} />);
  const frame = screen.queryByTestId('frame');
  const tiles = screen.queryAllByTestId('tile');
  expect(frame).toContainElement(tiles[0]);
  expect(tiles).toHaveLength(2);
});

test('First Frame of game should contain no inner html in the first tile', () => {
  testFrame.total = 4;
  
  render(<FrameCom frame={testFrame} isActivePlayer={true} />);
  const tiles = screen.queryAllByTestId('tile')
  expect(tiles[0]).toBeEmptyDOMElement();
  expect(tiles[1]).toHaveTextContent('4');
});

test('Frame calculates scores properly', () => {
  testFrame.number = 2;
  testFrame.downed = [0,7,2];
  testFrame.total = 4 + testFrame.score;
  
  render(<FrameCom frame={testFrame} isActivePlayer={true} />);
  const tiles = screen.queryAllByTestId('tile');
  expect(tiles[0]).toHaveTextContent('9');
  expect(tiles[1]).toHaveTextContent('13');
});

test('Spares and Strikes should contain no inner html in the second tile', () => { 
  testFrame.downed = [10];
  testFrame.mark = 'strike'
  testFrame.total = testFrame.score;
  
  render(<FrameCom frame={testFrame} isActivePlayer={true} />);
  const tiles = screen.queryAllByTestId('tile');
  expect(tiles[0]).toBeEmptyDOMElement();
  expect(tiles[1]).toHaveTextContent('10');
});


