import React from 'react';
import {
  Box,
  Container,
  Stack,
  SimpleGrid,
  Text,
  Link,
  IconButton,
  useColorModeValue,
} from '@chakra-ui/react';
import { FaTwitter, FaYoutube, FaInstagram, FaLinkedin, FaGithub } from 'react-icons/fa';

const Footer = () => {
  return (
    <Box
      bg={useColorModeValue('gray.50', 'gray.900')}
      color={useColorModeValue('gray.700', 'gray.200')}
    >
      <Container as={Stack} maxW={'6xl'} py={10}>
        <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={8}>
          <Stack align={'flex-start'}>
            <Text fontWeight={'500'} fontSize={'lg'} mb={2}>Company</Text>
            <Link href={'#'}>About</Link>
            <Link href={'#'}>Contact Us</Link>
            <Link href={'#'}>Careers</Link>
          </Stack>

          <Stack align={'flex-start'}>
            <Text fontWeight={'500'} fontSize={'lg'} mb={2}>Support</Text>
            <Link href={'#'}>Help Center</Link>
            <Link href={'#'}>Terms of Service</Link>
            <Link href={'#'}>Privacy Policy</Link>
          </Stack>

          <Stack align={'flex-start'}>
            <Text fontWeight={'500'} fontSize={'lg'} mb={2}>Legal</Text>
            <Link href={'#'}>Cookie Policy</Link>
            <Link href={'#'}>Licensing</Link>
          </Stack>

          <Stack align={'flex-start'}>
            <Text fontWeight={'500'} fontSize={'lg'} mb={2}>Follow Us</Text>
            <Stack direction={'row'} spacing={6}>
              <IconButton aria-label="twitter" icon={<FaTwitter />} size="lg" color={'white'} bgColor={'gray.400'} _hover={{bgColor: 'gray.500'}} />
              <IconButton aria-label="instagram" icon={<FaInstagram />} size="lg" color={'white'} bgColor={'gray.400'} _hover={{bgColor: 'gray.500'}} />
              <IconButton aria-label="linkedin" icon={<FaLinkedin />} size="lg" color={'white'} bgColor={'gray.400'} _hover={{bgColor: 'gray.500'}} />
              <IconButton aria-label="github" icon={<FaGithub />} size="lg" color={'white'} bgColor={'gray.400'} _hover={{bgColor: 'gray.500'}} />
            </Stack>
          </Stack>
        </SimpleGrid>
      </Container>

      <Box
        borderTopWidth={1}
        borderStyle={'solid'}
        borderColor={useColorModeValue('gray.200', 'gray.700')}
      >
        <Container
          as={Stack}
          maxW={'6xl'}
          py={4}
          direction={{ base: 'column', md: 'row' }}
          spacing={4}
          justify={{ md: 'space-between' }}
          align={{ md: 'center' }}
        >
          <Text>© 2024 ShopBag. All rights reserved</Text>
          <Stack direction={'row'} spacing={6}>
            <Link href={'#'}>Privacy Policy</Link>
            <Link href={'#'}>Terms of Use</Link>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
};

export default Footer;