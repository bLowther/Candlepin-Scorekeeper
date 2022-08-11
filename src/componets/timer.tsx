
const Timer: React.FC<{lane: number; timer: number}> = ({lane, timer}) => {

  const format = (secs: number) => {
    const pad = (n: number) => n < 10 ? `0${n}` : n;

    const h = Math.floor(secs / 3600);
    const m = Math.floor(secs / 60) - (h*60);
    const s = Math.floor(secs - h*3600 - m*60);

    return h ? `${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`
  }
  
  return (
    <div className={"container"}>
      <div className={"row"}>
        <div className={"col"}>Lane: {lane}</div>
        <div className={"col"} style={{textAlign: "right"}}>Elapsed: {format(timer)}</div> 
      </div>

    </div>
  );
};

export default Timer;