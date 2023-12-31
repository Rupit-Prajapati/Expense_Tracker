'use client'
import { Button, ButtonGroup, Container, Flex, Image, Stack, Text, Wrap, WrapItem } from '@chakra-ui/react'
import dummy from '../../public/vercel.svg'
import { useMyContext } from './context/context'

const Navbar = () => {
  const { user, signIn, signOut } = useMyContext();
  return (
    <Flex padding={'10px 0px'}>
      <Container maxW={['95%', '540px', '650px', '650px', '650px', '650px',]} margin={'0px auto'} px={'5px'}>
        {user ? (
          <>
            <Flex justifyContent={'space-between'}>
              <Flex alignItems={'center'} gap={'10px'}>
                <Image borderRadius='full' boxSize='50px' objectFit='cover' src={user.photoURL} alt={user.displayName} />
                <Text as='h1'>{user.displayName}</Text>
              </Flex>
              <Button onClick={signOut} colorScheme='gray'>Sign Out</Button>
            </Flex>
          </>
        ) : (
          <Flex justifyContent={'space-between'}>
            <Flex alignItems={'center'} gap={'10px'}>
              <Image borderRadius='full' boxSize='50px' objectFit='contain' src={dummy.src} alt='No User' />
              <Text as='h1'>Guest Login</Text>
            </Flex>
            <Button onClick={signIn} colorScheme='linkedin'>Sign In</Button>
          </Flex>
        )}
      </Container>
    </Flex>
  )
}

export default Navbar