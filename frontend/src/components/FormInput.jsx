import React from 'react';
import { FormControl, FormLabel, Input, FormErrorMessage } from '@chakra-ui/react';

const FormInput = ({ label, name, value, onChange, error, type = "text", placeholder }) => {
  return (
    <FormControl isInvalid={!!error}>
      <FormLabel>{label}</FormLabel>
      <Input
        type={type}
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={onChange}
      />
      <FormErrorMessage>{error}</FormErrorMessage>
    </FormControl>
  );
};

export default FormInput;
