import { useChallenges } from '../contexts/ChallengesContext'
import styles from '../styles/components/LevelUpModal.module.css'

export function LevelUpModal() {
  const { level, levelMax, closeLevelUpModal } = useChallenges();

  return (
    <div className={styles.overlay}>
      <div className={styles.closeBackground} onClick={closeLevelUpModal}></div>

      <div className={styles.container}>
        <header>{level}</header>      

        <strong>Parabéns</strong>
        <p>Você Alcançou {level >= levelMax ? "o ultimo level!" : "um novo level." }</p>

        <button type="button" onClick={closeLevelUpModal}>
          <img src="/icons/close.svg" alt="Fechar Modal" />
        </button>
      </div>
    </div>
  )
}