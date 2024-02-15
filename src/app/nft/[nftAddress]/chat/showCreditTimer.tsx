"use client";
import { useCreditContext } from "@/wrapper/credits.wrapper";
import React, { useState, useEffect } from "react";

const CountdownTimer = () => {
  const { creditsDetails, getSeconds, fetchData } = useCreditContext();
  console.log("🚀 ~ CountdownTimer ~ creditsDetails:", creditsDetails);
  const seconds = getSeconds();
  const [time, setTime] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds,
  });

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime((prevTime) => {
        const newSeconds = prevTime.seconds > 0 ? prevTime.seconds - 1 : 0;
        const newMinutes = Math.floor(newSeconds / 60);
        const newHours = Math.floor(newMinutes / 60);
        const newDays = Math.floor(newHours / 24);

        return {
          days: newDays,
          hours: newHours % 24,
          minutes: newMinutes % 60,
          seconds: newSeconds % 60,
        };
      });
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [creditsDetails]);

  // useEffect(() => {
  //   // Check if the timer has reached zero
  //   if (
  //     time.days === 0 &&
  //     time.hours === 0 &&
  //     time.minutes === 0 &&
  //     time.seconds === 0
  //   ) {
  //     // If yes, trigger the API call
  //     fetchData();
  //   }
  // }, [time]);

  // Conditionally render the timer only if there are remaining seconds
  return (
    <>
      {time.days > 0 ||
      time.hours > 0 ||
      time.minutes > 0 ||
      time.seconds > 0 ? (
        <div className="border-4 bg-red-900/10 rounded-2xl border-red-900/50 text-red-700/80 px-6 py-2 mt-1">
          <p>
            Not enough credits. Credits will reset in{" "}
            {time.days > 0 && `${time.days} days`}{" "}
            {time.hours > 0 && `${time.hours} hours`}{" "}
            {time.minutes > 0 && `${time.minutes} minutes`} {time.seconds}{" "}
            seconds
          </p>
        </div>
      ) : null}
    </>
  );
};

export default CountdownTimer;
