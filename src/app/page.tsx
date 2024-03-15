'use client'

import { useState, useEffect } from 'react'
import styles from "./page.module.css";

export default function Home() {

  const [countries, setCountries] = useState<{}[]>([]);
  // const [countries, setCountries] = useState<{}[] | null>(null);

  useEffect(() => {
    // if (countries.length !== 0) {
    //   return;
    // } else {
    //   fetch("https://restcountries.com/v3.1/all")
    //   .then(res => res.json())
    //   .then(res => setCountries(res))
    //   .catch(err => console.log(err)) 
    // }
// ================================
    // if (countries.length !== 0) return;
    // fetch("https://restcountries.com/v3.1/all")
    //   .then(res => res.json())
    //   .then(res => setCountries(res))
    //   .catch(err => console.log(err)) 
// ================================
    // if (countries.length !== 0) return;
    // fetchData();
// ================================
    // if (countries.length < 1) {
    //   fetchData();
    // }
// ================================
    // if (countries.length > 0) {
    //   return;
    // } else {
    //   fetchData();
    // }
// ================================
    // if (countries.length === 0) fetchData();
// ================================ 
    if (countries.length === 0) {
      fetch("https://restcountries.com/v3.1/all")
        .then(res => res.json())
        .then(res => setCountries(res))
        .catch(err => console.log(err)) 
    }
  }, [countries.length])



  console.log('%ccountries:', 'color:tomato', countries);

  // const fetchData = () => {
  //   fetch("https://restcountries.com/v3.1/all")
  //   .then(res => res.json())
  //   .then(res => setCountries(res))
  //   .catch(err => console.log(err))
  // }

  // const getData = async () => {
  //   try {
  //     const res = fetch("https://restcountries.com/v3.1/all")
  //     const data = (await res).json();
      
  //     console.log('%cdata:', 'color:tomato', data);
  //   } catch(err) {
  //     console.log('%cerror:', 'color:tomato', err)
  //   }
  // }

  return (
    <main className={styles.main}>
      {countries.length > 0 &&
        countries.map((country: { [key: string]: any}) => {
          console.log('%ccountry:', 'color:tomato', country);
          return <div>{country.name.common}</div>
        })
      }
    </main>
  );
}
