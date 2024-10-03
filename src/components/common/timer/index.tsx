import { useState, useEffect } from 'react'

interface TimerProps {
  countTime: number
}

export default function Timer({ countTime }: TimerProps) {
  const [time, setTime] = useState(Math.ceil(countTime / 1000));

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <span className='text-center'>
      {time > 0 ? (
        <>
          <span>{Math.floor(time / 60)}</span>:
          <span>{time - Math.floor(time / 60) * 60}</span>
        </>
      ) : (
        "Almost Done"
      )}
    </span>
  )
}
