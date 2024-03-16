'use client'

import { useDisclosure } from '@mantine/hooks';
import { rem, Modal, Stack, Box, Tabs, Group, TextInput, Notification, Card, Paper, Title, Image, Button } from '@mantine/core';
import { IconX, IconCheck } from '@tabler/icons-react';

import { useState, useEffect } from 'react'

import styles from "./page.module.css";

interface SkipButtonProps {
  handleSkipCountry: () => void;
}
const SkipButton = (props: SkipButtonProps) => {
  const [countdown, setCountdown] = useState<number>(3);
  const [startCountdown, setStartCountdown] = useState<boolean>(false);

  useEffect(() => {
    if (startCountdown) {
      const interval = setInterval(() => {
        setCountdown(countdown - 1);
      }, 1000);
      if (countdown === 0) {
        setCountdown(3);
        clearInterval(interval);
        setStartCountdown(false);
        props.handleSkipCountry();
      }
      return () => clearInterval(interval);
    }
  }, [startCountdown, countdown])

  return (
    <Button onClick={() => setStartCountdown(true)} w="fit-content" color="#c91a25" size="compact-sm" variant="light">
      {startCountdown ? `Skipping in ${countdown}`: 'Skip'}
    </Button>
  )
}

const NotificationComponent = (props: {isCorrect: boolean | null, handleCloseNotification: () => void}): JSX.Element => {
  return (
    <>
    {props.isCorrect ?
      <Notification
        withBorder
        color="teal"
        style={{borderColor: "#339999", background: "rgba(51, 153, 153, 0.3)"}}
        icon={<IconCheck style={{ width: rem(20), height: rem(20) }} />}
        onClose={() => props.handleCloseNotification()}>
        Correct!
      </Notification>
      :
      <Notification
        withBorder
        color="red"
        style={{borderColor: "#c91a25", background: "rgba(201, 26, 37, 0.3)"}}
        icon={<IconX style={{ width: rem(20), height: rem(20) }} />}
        onClose={() => props.handleCloseNotification()}>
          Incorrect!
      </Notification>}
    </>
  )
}

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

function QuickPlayModal(props: {countries: {}[]}): JSX.Element {
  const [opened, { open, close }] = useDisclosure(true);

  const [activeCountry, setActiveCountry] = useState<{} | null>((props.countries[Math.floor(Math.random() * 250)] as Country));
  const [getNewCountry, setGetNewCountry] = useState<boolean>(false);
  const [value, setValue] = useState<string>('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  useEffect(() => {
    if (getNewCountry) {
      const newRandonCountry = (props.countries[Math.floor(Math.random() * 250)] as Country);
      setActiveCountry(newRandonCountry);
      setGetNewCountry(false);
    }
  }, [getNewCountry])

  const handleGetNewCountry = () => {
    setGetNewCountry(prevState => !prevState);
  }

  const handleSubmitAnswer = (value: string) => {
    if (value.toLowerCase() === (activeCountry as Country).name.common.toLowerCase()) {
      console.log('Correct!')
      setIsCorrect(true);
    } else {
      console.log('Incorrect!')
      setIsCorrect(false);
    }

    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
      handleGetNewCountry();
      setValue('');
    }, 2500)
  }

  const handleCloseNotification = () => {
    setShowNotification(false);
  }

  const [showNotification, setShowNotification] = useState<boolean>(false);

  return (
    <Modal opened={opened} onClose={close} title="Quick Play" centered>
      <Stack>
        <Box>What country is this?</Box>
        {activeCountry && <Box><img style={{width:"100%"}}src={`${(activeCountry as Country).flags.png}`} /></Box>}
        <Stack>
          {showNotification && <NotificationComponent isCorrect={isCorrect} handleCloseNotification={handleCloseNotification} />}
          <TextInput
            aria-label="Country name"
            placeholder="Country name" size="lg"
            value={value}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => setValue(event.target.value)}
            style={{flexGrow: 1}} />
          <Button color="teal" style={{color:"#fff"}} onClick={() => handleSubmitAnswer(value)}>Submit</Button>
        </Stack>
        <SkipButton handleSkipCountry={handleGetNewCountry} />
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
      <Tabs style={{color: "#000", display: "flex", justifyContent: "center", alignItems: "center"}} orientation="vertical" defaultValue="welcome">
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

        <Tabs.Panel value="welcome" style={{ padding: "20px"}}>
          Banderas is a game where you guess the country based on its flag.
        </Tabs.Panel>

        <Tabs.Panel value="quick play" style={{ padding: "20px"}}>
          <Button onClick={() => {
            props.handleSetIsQuickPlay(true);
            close();
            }}>
            Quick Play
          </Button>
        </Tabs.Panel>

        <Tabs.Panel value="rapid" style={{ padding: "20px"}}>
          Rapid!
        </Tabs.Panel>

        <Tabs.Panel value="explore" style={{ padding: "20px"}}>
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
      // console.log('fetching countries')
      fetch("https://restcountries.com/v3.1/all")
        .then(res => res.json())
        .then(res => setCountries(res))
        .catch(err => console.log(err)) 
    }
  }, [countries.length])

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
