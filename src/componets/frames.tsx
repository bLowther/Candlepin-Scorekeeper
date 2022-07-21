import { Frames } from '../swagger-generated-client';
import FrameCom from './frame';

const FramesCom: React.FC<{frames: Frames}> = ({frames}) => {

  return (
    <div className={"container text-center"}>
      <div className={"row"}>
        {frames.map(frame => (
          <FrameCom frame={frame}/>
        ))}
      </div>
    </div>
  );
};

export default FramesCom;