import { useState, useEffect, FC } from 'react';

const Timer: FC<{lane: number; active: boolean, reset: boolean}> = ({lane, active, reset}) => {
  const [counter, setCounter] = useState<number>(0);

  const format = (secs: number) => {

    const pad = (n: number) => n < 10 ? `0${n}` : n;

    const h = Math.floor(secs / 3600);
    const m = Math.floor(secs / 60) - (h*60);
    const s = Math.floor(secs - h*3600 - m*60);

    return h ? `${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
  }

  useEffect(() => {
    if(active){
      const timerID = setInterval(() => {
        setCounter(prevCount => prevCount + 1);
      }, 1000);
      return () => clearInterval(timerID);
  }},[setCounter, active]);

  useEffect(()=> {if(reset)setCounter(0)},[reset]);
  
  return (
    <div className={"container"}>
      <div className={"row"}>
        <div className={"col"}>Lane: {lane}</div>
        <div className={"col"} style={{textAlign: "right"}}>Elapsed: {format(counter)}</div> 
      </div>

    </div>
  );
};

export default Timer;