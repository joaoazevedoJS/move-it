import { createContext, FC, ReactNode, useCallback, useContext, useEffect, useState } from 'react'
import challenges from '../../challenges.json'

interface ChallengesProviderProps {
  children: ReactNode;
}

interface Challange {
  type: 'body' | 'eye';
  description: string;
  amount: number;
}

interface ChallengContextData {
  level: number;
  experienceToNextLevel: number;
  currentExperience: number;
  challengesCompleted: number;
  activeChallange: Challange;
  addExperience(experience: number): void;
  startNewChallenge(): void;
  resetChallenge(): void;
  completeChallenge(): void;
}

const ChallengesContext = createContext<ChallengContextData>({} as ChallengContextData)

const ChallengesProvider: FC<ChallengesProviderProps> = ({ children }) => {
  const [level, setLevel] = useState(1);
  const [currentExperience, setCurrentExperience] = useState(0);
  const [challengesCompleted, setChallengesCompleted] = useState(0);
  const [activeChallange, setActiveChallange] = useState<Challange | null>(null);

  const experienceToNextLevel = Math.pow(((level + 1) * 4), 2);

  useEffect(() => {
    Notification.requestPermission();
  }, [])

  useEffect(() => {
    let finalExperience = currentExperience;

    if(finalExperience >= experienceToNextLevel) {
      finalExperience = finalExperience - experienceToNextLevel;  

      levelUp();
    }

    addExperience(finalExperience);
  }, [currentExperience])

  const addExperience = useCallback((experience: number) => {
    setTimeout(() => {
      setCurrentExperience(experience);
    }, 10)
  }, [currentExperience])

  const levelUp = useCallback(() => {
    setTimeout(() => {
      setLevel(level + 1);
    }, 25);
  }, [level])

  const startNewChallenge = useCallback(() => {
    const randomChallengeIndex = Math.floor(Math.random() * challenges.length);

    const challengeJson = challenges[randomChallengeIndex];

    const challenge: Challange = {
      ...challengeJson,
      type: challengeJson.type == 'body' ? "body" : "eye"
    }
 
    setActiveChallange(challenge);
  
    new Audio('/notification.mp3').play();

    if(Notification.permission === 'granted') {
      new Notification("Novo Desafio 🎉", {
        body: `Valendo ${challenge.amount}xp!`
      })
    }
  }, [activeChallange])
  
  const completeChallenge = useCallback(() => {
    if(!activeChallange) {
      return;
    }

    const { amount } = activeChallange;

    const experience = currentExperience + amount;
    
    addExperience(experience)
    setActiveChallange(null);
    setChallengesCompleted(challengesCompleted + 1);
  }, [activeChallange, currentExperience, experienceToNextLevel])

  const resetChallenge = useCallback(() => {
    setActiveChallange(null);
  }, [])

  return (
    <ChallengesContext.Provider value={{
      level,
      experienceToNextLevel,
      currentExperience,
      challengesCompleted,
      activeChallange,
      addExperience,
      startNewChallenge,
      resetChallenge,
      completeChallenge
    }}>
      {children}
    </ChallengesContext.Provider>
  )
}

function useChallenges(): ChallengContextData {
  const context = useContext(ChallengesContext);

  if (!context) {
    throw new Error('useChallenges must be used within an ChallengesProvider');
  }

  return context;
}

export { ChallengesProvider, useChallenges };
