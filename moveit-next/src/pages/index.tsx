import Head from "next/head";
import { GetServerSideProps } from 'next'

import { ChallengesProvider } from "../contexts/ChallengesContext";
import { CountdownProvider } from "../contexts/CountdownContext";

import ExperienceBar from "../components/ExperienceBar";
import { CompletedChallenges } from "../components/CompletedChallenges";
import { Profile } from "../components/Profile";
import { Countdown } from "../components/Countdown";
import { ChallengeBox } from "../components/ChallengeBox";

import styles from '../styles/pages/Home.module.css'

interface CookiesProps {
  level: number,
  currentExperience: number
  challengesCompleted: number
}

export default function Home(props: CookiesProps) {
  return (
    <ChallengesProvider 
      level={props.level}
      currentExperience={props.currentExperience}
      challengesCompleted={props.challengesCompleted}
    >
      <div className={styles.container}>
        <Head>
          <title>Move.it</title>
        </Head>

        <ExperienceBar />

        <CountdownProvider>
          <section>
            <div>
              <Profile />
              <CompletedChallenges />
              <Countdown />
            </div>

            <div>
              <ChallengeBox />
            </div>
          </section>
        </CountdownProvider>
      </div>
    </ChallengesProvider>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const cookies = ctx.req.cookies;

  const props: CookiesProps = {
    level: cookies.level ? Number(cookies.level) : 1,
    currentExperience: cookies.currentExperience ? Number(cookies.currentExperience) : 0,
    challengesCompleted: cookies.challengesCompleted ? Number(cookies.challengesCompleted) : 0,
  }

  return {
    props
  }
}