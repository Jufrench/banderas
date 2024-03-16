'use client'

import { useDisclosure } from '@mantine/hooks';
import { Modal, Stack, Box, Tabs, TextInput, Card, Paper, Title, Image, Button } from '@mantine/core';
import { useState, useEffect, use } from 'react'

import styles from "./page.module.css";

interface QuickPlayModalProps {
  countries: {}[];
}

interface SkipButtonProps {
  handleSkipCountry: () => void;
  skipCountry: boolean;
}
const SkipButton = (props: SkipButtonProps) => {
  // const [skipCountry, setSkipCountry] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(3);

  useEffect(() => {
    if (props.skipCountry) {
      const interval = setInterval(() => {
        setCountdown(countdown - 1);
      }, 1000);
      if (countdown === 0) {
        // setSkipCountry(false);
        // props.onClick();
        setCountdown(3);
        clearInterval(interval);
      }
      return () => clearInterval(interval);
    }
  }, [props.skipCountry, countdown])

  return (
    <Button onClick={props.handleSkipCountry} w="fit-content" color="tomato" size="compact-sm">
      {props.skipCountry ? `Skipping in ${countdown}`: 'Skip'}
    </Button>
  )
}

// interface Country {
//   name: {
//     common: string;
//   };
//   flag: string;
//   flags: {
//     png: string;
//     svg: string;
//   }
// }
type Country = {
  name: {
    common: string;
  },
  flag: string,
  flags: {
    png: string;
    svg: string;
  }
}

function QuickPlayModal(props: QuickPlayModalProps): JSX.Element {
  const [opened, { open, close }] = useDisclosure(true);

  // const randonCountry = (props.countries[Math.floor(Math.random() * 250)] as Country);
  // const [activeCountry, setActiveCountry] = useState<string | null>(randonCountry.name.common);
  const [activeCountry, setActiveCountry] = useState<{} | null>((props.countries[Math.floor(Math.random() * 250)] as Country));
  const [skipCountry, setSkipCountry] = useState<boolean>(false);

  console.group('%c    ', 'background: white')
  // console.log('props.countries:', (props.countries[Math.floor(Math.random() * 250)] as Country).name.common);
  // console.log('randonCountry:', randonCountry.name.common);
  console.log('activeCountry:', activeCountry);
  console.groupEnd()

  useEffect(() => {
    if (skipCountry) {
      const newRandonCountry = (props.countries[Math.floor(Math.random() * 250)] as Country);
      setActiveCountry(newRandonCountry);
      setSkipCountry(false);
    }
  }, [skipCountry])

  const handleSkipCountry = () => {
    console.log('%chandleSkipCountry', 'color:gold')
    setSkipCountry(prevState => !prevState);
  }

  return (
    <Modal opened={opened} onClose={close} title="Quick Play" centered>
      <Stack>
        <Box>What country is this?</Box>
        {activeCountry && <Box><img src={`${(activeCountry as Country).flags.png}`} /></Box>}
        <Box>{}</Box>
        <TextInput
          aria-label="Country name"
          // description="Type /skip to skip"
          placeholder="Country name" size="lg"
          onChange={() => {
            // console.log('value:', value)
          }}/>
        <SkipButton handleSkipCountry={handleSkipCountry} skipCountry={false} />
      </Stack>
    </Modal>
  )
}

interface WelcomeModalProps {
  handleSetIsQuickPlay: (value: boolean) => void;
}

function WelcomeModal(props: WelcomeModalProps): JSX.Element {
  const [opened, { open, close }] = useDisclosure(true);

  return (
    <Modal opened={opened} onClose={close} title="Welcome to Banderas!" centered>
      <Tabs style={{border: '1px solid tomato'}} orientation="vertical" defaultValue="welcome">
        <Tabs.List>
          <Tabs.Tab value="welcome">
            Welcome
          </Tabs.Tab>
          <Tabs.Tab value="quick play">
            Quick Play
          </Tabs.Tab>
          <Tabs.Tab value="rapid">
            Rapid
          </Tabs.Tab>
          <Tabs.Tab value="explore">
            Explore
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="welcome">
          Banderas is a game where you guess the country based on its flag.
        </Tabs.Panel>

        <Tabs.Panel value="quick play">
          <Button onClick={() => {
            props.handleSetIsQuickPlay(true);
            close();
            }}>
            Quick Play
          </Button>
        </Tabs.Panel>

        <Tabs.Panel value="rapid">
          Rapid!
        </Tabs.Panel>

        <Tabs.Panel value="explore">
          {/* <Button onClick={() => {
            props.handleSetIsQuickPlay(true);
            close();
            }}> */}
            Explore
          {/* </Button> */}
        </Tabs.Panel>
          
      </Tabs>
    </Modal>
  )
}

export default function Home(): JSX.Element {

  const [countries, setCountries] = useState<{}[]>([]);
  const [isQuickPlay, setIsQuickPlay] = useState<boolean>(false);

  const handleSetIsQuickPlay = () => {
    setIsQuickPlay(true);
  }

  useEffect(() => {
    if (countries.length === 0) {
      console.log('fetching countries')
      fetch("https://restcountries.com/v3.1/all")
        .then(res => res.json())
        .then(res => setCountries(res))
        .catch(err => console.log(err)) 
    }
  }, [countries.length])

  console.log('%ccountries:', 'color:tomato', countries);

  // window.scrollTo(0, document.body.scrollHeight);
  // window.scroll({top: document.body.scrollHeight, behavior: "smooth"});

  return (
    <>
      <WelcomeModal handleSetIsQuickPlay={handleSetIsQuickPlay} />
      {isQuickPlay && <QuickPlayModal countries={countries} />}
      <main className={styles.main}>
        <ul
          style={{
            margin: 0, listStyleType: 'none', display: 'flex', flexWrap: 'wrap', gap: 40,
            // opacity: 0.7,
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
          }}>
          {countries.length > 0 &&
            countries.map((country: { [key: string]: any}, index) => {
              return (
                <li key={index}>
                  {/* <Paper
                    style={{
                      padding: '1.25rem'
                    }}>
                    <Title order={5}>{country.name.common}</Title>
                  </Paper> */}
                  <Image w={100} h={50} src={country.flags.png} />
                </li>
              )
            })
          }
        </ul>
      </main>
    </>
  );
}
