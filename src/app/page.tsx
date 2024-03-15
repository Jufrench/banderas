'use client'

import { useDisclosure } from '@mantine/hooks';
import { Modal, Card, Paper, Title, Image, Button } from '@mantine/core';
import { useState, useEffect } from 'react'

import styles from "./page.module.css";

export default function Home() {

  const [countries, setCountries] = useState<{}[]>([]);

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
  const [opened, { open, close }] = useDisclosure(true);

  return (
    <>
      <Modal className='julian' opened={opened} onClose={close} title="Welcome to Banderas!" centered>
        <Button>Quick Play</Button>
      </Modal>
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
