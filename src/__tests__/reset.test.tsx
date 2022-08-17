import Reset from '../componets/reset';
import {render, fireEvent, screen} from '@testing-library/react'
import { Player } from '../core/player';
import React from 'react';

let testProps = {
  completed:false,
  players:[new Player('test')],
  initializeGame:(players:Player[])=>{}, 
  stopTimer:()=>{}
};

test('Reset should have 10 frames', () => {
    render(<Reset { ...testProps } />);
    const frames = screen.getAllByLabelText("Frame");
    expect(frames).toHaveLength(10);
});

test('Reset button should not be displayed on first roll', () => {
  render(<Reset { ...testProps } />);
  const button = screen.queryByTestId("ResetButton");
  expect(button).toHaveStyle('visibility: hidden');
});

test('the active frame should be green', () => {
  render(<Reset { ...testProps } />);
  const activeFrame = screen.getByText(1);
  expect(activeFrame).toHaveClass('activeNumber');
});

test('Reset button should open reset Modal', () => {
  const setStateMock = jest.fn();
  const useStateMock: any = (useState: any) => [useState, setStateMock];
  jest.spyOn(React, 'useState').mockImplementation(useStateMock);
  render(<Reset { ...testProps } />);
  fireEvent.click(screen.getByTestId("ResetButton"))
  expect(setStateMock).toHaveBeenCalled();
});



