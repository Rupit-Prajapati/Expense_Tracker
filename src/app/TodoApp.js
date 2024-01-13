'use client'
import { Box, Heading, Container, Flex, Input, Button, Text, NumberInput, NumberInputField, FormLabel } from '@chakra-ui/react';
import { useMyContext } from './context/context';
import { MdAdd, MdDelete, MdEdit } from "react-icons/md"
import { TiCancel } from "react-icons/ti";

const Home = () => {
  const { user, data, error, currentDate, yesterday, isLoading, deleteData, date, setDate, cancel, addData, dataUpdate, dataById, setProductName, convertDate, setPrice, productName, price, id } = useMyContext()

  const expData = data && data.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB - dateA;
  });
  var uniqueDate = null;

  const time = (date) => {
    const expDate = new Date(date);
    let hour = expDate.getHours();
    const minute = expDate.getMinutes();
    const timeDifference = Math.floor((currentDate - expDate) / 60000);

    if (timeDifference < 1) {
      return 'Just Now';
    } else if (timeDifference < 60) {
      return `${timeDifference}min ago`;
    } else {
      if (hour > 12) {
        hour -= 12;
        return `${hour}:${minute} PM`;
      }
      return `${hour}:${minute} AM`;
    }
  };
  const getMonthDifference = (expDate, currentDate) => {
    const expYear = expDate.getFullYear();
    const expMonth = expDate.getMonth();

    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    var monthDifference = (currentYear - expYear) * 12 + (currentMonth - expMonth);
    var year = Math.floor(monthDifference / 12);
    var month = monthDifference % 12;
    return { "year": year, "month": month };
  };
  const groupExpensesByMonth = (expenses) => {
    const groupedExpensesByWeek = {};
    expenses.forEach((expense) => {
      const endDateOfMonth = (date) => {
        const lastDate = new Date(date.getFullYear(), date.getMonth() + 1, 1);
        lastDate.setDate(lastDate.getDate() - 1)
        var lastDateString = convertDate(lastDate)
        return lastDateString;
      };
      const expenseDate = new Date(expense.date);
      const endMonthDate = endDateOfMonth(expenseDate);
      if (!groupedExpensesByWeek[endMonthDate]) {
        groupedExpensesByWeek[endMonthDate] = [];
      }
      groupedExpensesByWeek[endMonthDate].push(expense);
    });
    return groupedExpensesByWeek;
  };
  const groupExpensesByWeek = (expenses) => {

    const groupedExpensesByWeek = {};

    expenses.forEach((expense) => {
      const expenseDate = new Date(expense.date);
      const dayOfWeek = expenseDate.getDay();
      const weekStartDate = new Date(expenseDate);
      weekStartDate.setDate(expenseDate.getDate() - dayOfWeek);
      const weekStartDateString = weekStartDate.toISOString().split('T')[0];

      if (!groupedExpensesByWeek[weekStartDateString]) {
        groupedExpensesByWeek[weekStartDateString] = [];
      }
      groupedExpensesByWeek[weekStartDateString].push(expense);
    });
    return groupedExpensesByWeek;
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
  const calculateMonthlyTotal = (date) => {
    var currentDate = new Date();
    const expenseDate = new Date(date);
    const expenseDateString = convertDate(expenseDate);
    const endDate = new Date(expenseDate.getFullYear(), expenseDate.getMonth() + 1, 1);
    endDate.setDate(endDate.getDate() - 1)
    var startDate = new Date(expenseDate.getFullYear(), expenseDate.getMonth(), 1);
    var startDateString = convertDate(startDate)
    var endDateString = convertDate(endDate)

    const differenceInMonths = getMonthDifference(expenseDate, currentDate);
    const weekText = (prefix, total) => (
      <Flex flexDirection={'column'}>
        {total && (
          <Box w={'100%'} p={'10px '} color={'#fff'} background={'#3182CE'}>
            <Text as={'h6'} fontWeight={'600'}>{`${prefix} : Rs ${total}`}</Text>
          </Box>
        )}
      </Flex>
    );
    var date = new Date(date)
    var prices = groupedExpensesByMonth[endDateString].map((date) => date.price);
    var date = groupedExpensesByMonth[endDateString].map((date) => date.date);
    const filterDate = convertDate(new Date(date.reduce((a, b) => a > b ? a : b)));
    var totalPrices = prices.reduce((a, b) => a + parseFloat(b), 0)
    var datePrice = { "date": filterDate, "price": totalPrices.toFixed(2) }


    if (datePrice.date === expenseDateString) {
      if (differenceInMonths.year === 0 && differenceInMonths.month === 0) {
        return weekText('This Month\'s Total expenses', datePrice.price);
      }
      if (differenceInMonths.year === 0 && differenceInMonths.month === 1) {
        return weekText('Last Month\'s Total expenses', datePrice.price);
      }
      return weekText(`${startDateString} To ${endDateString}`, datePrice.price)
    }
  };
  const calculateWeeklyTotal = (date) => {
    const expDate = new Date(date);
    const weekStartDate = new Date(expDate);
    weekStartDate.setDate(expDate.getDate() - expDate.getDay())
    var startDate = convertDate(weekStartDate);
    const weekEndDate = new Date(weekStartDate);
    weekEndDate.setDate(weekStartDate.getDate() + 6)
    const endDate = convertDate(weekEndDate)
    var weekStartDateString = weekStartDate.toISOString().split("T")[0];
    const dayDifference = Math.ceil((currentDate - weekStartDate) / (1000 * 60 * 60 * 24));

    var prices = groupedExpensesByWeek[weekStartDateString].map((date) => date.price);
    var date = groupedExpensesByWeek[weekStartDateString].map((date) => date.date);
    const filterDate = new Date(date.reduce((a, b) => a > b ? a : b));
    var totalPrice = prices.reduce((a, b) => a + parseFloat(b), 0)
    const weekText = (prefix, total) => (
      <Flex flexDirection={'column'}>
        {total && (
          <Box w={'100%'} p={'10px '} color={'#fff'} background={'#3182CE'}>
            <Text as={'h6'} fontWeight={'600'}>{`${prefix} : Rs ${total}`}</Text>
          </Box>
        )}
      </Flex>
    );
    if (filterDate.getDate() === expDate.getDate()) {
      if (dayDifference <= 7) {
        return weekText('This Week\'s Total expenses', totalPrice);
      } else if (dayDifference <= 14) {
        return weekText('Last Week\'s Total expenses', totalPrice);
      }
      return weekText(`${startDate} To ${endDate}`, totalPrice);
    }
  }
  const calculateDailyTotal = (date) => {
    const dailyTotal = {};
    var expDate = new Date(date)
    expDate = convertDate(expDate)
    var currentDateString = convertDate(currentDate)
    var yesterdayDateString = convertDate(yesterday)
    for (const expDate in groupedExpensesByDay) {
      const dayexpensesInWeek = groupedExpensesByDay[expDate];
      if (dayexpensesInWeek.length > 2) {
        const total = dayexpensesInWeek.reduce((acc, expense) => acc + parseFloat(expense.price), 0);
        dailyTotal[expDate] = total.toFixed(2);
      }
    }
    if (uniqueDate !== expDate) {
      uniqueDate = expDate
      var Total = dailyTotal[uniqueDate]
      if (currentDateString === expDate) {
        return <Flex flexDirection={'column'}>
          <Box w={'100%'} p={'10px '} color={'#fff'} background={'#4299e1'}>
            <Text as={'h6'} fontWeight={'600'}>{Total
              ? `Total of Today's expenses : Rs ${Total}` : `Today`}</Text>
          </Box></Flex>
      }
      if (yesterdayDateString === expDate) {
        return <Flex flexDirection={'column'}>
          <Box w={'100%'} p={'10px '} color={'#fff'} background={'#4299e1'}>
            <Text as={'h6'} fontWeight={'600'}>{Total
              ? `Total of Yesterday's expenses : Rs ${Total}` : `Yesterday`}</Text>
          </Box></Flex>
      }
      return <Flex flexDirection={'column'}>
        <Box w={'100%'} p={'10px '} color={'#fff'} background={'#4299e1'}>
          <Text as={'h6'} fontWeight={'600'}>{Total
            ? `Total of ${uniqueDate}'s expenses : Rs ${Total}` : `${uniqueDate}`}</Text>
        </Box></Flex>
    }
  };

  const groupedExpensesByMonth = expData && groupExpensesByMonth(expData);
  const groupedExpensesByWeek = expData && groupExpensesByWeek(expData);
  const groupedExpensesByDay = expData && groupExpensesByDay(expData);
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
          {
            user ?
              expData ? expData.map((data, index) => {
                const onetimedate = calculateDailyTotal(data.date)
                return (
                  <Flex flexWrap={'wrap'} flexDirection={'column'} key={data.id} overflowX={'scroll'} width={'650px'}
                    backgroundColor={index % 2 == 1 ? 'white' : '#B2F5EA'}>
                    {onetimedate ? calculateMonthlyTotal(data.date) : ''}
                    {onetimedate ? calculateWeeklyTotal(data.date) : ''}
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
              }) : <Flex flexDirection={'column'}>
                <Box w={'100%'} p={'10px '} color={'#fff'} background={'#3182CE'}>
                  <Text as={'h6'} fontWeight={'600'}>Loading...</Text>
                </Box>
              </Flex>
              : <Flex flexDirection={'column'}>
                <Box w={'100%'} p={'10px '} color={'#fff'} background={'#3182CE'}>
                  <Text as={'h6'} fontWeight={'600'}>Sign In to store and see data...</Text>
                </Box>
              </Flex>
          }
        </Flex>
      </Container>
    </>
  );
};

export default Home;
