import { useEffect } from "react";

const Timer: React.FC<{timer: string; updateTimer:(cb:(date:Date)=>string)=>void; gameId: string}> = ({timer, updateTimer, gameId}) => {

  const updater = (date:Date) => {
    const startTime = date.getTime();   
    const currentTime = new Date().getTime();

    let timeDiff = Math.round((currentTime-startTime)/1000);
    
    const days = Math.floor(timeDiff/(24*60*60));
    timeDiff = timeDiff-(days*24*60*60);

    const hours = Math.floor(timeDiff/(60*60));
    timeDiff = timeDiff-(hours*60*60);

    const mins = Math.floor(timeDiff/(60));
    timeDiff = timeDiff-(mins*60);

    const secs = timeDiff;

    const manyDays = days > 0 ? days + ' Days ' : '';
    const manyHours = hours > 0 || days > 0 ? hours + ' Hours ' : '';
    const manyMins = mins > 0 || hours > 0 || days > 0 ? mins + ' Mins ' : '';
    const manySecs = secs + ' Secs';

    return manyDays + manyHours + manyMins + manySecs;
  }

  useEffect(()=>{
    setInterval(
      () => updateTimer(updater),
      1000
    );
  },[updateTimer, gameId])

  



  return (
    <div > 
      {timer}
    </div>
  );
};

export default Timer;