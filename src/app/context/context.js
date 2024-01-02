'use client'
import { createContext, useContext, useEffect, useState } from 'react';
import { signInWithPopup, GoogleAuthProvider, } from "firebase/auth";
import { auth } from '@/utils/firebase';

const provider = new GoogleAuthProvider();
const MyContext = createContext();

export const Context = ({ children }) => {
  var currentDate = new Date();
  const yesterday = new Date(currentDate);
  var currentyear = currentDate.getFullYear();
  var twoDigitMonth = currentDate.getMonth() + 1;
  var currentmonth = twoDigitMonth < 10 ? `0${twoDigitMonth}` : twoDigitMonth;
  var twoDigitDate = currentDate.getDate();
  var currentdate = twoDigitDate < 10 ? `0${twoDigitDate}` : twoDigitDate;
  var twoDigitHour = currentDate.getHours();
  var twoDigitMinute = currentDate.getMinutes();
  var currenthour = currentDate.getHours();
  var currenthour = twoDigitHour < 10 ? `0${twoDigitHour}` : twoDigitHour;
  var currentminute = twoDigitMinute < 10 ? `0${twoDigitMinute}` : twoDigitMinute;
  var fullDateTime = `${currentyear}-${currentmonth}-${currentdate}T${currenthour}:${currentminute}`

  const [collectionName, setCollectionName] = useState(null)
  const [id, setId] = useState()
  const [productName, setProductName] = useState('')
  const [price, setPrice] = useState(0)
  const [error, setError] = useState('')
  const [date, setDate] = useState(fullDateTime)
  const [data, setData] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setDate(fullDateTime)
    if (user) {
      var fullName = user.displayName;
      fullName = fullName.split(" ")[0];
      fullName = `${fullName}'s Expenses`;
      setCollectionName(fullName);
    }
  }, [user]);

  useEffect(() => {
    if (collectionName) {
      console.log(true);
      getData();
    }
  }, [collectionName]);
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
    setData(response.data)
    setIsLoading(false)
  }
  const deleteData = async (id) => {
    let response = await fetch(`api/${collectionName}/${id}`, {
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
    setIsLoading(true);
    const data = {
      productName,
      price: parseFloat(price),
      date,
    };

    if (!date && !productName && !price) {
      setError('Please enter Date, Product Name, and Product Price');
      setIsLoading(false);
    } else if (!date && !productName) {
      setError('Please enter Date and Product Name');
      setIsLoading(false);
    } else if (!date && !price) {
      setError('Please enter Date and Product Price');
      setIsLoading(false);
    } else if (!productName && !price) {
      setError('Please enter Product Name and Product Price');
      setIsLoading(false);
    } else if (!date) {
      setError('Please select a date');
      setIsLoading(false);
    } else if (!productName) {
      setError('Please enter a Product Name');
      setIsLoading(false);
    } else if (!price) {
      setError('Please enter a Product Price');
      setIsLoading(false);
    } else {
      setError(false);
      let response = await fetch(`api/${collectionName}`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      setProductName('');
      setPrice(0);
      setDate(fullDateTime);

      response = await response.json();
      await getData();
    }
  };

  const dataUpdate = async () => {
    setIsLoading(true)
    const newData = {
      productName, price, date
    };

    try {
      let response = await fetch(`api/${collectionName}/${id}`, {
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
      setProductName('')
      setPrice('')
      setDate(fullDateTime)
    } catch (error) {
      console.error('Error updating data: ', error);
    }
  };
  const dataById = async (id) => {
    let response = await fetch(`api/${collectionName}/${id}`, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    response = await response.json();
    console.log(response)
    setId(response.id);
    setProductName(response.productName);
    setPrice(response.price);
    setDate(response.date)
  }
  const cancel = () => {
    setId('')
    setProductName('')
    setPrice('')
    setDate(fullDateTime)
  }
  const contextValue = {
    currentDate, yesterday, error, data, date, isLoading, cancel, setDate, deleteData, addData, dataUpdate, dataById, setProductName, setPrice, id, productName, price, data, signIn, signOut, user
  }
  return (
    <MyContext.Provider value={contextValue}>{children}</MyContext.Provider>
  )
}
export function useMyContext() {
  return useContext(MyContext);
}

