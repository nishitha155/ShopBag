import {
  Box,
  VStack,
  HStack,
  Text,
  Image,
  Button,
  IconButton,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Input,
  keyframes,
} from '@chakra-ui/react';
import { FaTrash } from 'react-icons/fa';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const bounceAnimation = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

export const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [couponCode, setCouponCode] = useState('');
  const [discountedSubtotal, setDiscountedSubtotal] = useState(0);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await axios.get('https://shopbag-n1j1.onrender.com/getcart');
      setCartItems(response.data);
    } catch (error) {
      console.error('Error fetching cart:', error);
      toast.error('Failed to fetch cart');
    }
  };

  const handleQuantityChange = async (itemId, available, quantity) => {
    try {
      if (quantity > 10) {
        toast.error('Quantity not available');
        return; // Stop further execution if the quantity is greater than 10
      }
  
      await axios.put(`https://shopbag-n1j1.onrender.com/cart`, { itemId, quantity });
      fetchCart();
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error('Failed to update quantity');
    }
  };
  

  const handleRemoveItem = async (itemId) => {
    try {
      await axios.delete(`https://shopbag-n1j1.onrender.com/cart/${itemId}`);
      fetchCart();
      toast.success('Item removed from cart');
    } catch (error) {
      console.error('Error removing item:', error);
      toast.error('Failed to remove item');
    }
  };

  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const applyCoupon = () => {
    if (couponCode === 'FLAT15' && subtotal >= 5000) {
      const discounted = subtotal * 0.85; // 15% off
      setDiscountedSubtotal(discounted);
      toast.success('Coupon applied successfully!');
    } else if (couponCode !== 'FLAT15') {
      setDiscountedSubtotal(0);
      toast.error('Coupon code not available');
    } else {
      setDiscountedSubtotal(0);
      toast.error('Invalid coupon code');
    }
  };

  return (
    <>
      {/* Pass the cart items count to Navbar */}
      <Navbar cartItemsCount={cartItems.reduce((a, b) => a + b.quantity, 0)} />
      <Box maxWidth="800px" margin="auto" padding="20px">
        <VStack spacing={4} align="stretch">
          <Text fontSize="2xl" fontWeight="bold">Your Cart</Text>
          {cartItems.map((item) => (
            <HStack key={item.id} justify="space-between" borderWidth={1} p={4} borderRadius="md">
              <Image src={item.image} alt={item.name} boxSize="100px" objectFit="cover" />
              <VStack align="start">
                <Text fontWeight="bold">{item.name}</Text>
                <Text>₹{item.price}</Text>
              </VStack>
              <NumberInput
                defaultValue={item.quantity}
                min={1}
                
                onChange={(value) => handleQuantityChange(item.id,item.available, parseInt(value))}
              >
                <ToastContainer position="top-right" autoClose={3000} />
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              <IconButton
                icon={<FaTrash />}
                onClick={() => handleRemoveItem(item.id)}
                aria-label="Remove item"
              />
            </HStack>
          ))}
          <HStack justify="space-between" paddingY={4}>
            <Text fontWeight="bold" fontSize="lg" color="teal.500" animation={`${fadeIn} 1s ease-in-out`}>
              Subtotal:
            </Text>
            <Text fontSize="lg" fontWeight="bold" color="teal.700" animation={`${bounceAnimation} 1s infinite`}>
              ₹{subtotal.toFixed(2)}
            </Text>
          </HStack>
          <HStack>
            <Input
              placeholder="Enter coupon code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
            />
            <Button onClick={applyCoupon}>Apply Coupon</Button>
            <ToastContainer position="top-right" autoClose={3000} />
          </HStack>
          {discountedSubtotal > 0 && (
            <HStack justify="space-between" paddingY={4}>
              <Text fontWeight="bold" fontSize="lg" color="green.500" animation={`${fadeIn} 1s ease-in-out`}>
                Discounted Total:
              </Text>
              <Text fontSize="lg" fontWeight="bold" color="green.700" animation={`${bounceAnimation} 1s infinite`}>
                ₹{discountedSubtotal.toFixed(2)}
              </Text>
            </HStack>
          )}
          <Link to='/checkout'>
          <Button
            bg="#f15560"
            color="white"
            _hover={{ bg: "#ca464c" }}
            size="lg"
            animation={`${fadeIn} 1s ease-in-out`}
          >
            Proceed to Checkout
          </Button>
          </Link>
        </VStack>
      </Box>
      
    </>
  );
};

export default Cart;
