"use client";
import { useCreditContext } from "@/wrapper/credits.wrapper";
import React, { useState, useEffect, useRef } from "react";

const CountdownTimer: React.FC = () => {
  const { getSeconds, fetchData } = useCreditContext();
  const remaining = getSeconds();

  const [seconds, setSeconds] = useState(remaining);
  const fetchRef = useRef(false); // Track if fetchData has been called

  useEffect(() => {
    const intervalId = setInterval(() => {
      // Decrement seconds if positive and not below 0
      if (seconds > 0) {
        setSeconds((prevSeconds) => prevSeconds - 1);
      }
    }, 1000);

    // Clear the interval on cleanup
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (seconds <= 0 && !fetchRef.current) {
      fetchRef.current = true;
      fetchData();
    }
  }, [seconds]);

  const formattedTime = formatTime(seconds);

  return (
    <>
      {seconds > 0 ? (
        <div className="border-4 bg-red-900/10 rounded-2xl border-red-900/50 text-red-700/80 px-6 py-2 mt-1">
          <p>Not enough credits. Credits will reset in {formattedTime}</p>
        </div>
      ) : null}
    </>
  );
};

export default CountdownTimer;

function formatTime(seconds: number): string {
  const days = Math.floor(seconds / (24 * 3600));
  const hours = Math.floor((seconds % (24 * 3600)) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formatUnit = (value: number, unit: string): string => {
    if (value === 1) {
      return `${value} ${unit}`;
    } else if (value > 1) {
      return `${value} ${unit}s`;
    }
    return "";
  };

  const formattedTime = `${formatUnit(days, "day")} ${formatUnit(
    hours,
    "hour"
  )} ${formatUnit(minutes, "minute")} ${formatUnit(
    remainingSeconds,
    "second"
  )}`.trim();

  return formattedTime;
}
