'use client'
import { createContext, useContext, useEffect, useState } from 'react';
import { signInWithPopup, GoogleAuthProvider, } from "firebase/auth";
import { auth } from '@/utils/firebase';

const provider = new GoogleAuthProvider();
const MyContext = createContext();

export const Context = ({ children }) => {
  const [collectionName, setCollectionName] = useState(null)
  const [id, setId] = useState()
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [date, setDate] = useState(fullDateTime)
  const [data, setData] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setDate(fullDateTime)
    if (user) {
      var fullName = user.displayName;
      fullName = fullName.split(" ")[0] + "'s Expenses ";
      console.log(fullName)
      setCollectionName(fullName);
    }
  }, [user]);

  useEffect(() => {
    if (collectionName) {
      getData();
      console.log(true);
      console.log(collectionName);
    }
  }, [collectionName]);

  var currentDate = new Date();
  const yesterday = new Date(currentDate);
  var currentyear = currentDate.getFullYear();
  var currentmonth = currentDate.getMonth() + 1;
  var currentdate = currentDate.getDate();
  var twoDigitHour = currentDate.getHours();
  var twoDigitMinute = currentDate.getMinutes();
  var currenthour = currentDate.getHours();
  var currenthour = twoDigitHour < 10 ? `0${twoDigitHour}` : twoDigitHour;
  var currentminute = twoDigitMinute < 10 ? `0${twoDigitMinute}` : twoDigitMinute;
  var fullDateTime = `${currentyear}-${currentmonth}-${currentdate}T${currenthour}:${currentminute}`
  yesterday.setDate(currentDate.getDate() - 1);
  const signIn = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        setUser(result.user);
        createCollection();
      }).catch((error) => {
        setUser(null)
        console.log('Error:', error);
        const credential = GoogleAuthProvider.credentialFromError(error);
      });
  }
  const createCollection = () => {
    if (user) {
      console.log(user.displayName)
      var collectionNameWithId = `${user.displayName}${user.uid}`
      collectionNameWithId = collectionNameWithId.replace(/\s/g, '')
      setCollectionName(collectionNameWithId)
    }
  }
  const signOut = () => {
    setUser(null);
  };
  const getData = async () => {
    let response = await fetch(`api/${collectionName}`);
    response = await response.json();
    console.log(response.date)
    setData(response.data)
    setIsLoading(false)
  }
  const deleteData = async (id) => {
    let response = await fetch(`http://localhost:3000/api/${collectionName}/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    response = await response.json();
    console.log(response)
    getData();
  }
  const addData = async () => {
    setIsLoading(true)
    const data = {
      description, price, date
    }
    let response = await fetch(`http://localhost:3000/api/${collectionName}`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    setDescription('')
    setPrice('')
    setDate(fullDateTime)
    response = await response.json();
    await getData();
  }
  const dataUpdate = async () => {
    setIsLoading(true)
    const newData = {
      description, price, date
    };

    try {
      let response = await fetch(`http://localhost:3000/api/${collectionName}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newData),
      })
      response = await response.json();
      console.log(response)
      await getData();
      setId('')
      setDescription('')
      setPrice('')
      setDate(fullDateTime)
    } catch (error) {
      console.error('Error updating data: ', error);
    }
  };
  const dataById = async (id) => {
    let response = await fetch(`http://localhost:3000/api/${collectionName}/${id}`, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    response = await response.json();
    setId(response.id);
    setDescription(response.description);
    setPrice(response.price);
    setDate(response.date)
  }
  const cancel = () => {
    setId('')
    setDescription('')
    setPrice('')
    setDate(fullDateTime)
  }
  const contextValue = {
    currentDate, yesterday, data, date, isLoading, cancel, setDate, deleteData, addData, dataUpdate, dataById, setDescription, setPrice, id, description, price, data, signIn, signOut, user
  }
  return (
    <MyContext.Provider value={contextValue}>{children}</MyContext.Provider>
  )
}
export function useMyContext() {
  return useContext(MyContext);
}

