'use client'
import { Box, Container, Flex, Input, Button, Text, cookieStorageManager, StepDescription, NumberInput, NumberInputField, FormLabel, FormHelperText, FormErrorMessage, FormControl, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, Toast } from '@chakra-ui/react';
import { useMyContext } from './context/context';
import { Heading } from '@chakra-ui/react';
import { Table, TableCaption, TableContainer, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { MdAdd, MdDelete, MdEdit } from "react-icons/md"
import { TiCancel } from "react-icons/ti";

const Home = () => {
  const { user, data, error, currentDate, yesterday, isLoading, deleteData, date, setDate, cancel, addData, dataUpdate, dataById, setProductName, convertDate, setPrice, productName, price, id } = useMyContext()

  // const dataString = JSON.stringify(data);
  // localStorage.setItem('myData', dataString);

  const storedDataString = localStorage.getItem('myData');
  const storedData = JSON.parse(storedDataString);

  const expData = storedData && storedData.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB - dateA;
  });
  useEffect(() => {
  }, [])
  var uniqueDate = null;
  var uniqueWeekDate = null;

  const getUniqueDate = (date) => {
    const expDate = new Date(date);
    var expFullDate = convertDate(date);
    console.log(expFullDate)

    var revexpFullDate = convertDate(date, 'yyyy-mm-dd');
    if (uniqueDate !== expFullDate) {
      uniqueDate = expFullDate

      console.log(uniqueDate)
      var Total = dailyTotal[uniqueDate]
      if (currentDate.toDateString() === expDate.toDateString()) {
        return <Flex flexDirection={'column'}>
          <Box w={'100%'} p={'10px '} color={'#fff'} background={'#4299e1'}>
            <Text as={'h6'} fontWeight={'600'}>{Total ? `Total of Today's expenses : Rs ${Total}` : `Today`}</Text>
          </Box></Flex>
      }
      if (yesterday.toDateString() === expDate.toDateString()) {
        return <Flex flexDirection={'column'}>
          <Box w={'100%'} p={'10px '} color={'#fff'} background={'#4299e1'}>
            <Text as={'h6'} fontWeight={'600'}>{Total ? `Total of Yesterday's expenses : Rs ${Total}` : `Yesterday`}</Text>
          </Box>
        </Flex>
      }

      return <Flex flexDirection={'column'}><Box w={'100%'} p={'10px '} color={'#fff'} background={'#4299e1'}>
        <Text as={'h6'} fontWeight={'600'}>{Total ? `Total of  ${uniqueDate} expenses : Rs ${Total}` : `${uniqueDate}`}</Text>
      </Box> </Flex>
    }
  }
  const weekTotal = (date) => {
    var expDate = new Date(date)
    var dayOfWeek = expDate.getDay()
    var weekStartDate = new Date(date)
    var expdate = expDate.getDate() - dayOfWeek;
    weekStartDate.setDate(expdate)
    expdate = expDate.getDate() + 6;
    var weekEndDate = new Date(date)
    expdate = expDate.getDate() - dayOfWeek + 6;
    weekEndDate.setDate(expdate)
    var day = currentDate - weekStartDate
    var startDate = convertDate(weekStartDate)
    var endDate = convertDate(weekEndDate)
    console.log(startDate)
    console.log(endDate)
    var dayDifference = Math.ceil(day / (1000 * 60 * 60 * 24))
    var revexpFullDate = convertDate(date, 'yyyy-mm-dd');
    console.log(revexpFullDate)

    if (uniqueWeekDate !== weekStartDate) {
      uniqueWeekDate = weekStartDate
      if (dayDifference < 7) {
        console.log('currentWeek')
        return <Flex flexDirection={'column'}>
          {weeklyTotal[revexpFullDate] ? <Box w={'100%'} p={'10px '} color={'#fff'} background={'#3182CE'}>
            <Text as={'h6'} fontWeight={'600'}>This Week's Total expenses : Rs {weeklyTotal[revexpFullDate]}</Text>
          </Box> : ''}
        </Flex>
      }
      if (dayDifference < 13) {
        console.log('lastWeek')
        return <Flex flexDirection={'column'}>
          {weeklyTotal[revexpFullDate] ? <Box w={'100%'} p={'10px '} color={'#fff'} background={'#3182CE'}>
            <Text as={'h6'} fontWeight={'600'}>Last Week's Total expenses : Rs {weeklyTotal[revexpFullDate]}</Text>
          </Box> : ''}
        </Flex>
      }
      return <Flex flexDirection={'column'}>
        {weeklyTotal[revexpFullDate] ? <Box w={'100%'} p={'10px '} color={'#fff'} background={'#3182CE'}>
          <Text as={'h6'} fontWeight={'600'}>{startDate} To {endDate} : Rs {weeklyTotal[revexpFullDate]}</Text>
        </Box> : ''}
      </Flex>
    }
    if (revexpFullDate) {
    }
    if (uniqueDate) {

      console.log('working')
    }
  }
  const time = (date) => {
    const expDate = new Date(date);
    var hour = expDate.getHours();
    const minute = expDate.getMinutes();
    var timeDifference = Math.floor((currentDate - expDate) / 60000);
    if (timeDifference < 1) {
      return 'Just Now'
    } else if (timeDifference < 60) {
      return `${timeDifference}min ago`
    } else {
      if (hour > 12) {
        hour = hour - 12
        return `${hour}:${minute} PM`
      }
      return `${hour}:${minute} AM`
    }
  }
  const groupExpensesByWeek = (expenses) => {
    const groupedExpenses = {};
    expenses.forEach((expense) => {
      const expenseDate = new Date(expense.date);
      const dayOfWeek = expenseDate.getDay();
      const weekStartDate = new Date(expenseDate);
      weekStartDate.setDate(expenseDate.getDate() - dayOfWeek);
      const weekStartDateString = weekStartDate.toISOString().split('T')[0];
      if (!groupedExpenses[weekStartDateString]) {
        groupedExpenses[weekStartDateString] = [];
      }
      groupedExpenses[weekStartDateString].push(expense);
    });
    return groupedExpenses;
  };
  const calculateWeeklyTotal = (groupedExpenses) => {
    const weeklyTotal = {};
    for (const weekStartDate in groupedExpenses) {
      const expensesInWeek = groupedExpenses[weekStartDate];
      const total = expensesInWeek.reduce((acc, expense) => acc + parseFloat(expense.price), 0);
      weeklyTotal[weekStartDate] = total.toFixed(2);
    }
    return weeklyTotal;
  };
  const groupExpensesByDay = (expenses) => {
    const dayExpenses = {};

    expenses.forEach((expense) => {
      const weekStartDayString = convertDate(expense.date);
      if (!dayExpenses[weekStartDayString]) {
        dayExpenses[weekStartDayString] = [];
      }

      dayExpenses[weekStartDayString].push(expense);
    });

    return dayExpenses;
  };
  const calculateDailyTotal = (groupedExpenses) => {
    const dailyTotal = {};
    for (const weekDays in groupedExpenses) {
      const dayexpensesInWeek = groupedExpenses[weekDays];
      if (dayexpensesInWeek.length > 2) {
        const total = dayexpensesInWeek.reduce((acc, expense) => acc + parseFloat(expense.price), 0);
        dailyTotal[weekDays] = total.toFixed(2);
      }
    }
    return dailyTotal;
  };
  const groupedExpenses = expData && groupExpensesByWeek(expData);
  const weeklyTotal = calculateWeeklyTotal(groupedExpenses);
  const weeklygroupedExpenses = expData && groupExpensesByDay(expData);
  const dailyTotal = calculateDailyTotal(weeklygroupedExpenses);

  return (
    <>
      <Container maxW={['95%', '540px', '650px', '650px', '650px', '650px',]} margin={'0px auto'} px={'5px'}>
        <Flex flexDirection={'column'} gap={'15px'} pb={'50px'}>
          <Heading as='h6'>{user ? user.displayName.split(" ")[0] : 'Guest'}'s expenses</Heading>
          <Box>
            <FormLabel htmlFor='date'>Select Date</FormLabel>
            <Input id='date' value={date} onChange={(e) => setDate(e.target.value)} placeholder="Select Date and Time" type="datetime-local" variant='filled' required />
            <Text> <Text as={'span'} color={'red'}>Note: </Text> Not selecting the date and time will select the current date and time</Text>
          </Box>
          <Box>
            <FormLabel htmlFor='product'>Enter Product Name</FormLabel>
            <Input id='product' value={productName} onChange={(e) => setProductName(e.target.value)} variant='filled' />
          </Box>
          <Box>
            <FormLabel htmlFor='price'>Enter Price</FormLabel>
            <NumberInput id='price' min={0} max={10000} clampValueOnBlur={false} value={price} onChange={(valueString) => setPrice(valueString)} variant='filled' >
              <NumberInputField />
            </NumberInput>
          </Box>
          <Text color={'red'}>{error}</Text>
          <Flex gap={'10px'}>
            <Button leftIcon={<MdAdd />} isLoading={isLoading} loadingText={id ? 'Updating' : 'Adding'} flexGrow={1} onClick={id ? dataUpdate : addData} colorScheme='blue' >{id ? 'Update' : 'Add'}</Button>
            <Button leftIcon={<TiCancel />} flexGrow={1} onClick={cancel} colorScheme='blue' variant='outline' isDisabled={id || productName ? false : true}>Cancel</Button>
          </Flex>
        </Flex>
        <Flex flexDirection={'column'} overflowX={'scroll'}>
          {expData && expData.map((data, index) => {
            const onetimedate = getUniqueDate(data.date)
            return (
              <Flex flexWrap={'wrap'} flexDirection={'column'} key={data.id} overflowX={'scroll'} width={'650px'}
                backgroundColor={index % 2 == 1 ? 'white' : '#B2F5EA'}>
                {onetimedate ? weekTotal(data.date) : ''}
                {onetimedate}
                <Flex gap={'0px'} justifyContent={'space-between'} alignItems={'center'} p={'10px'}>
                  <Box w={'120px'} >
                    <Text as={'h6'} fontWeight={'500'}>{time(data.date)}</Text>
                  </Box>
                  <Box w={'200px'} >
                    <Text as={'h6'} fontWeight={'500'}>{data.productName}</Text>
                  </Box>
                  <Box w={'80px'} >
                    <Text as={'h6'} fontWeight={'500'}>{data.price}</Text>
                  </Box>
                  <Flex flexWrap={'wrap'} gap={'10px'} w={'auto'} >
                    <Button p={'10px'} leftIcon={<MdDelete />} onClick={() => deleteData(data.id)} colorScheme='red' >Delete</Button>
                    <Button p={'10px'} leftIcon={<MdEdit />} onClick={() => dataById(data.id)} colorScheme='blue'>Edit</Button>
                  </Flex>
                </Flex>
              </Flex>
            )
          })}
        </Flex>
      </Container>
    </>
  );
};

export default Home;
