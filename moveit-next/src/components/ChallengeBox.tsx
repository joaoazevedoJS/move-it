import { useContext } from 'react';

import { useChallenges } from '../contexts/ChallengesContext';

import styles from '../styles/components/ChallengeBox.module.css'

export function ChallengeBox() {
  const { activeChallange, resetChallenge } = useChallenges();

  return (
    <div className={styles.challengeBoxContainer}>
      {
        activeChallange ? (
          <div className={styles.challengeActive}>
            <header>Ganhe {activeChallange.amount} xp</header>

            <main>
              {
                activeChallange.type === "body" ? (
                  <img src="icons/body.svg" alt="body" />
                ) : (
                  <img src="icons/eye.svg" alt="body" />
                )
              }
              
              <strong>Novo desafio</strong>
            
              <p>{activeChallange.description}</p>
            </main>

            <footer>
              <button type="button" onClick={resetChallenge} className={styles.challengFaildButton}>Falhei</button>
              <button type="button" className={styles.challengSucceededButton}>Completei</button>
            </footer>
          </div>
        ) : (
            <div className={styles.challengeNotActive}>
              <strong>Finalize um ciclo para receber um desafio</strong>

              <p>
                <img src="icons/level-up.svg" alt="Level Up" />
                Avance de level completando desafios.
              </p>
            </div>
          )
      }
    </div >
  )
}