"use client";

import React, { useEffect, useState } from "react";
import Digit from "./Digit";

interface ILeaderboardTimerProps {
  endingTime: Date;
}

export default function LeaderboardTimer({
  endingTime,
}: ILeaderboardTimerProps) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!endingTime) {
      return;
    }

    const intervalId = setInterval(() => {
      const epoch = new Date().getTime();
      setSeconds(
        endingTime.getTime() > epoch
          ? Math.floor((endingTime.getTime() - epoch) / 1000)
          : 0
      );
    });

    return () => clearInterval(intervalId);
  }, [endingTime]);

  return (
    <div className="md:absolute md:right-[54px] relative flex gap-[9px]">
      <Digit value={Math.floor(seconds / 86400)} unit="Days" />
      <Digit value={Math.floor((seconds % 86400) / 3600)} unit="Hrs" />
      <Digit value={Math.floor((seconds % 3600) / 60)} unit="Mins" />
      <Digit value={Math.floor(seconds % 60)} unit="Secs" />
    </div>
  );
}
