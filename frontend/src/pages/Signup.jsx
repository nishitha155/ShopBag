import { useState } from 'react';
import { Flex, Box, Image, Text, useToast } from '@chakra-ui/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import signupImage from '../assets/login.png';
import logo from '../assets/image.png';
import AuthForm from '../components/AuthForm';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

axios.defaults.baseURL = 'https://shopbag-n1j1.onrender.com/';

export const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    userName: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'fullName':
        if (value.trim().length < 2) {
          error = 'Full name must be at least 2 characters long';
        }
        break;
      case 'email':
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = 'Invalid email address';
        }
        break;
      case 'userName':
        if (!/^(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(value)) {
          error = 'Username must be at least 8 characters with one capital letter and one digit';
        }
        break;
      case 'password':
        if (value.length < 6) {
          error = 'Password must be at least 6 characters long';
        }
        break;
      case 'confirmPassword':
        if (value !== formData.password) {
          error = 'Passwords do not match';
        }
        break;
      default:
        break;
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    const error = validateField(name, value);
    setErrors({ ...errors, [name]: error });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      await axios.post('/register', formData);
      toast({
        title: 'Account created.',
        description: "We've created your account for you.",
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      navigate('/products');
    } catch (error) {
      toast({
        title: 'Registration failed.',
        description: error.response?.data?.message || 'An error occurred during registration.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <Flex h="90vh" align="center" justify="center">
        <Box w="100%" bg="white" boxShadow="xl" rounded="lg" overflow="hidden">
          <Flex h="90vh">
            <Box w="50%" p={8}>
              <Flex justify="center" mb={6}>
                <Image src={logo} alt="Logo" boxSize="60px" borderRadius="full" />
                <Text fontSize="3xl" fontWeight="bold" ml={3} color="#f15560">
                  ShopBag
                </Text>
              </Flex>
              <AuthForm
                formData={formData}
                errors={errors}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                isSignup={true}
              />
            </Box>
            <Box w="50%" backgroundImage={`url(${signupImage})`} backgroundSize="cover" backgroundPosition="center" />
          </Flex>
        </Box>
      </Flex>
      <ToastContainer />
    </>
  );
};
