
import {
  Box, Flex, Text,  Button, Image, HStack, Circle,
  useColorModeValue
} from '@chakra-ui/react';


import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/image.png';


 const Header1 = () => {
    const navigate = useNavigate(); 

  const bgColor = useColorModeValue('white', 'gray.800');
 

  
  const handleSignup = () => {
    navigate('/signup');
  };
  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <Box bg={bgColor} px={4} boxShadow="sm">
      <Flex h={16} alignItems="center" justifyContent="space-between">
        <HStack spacing={4} flex={1}>
        <Circle color="white">
            <Image src={logo} alt="Logo" boxSize="40px" />
          </Circle>
          <Text fontSize={["xl", "2xl"]} fontWeight="bold" color="#f15560" display={["none", "block"]}>
            ShopBag
          </Text>
       </HStack>

        
        <HStack spacing={4} flex={1} justifyContent="flex-end">
          
          <Button
           
           bg="#f15560" color="white" _hover={{ bg: "#ca464c" }}
            variant="solid"
            onClick={handleSignup}
            size={["sm", "md"]}
          >
            SignUp
          </Button>
          <Button
           
           bg="#f15560" color="white" _hover={{ bg: "#ca464c" }}
            variant="solid"
            onClick={handleLogin}
            size={["sm", "md"]}
          >
            Login
          </Button>
        </HStack>
      </Flex>
    </Box>
  );
};

export default Header1;