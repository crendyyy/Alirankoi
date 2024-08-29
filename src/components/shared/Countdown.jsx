import { useEffect, useState, useRef } from "react";

const Countdown = ({ endTime }) => {
  const [remainingTime, setRemainingTime] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    const updateRemainingTime = () => {
      const timeLeftInMS = new Date(endTime) - new Date();
      if (timeLeftInMS > 0) {
        setRemainingTime(timeLeftInMS);
      } else {
        setRemainingTime(0);
        clearInterval(intervalRef.current);
      }
    };

    updateRemainingTime(); // get initial remainingTime value
    intervalRef.current = setInterval(updateRemainingTime, 1000);

    return () => clearInterval(intervalRef.current);
  }, [endTime]);

  const formatTime = () => {
    const totalSeconds = Math.floor(remainingTime / 1000);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const formattedMinutes = minutes.toString().padStart(2, "0");
    const formattedSeconds = seconds.toString().padStart(2, "0");
    return `${formattedMinutes}:${formattedSeconds}`;
  };

  return <span className="text-red-600">{formatTime(remainingTime)}</span>;
};

export default Countdown;
