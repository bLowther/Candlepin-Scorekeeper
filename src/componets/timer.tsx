
const Timer: React.FC<{lane: number; timer: {secs:number; mins:number}}> = ({lane, timer}) => {
  
  const mins = timer.mins;
  const secs = timer.secs;

  const minsString = mins < 10 ? "0" + mins : mins.toString()
  const secsString = secs < 10 ? "0" + secs : secs.toString()


  return (
    <div className={"container"}>
      <div className={"row"}>
        <div className={"col"}>Lane: {lane}</div>
        <div className={"col"} style={{textAlign: "right"}}>Elapsed: {minsString+":"+secsString}</div> 
      </div>

    </div>
  );
};

export default Timer;