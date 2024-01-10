'use client'
import { createContext, useContext, useEffect, useState } from 'react';
import { signInWithPopup, GoogleAuthProvider, } from "firebase/auth";
import { auth } from '@/utils/firebase';

const provider = new GoogleAuthProvider();
const MyContext = createContext();

export const Context = ({ children }) => {

  const convertDate = (convertibleDate, reversedDate, time) => {
    var date = new Date(convertibleDate);
    var year = date.getFullYear();
    var twoDigitMonth = date.getMonth() + 1;
    var month = twoDigitMonth < 10 ? `0${twoDigitMonth}` : twoDigitMonth;
    var twoDigitDate = date.getDate();
    var date = twoDigitDate < 10 ? `0${twoDigitDate}` : twoDigitDate;
    var twoDigitHour = currentDate.getHours();
    var twoDigitMinute = currentDate.getMinutes();
    var hour = twoDigitHour < 10 ? `0${twoDigitHour}` : twoDigitHour;
    var minute = twoDigitMinute < 10 ? `0${twoDigitMinute}` : twoDigitMinute;

    const ddmmyyyy = `${date}-${month}-${year}`
    const reversedDateString = `${year}-${month}-${date}`;
    if (reversedDate && time) {
      return `${reversedDateString}T${hour}:${minute}`
    }
    else if (reversedDate) {
      return reversedDateString
    }
    else {
      return ddmmyyyy;
    }
  }

  var currentDate = new Date();
  const yesterday = new Date(currentDate);
  yesterday.setDate(currentDate.getDate() - 1);

  const [collectionName, setCollectionName] = useState(null)
  const [id, setId] = useState()
  const [productName, setProductName] = useState('')
  const [price, setPrice] = useState(0)
  const [error, setError] = useState('')
  const [date, setDate] = useState('')
  const [data, setData] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setDate(convertDate(currentDate, 'reversedDate', 'time'));
    if (user) {
      var fullName = user.displayName;
      fullName = fullName.split(" ")[0];
      fullName = `${fullName}'s Expenses`;
      setCollectionName(fullName);
    }
  }, [user]);

  useEffect(() => {
    if (collectionName) {
      getData();
    }
  }, [collectionName]);
  const signIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      createCollection();
    } catch (error) {
      setUser(null);
      console.log('Error:', error);
    }
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
    setData(null)
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
    if (!collectionName) {
      setError('Log in to start storing your expenses');
      setIsLoading(false);
    } else if (!date && !productName && !price) {
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
      setDate(date);

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
      setDate(date)
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
    setDate(date)
  }
  const contextValue = {
    currentDate, yesterday, error, data, date, isLoading, id, productName, price, user, cancel, setDate, deleteData, addData, dataUpdate, dataById, setProductName, setPrice, convertDate, signIn, signOut
  }

  return (
    <MyContext.Provider value={contextValue}>{children}</MyContext.Provider>
  )
}
export function useMyContext() {
  return useContext(MyContext);
}

