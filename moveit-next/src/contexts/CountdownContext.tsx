import { createContext, FC, ReactNode, useCallback, useContext, useEffect, useState } from "react"

import { useChallenges } from "./ChallengesContext";

interface CountdownProviderProps {
  children: ReactNode;
}

interface CountdownContextData {
  minutes: number;
  seconds: number;
  hasFinished: boolean;
  isActive: boolean;
  startCountdow(): void;
  resetCountdown(): void;
}

const CountdownContext = createContext<CountdownContextData>({} as CountdownContextData);

let countdownTimeout: NodeJS.Timeout;

const CountdownProvider: FC<CountdownProviderProps> = ({ children }) => {
  const { startNewChallenge } = useChallenges();

  const [time, setTime] = useState(0.05 * 60);
  const [isActive, setIsActive] = useState(false);
  const [hasFinished, setHasFinished] = useState(false);

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  
  const startCountdow = useCallback(() => {
    setIsActive(true)
  }, [isActive])

  const resetCountdown = useCallback(() => {
    clearTimeout(countdownTimeout)

    setTime(0.05 * 60);
    setIsActive(false);
    setHasFinished(false);
  }, [isActive])

  useEffect(() => {
    if (isActive && time > 0) {
      countdownTimeout = setTimeout(() => {
        setTime(time - 1);
      }, 1000);
    } else if (isActive && time == 0) {
      setHasFinished(true);
      setIsActive(false);
      startNewChallenge();
    }
  }, [isActive, time])

  return (
    <CountdownContext.Provider value={{ 
      minutes,
      seconds,
      hasFinished,
      isActive,
      startCountdow,
      resetCountdown
     }}
    >
      {children}
    </CountdownContext.Provider>
  )
}

function useCountdown(): CountdownContextData {
  const context = useContext(CountdownContext);

  if(!context) {
    throw new Error('useCountdown must be used within an CountdownProvider');
  }

  return context;
}

export { CountdownProvider, useCountdown }