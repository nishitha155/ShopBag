import React from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Button, Image, Text, Flex, Box } from '@chakra-ui/react';

const ProductModal = ({ isOpen, onClose, product }) => {
  if (!product) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{product.name}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex>
            <Box flex="1">
              <Image src={product.image} alt={product.name} objectFit="cover" h="100%" w="100%" />
            </Box>
            <Box flex="1" p={4}>
              <Text fontWeight="bold" fontSize="xl" mb={4}>{product.brand}</Text>
              <Text mb={4}>{product.description}</Text>
              <Text fontWeight="bold" fontSize="xl" mb={4}>₹{product.price}</Text>
            </Box>
          </Flex>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ProductModal;