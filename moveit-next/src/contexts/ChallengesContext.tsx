import { createContext, FC, ReactNode, useCallback, useContext, useState } from 'react'
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
  levelUp(): void;
  experienceToNextLevel: number;
  currentExperience: number;
  challengesCompleted: number;
  activeChallange: Challange;
  startNewChallenge(): void;
  resetChallenge(): void;
}

const ChallengesContext = createContext<ChallengContextData>({} as ChallengContextData)

const ChallengesProvider: FC<ChallengesProviderProps> = ({ children }) => {
  const [level, setLevel] = useState(1);
  const [currentExperience, setCurrentExperience] = useState(0);
  const [challengesCompleted, setChallengesCompleted] = useState(0);
  const [activeChallange, setActiveChallange] = useState(null);

  const experienceToNextLevel = Math.pow(((level + 1) * 4), 2);

  const levelUp = useCallback(() => {
    setLevel(level + 1);
  }, [level])

  const startNewChallenge = useCallback(() => {
    const randomChallengeIndex = Math.floor(Math.random() * challenges.length);

    const challenge = challenges[randomChallengeIndex];

    setActiveChallange(challenge)
  }, [challenges])

  const resetChallenge = useCallback(() => {
    setActiveChallange(null);
  }, [])

  return (
    <ChallengesContext.Provider value={{
      level,
      levelUp,
      experienceToNextLevel,
      currentExperience,
      challengesCompleted,
      activeChallange,
      startNewChallenge,
      resetChallenge
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
