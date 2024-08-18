import React from 'react';
import { VStack, Button, Text } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import FormInput from './FormInput';

const AuthForm = ({ formData, errors, handleChange, handleSubmit, isSubmitting, isSignup }) => {
  return (
    <form onSubmit={handleSubmit}>
      <VStack spacing={4} align="stretch" maxWidth="400px" mx="auto">
        {isSignup && (
          <>
            <FormInput
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              error={errors.fullName}
              placeholder="Enter your full name"
            />
            <FormInput
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="Enter your email"
            />
          </>
        )}
        <FormInput
          label="Username"
          name="userName"
          value={formData.userName}
          onChange={handleChange}
          error={errors.userName}
          placeholder="Enter your username"
        />
        <FormInput
          label="Password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          type="password"
          placeholder="Enter your password"
        />
        {isSignup && (
          <FormInput
            label="Confirm Password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            type="password"
            placeholder="Confirm your password"
          />
        )}
        <Button
          bg="#f15560" color="white" _hover={{ bg: "#ca464c" }}
          width="full"
          mt={4}
          type="submit"
          isLoading={isSubmitting}
        >
          {isSignup ? 'Sign Up' : 'Login'}
        </Button>
      </VStack>
      <VStack>
        <Text margin={4}>
          {isSignup ? 'Already have an account?' : 'New to ShopBag?'}
          <Link to={isSignup ? "/" : "/signup"}>
            <Text as="span" textDecoration="underline" color="#f15560">
              {isSignup ? 'Login' : 'Signup'}
            </Text>
          </Link>
        </Text>
      </VStack>
    </form>
  );
};

export default AuthForm;
