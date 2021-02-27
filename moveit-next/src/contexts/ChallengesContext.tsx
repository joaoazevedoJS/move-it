import { createContext, FC, ReactNode, useCallback, useContext, useEffect, useState } from 'react'
import Cookies from 'js-cookie';

import challenges from '../../challenges.json'
import { LevelUpModal } from '../components/LevelUpModal';
import oauthGithub from '../services/oauthGithub';

interface ChallengesProviderProps {
  children: ReactNode;
  level: number,
  currentExperience: number
  challengesCompleted: number
  env: string
}

interface Challange {
  type: 'body' | 'eye';
  description: string;
  amount: number;
}

interface ChallengContextData {
  level: number;
  levelMax: number;
  experienceToNextLevel: number;
  currentExperience: number;
  challengesCompleted: number;
  activeChallange: Challange;
  addExperience(experience: number): void;
  startNewChallenge(): void;
  resetChallenge(): void;
  completeChallenge(): void;
  closeLevelUpModal(): void;
}

const ChallengesContext = createContext<ChallengContextData>({} as ChallengContextData)

const ChallengesProvider: FC<ChallengesProviderProps> = ({ children, ...rest }) => {
  const [level, setLevel] = useState(rest.level ?? 1);
  const [currentExperience, setCurrentExperience] = useState(rest.currentExperience ?? 0);
  const [challengesCompleted, setChallengesCompleted] = useState(rest.challengesCompleted ?? 0);
  
  const [activeChallange, setActiveChallange] = useState<Challange | null>(null);
  const [isLevelUpModalOpen, setIsLevelUpModalOpen] = useState(false);  
  
  const experienceToNextLevel = Math.pow(((level + 1) * 4), 2);
  const levelMax = 80;

  useEffect(() => {
    Notification.requestPermission();
  }, [])

  useEffect(() => {
    Cookies.set('level', String(level));
    Cookies.set('currentExperience', String(currentExperience));
    Cookies.set('challengesCompleted', String(challengesCompleted));
  }, [level, currentExperience, challengesCompleted])

  useEffect(() => {
    if(level < levelMax) {
      let finalExperience = currentExperience;

      if (finalExperience >= experienceToNextLevel) {
        finalExperience = finalExperience - experienceToNextLevel;

        levelUp();
      }

      addExperience(finalExperience);
    }
  }, [currentExperience])

  const addExperience = useCallback((experience: number) => {
    setTimeout(() => {
      setCurrentExperience(experience);
    }, 10)
  }, [currentExperience])

  const levelUp = useCallback(() => {
    setTimeout(() => {
      if(level < levelMax) {
        setLevel(level + 1);

        setIsLevelUpModalOpen(true);
      }
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

    if (Notification.permission === 'granted') {
      new Notification("Novo Desafio 🎉", {
        body: `Valendo ${challenge.amount}xp!`
      })
    }
  }, [activeChallange])

  const completeChallenge = useCallback(() => {
    if (!activeChallange) {
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

  const closeLevelUpModal = useCallback(async () => {
    setIsLevelUpModalOpen(false);
    
    console.log(rest.env)

    const res = await oauthGithub.get('/authorize', {
      params: { 
        login: 'joaoazevedojs',
        client_id: rest.env
      }
    })
    
    console.log(res)
  }, [])

  return (
    <ChallengesContext.Provider value={{
      level,
      levelMax,
      experienceToNextLevel,
      currentExperience,
      challengesCompleted,
      activeChallange,
      addExperience,
      startNewChallenge,
      resetChallenge,
      completeChallenge,
      closeLevelUpModal
    }}>
      {children}

      {
        isLevelUpModalOpen && <LevelUpModal />
      }
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
