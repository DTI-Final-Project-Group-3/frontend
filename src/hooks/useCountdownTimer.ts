import { useState, useEffect, useRef } from "react";

export const useCountdownTimer = (
  createdAt: string | undefined,
  durationMs = 3600000
) => {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!createdAt) return;

    // Convert createdAt to a Date object
    const createdTime = new Date(createdAt).getTime();
    const expiryTime = createdTime + durationMs; // Default: 1 hour later

    const updateTimer = () => {
      const currentTime = new Date().getTime();
      const remainingTime = Math.max(
        Math.floor((expiryTime - currentTime) / 1000),
        0
      );

      // Only update state if timeLeft is different
      setTimeLeft((prev) => (prev !== remainingTime ? remainingTime : prev));

      if (remainingTime <= 0 && intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };

    updateTimer(); // Initialize timer immediately
    intervalRef.current = setInterval(updateTimer, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [createdAt, durationMs]);

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(
      2,
      "0"
    )}`;
  };

  return { timeLeft, formattedTime: formatTime(timeLeft) };
};
