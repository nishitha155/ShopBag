import React from 'react';
import {
  Box, Flex, Text, Button, Image, HStack, Circle,
  useColorModeValue, Badge
} from '@chakra-ui/react';
import { FaShoppingCart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/image.png';
import { Link } from 'react-router-dom';

const Navbar = ({ cartItemsCount }) => {
  const navigate = useNavigate();
  const bgColor = useColorModeValue('white', 'gray.800');

  const handleCart = () => {
    navigate('/cart');
  };

  

  return (
    <Box bg={bgColor} px={4} boxShadow="sm">
      <Flex h={16} alignItems="center" justifyContent="space-between">
      <Link to='/products'>
        <HStack spacing={4} flex={1}>
          <Circle color="white">
            <Image src={logo} alt="Logo" boxSize="40px" />
          </Circle>
          <Text fontSize={["xl", "2xl"]} fontWeight="bold" color="#f15560" display={["none", "block"]}>
            ShopBag
          </Text>
        </HStack>
        </Link>
        

        <HStack spacing={4} flex={1} justifyContent="flex-end">
          <Button
            leftIcon={<FaShoppingCart />}
            bg="#f15560"
            color="white"
            _hover={{ bg: "#ca464c" }}
            variant="solid"
            onClick={handleCart}
            size={["sm", "md"]}
            position="relative"
          >
            Cart
            {cartItemsCount > 0 && (
              <Badge
                colorScheme="green"
                borderRadius="full"
                position="absolute"
                top="-1"
                right="-1"
              >
                {cartItemsCount}
              </Badge>
            )}
          </Button>
        </HStack>
      </Flex>
    </Box>
  );
};

export default Navbar;