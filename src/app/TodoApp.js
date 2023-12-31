'use client'
import { Box, Container, Flex, Input, Button, Text, cookieStorageManager, StepDescription, NumberInput, NumberInputField, FormLabel, FormHelperText, FormErrorMessage, FormControl, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper } from '@chakra-ui/react';
import { useMyContext } from './context/context';
import { Heading } from '@chakra-ui/react';
import { Table, TableCaption, TableContainer, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { MdAdd, MdDelete, MdEdit } from "react-icons/md"
import { TiCancel } from "react-icons/ti";

const Home = () => {
  const { user, data, error, currentDate, yesterday, isLoading, deleteData, date, setDate, cancel, addData, dataUpdate, dataById, setProductName, setPrice, productName, price, id } = useMyContext()

  const expData = data && data.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB - dateA;
  });
  useEffect(() => {
  }, [])
  var uniqueDate = null;
  const getUniqueDate = (date) => {
    const expDate = new Date(date);
    var expFullDate = `${expDate.getFullYear()}-${expDate.getMonth()}-${expDate.getDate()}`;
    if (uniqueDate !== expFullDate) {
      uniqueDate = expFullDate
      if (currentDate.toDateString() === expDate.toDateString()) {
        return 'Today'
      }
      if (yesterday.toDateString() === expDate.toDateString()) {
        return 'Yesterday'
      }
      return uniqueDate;
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
  return (
    <>
      <Container maxW={['95%', '540px', '720px', '950px', '1200px', '1200px',]} margin={'0px auto'} px={'5px'}>
        <Flex flexDirection={'column'} gap={'15px'} pb={'50px'}>
          <Heading as='h6'>{user ? user.displayName : 'Guest'}'s expense tracker</Heading>
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
        <TableContainer>
          <Table variant='striped' colorScheme='teal'>
            <Thead>
              <Tr>
                <Th>Date</Th>
                <Th>Time</Th>
                <Th>Description</Th>
                <Th>Amount</Th>
                <Th>Action</Th>
              </Tr>
            </Thead>
            <Tbody>
              {expData && expData.map((data, index) => {
                return (
                  <Tr key={data.id}>
                    <Td>{getUniqueDate(data.date)}</Td>
                    <Td>{time(data.date)}</Td>
                    <Td>{data.productName}</Td>
                    <Td>{data.price}</Td>
                    <Td >
                      <Button leftIcon={<MdDelete />} onClick={() => deleteData(data.id)} colorScheme='red' >Delete</Button>
                      <Button leftIcon={<MdEdit />} ml={'10px'} onClick={() => dataById(data.id)} colorScheme='blue'>Edit</Button>
                    </Td>
                  </Tr>
                )
              })}
            </Tbody>
          </Table>
        </TableContainer>
      </Container>
    </>
  );
};

export default Home;
