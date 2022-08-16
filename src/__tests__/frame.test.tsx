import FrameCom from '../componets/frame';
import { Frame } from '../core/player';
import {render, screen} from '@testing-library/react'

let testFrame = {
  downed: [] as number[],
  completed: false,
  mark: null,
};

test('Frame should contain two tiles', () => {
  render(<FrameCom frame={new Frame(1, testFrame)} isActivePlayer={true} />);
  const frame = screen.queryByTestId('frame');
  const tiles = screen.queryAllByTestId('tile');
  expect(frame).toContainElement(tiles[0]);
  expect(tiles).toHaveLength(2);
});

test('First Frame of game should contain no inner html in the first tile', () => {
  let frameProp = new Frame(1, testFrame);
  frameProp.downed.push(4);
  frameProp.total = frameProp.score;
  
  render(<FrameCom frame={frameProp} isActivePlayer={true} />);
  const firstRender = screen.queryAllByTestId('tile')
  expect(firstRender[0]).toBeEmptyDOMElement();
  expect(firstRender[1]).toHaveTextContent('4');
});
