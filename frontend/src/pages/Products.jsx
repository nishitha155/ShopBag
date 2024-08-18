import React, { useState, useEffect } from 'react';
import { Box, SimpleGrid, Image, Text, Button, Select, Flex, Icon, useDisclosure, Center } from '@chakra-ui/react';
import { FaFilter } from 'react-icons/fa';
import { MdSentimentDissatisfied } from 'react-icons/md';
import brand1 from '../assets/brand1.png';
import brand2 from '../assets/brand2.png';
import brand3 from '../assets/brand3.png';
import brand4 from '../assets/brand4.png';
import brand5 from '../assets/brand5.png';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import image from '../assets/all.png';
import ProductModal from '../components/ProductModal';
import Cookies from 'js-cookie'



const brandImages = [
  { src: brand1, name: 'Lenovo' },
  { src: brand2, name: 'HP' },
  { src: brand3, name: 'Zebronics' },
  { src: brand4, name: 'Asus' },
  { src: brand5, name: 'Dell' },
  { src: image, name: '' },
];



export const Products = () => {
  const authToken=Cookies.get('authToken')
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({});
  const [priceFilter, setPriceFilter] = useState('');
  const [brandFilter, setBrandFilter] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    fetchProducts();
    fetchCart();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('https://shopbag-n1j1.onrender.com/products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchCart = async () => {
    try {
      const response = await fetch('https://shopbag-n1j1.onrender.com/getcart', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        credentials: 'include'
      });
      
      if (response.status === 401) {
        toast.error('Session expired, please log in again.');
        // Optionally redirect to login page
        return;
      }
  
      const data = await response.json();
      const cartItems = data.reduce((acc, item) => {
        acc[item.productId] = item.quantity;
        return acc;
      }, {});
      setCart(cartItems);
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };
  
  const handleAddToCart = async (productId) => {
    try {
      if (!authToken) {
        toast.error('You must be logged in to add items to the cart.');
        // Optionally redirect to login page
        return;
      }
  
      if (cart[productId]) {
        toast.info('Product already in Cart');
      } else {
        const response = await fetch('https://shopbag-n1j1.onrender.com/postcart', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          },
          body: JSON.stringify({ productId, quantity: 1 }),
          credentials: 'include'
        });
  
        if (response.status === 401) {
          toast.error('Session expired, please log in again.');
          // Optionally redirect to login page
          return;
        }
  
        if (response.ok) {
          setCart((prevCart) => ({ ...prevCart, [productId]: (prevCart[productId] || 0) + 1 }));
          toast.success('Added to cart');
        } else {
          toast.error('Failed to add to cart');
        }
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add to cart');
    }
  };
  
  
  const handleBrandClick = (brandName) => {
    setBrandFilter(brandName);
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    onOpen();
  };

  const filteredProducts = products.filter(product => {
    const priceFilterPass = priceFilter
      ? (priceFilter === 'under500' && product.price < 500) ||
        (priceFilter === '500to1000' && product.price >= 500 && product.price <= 1000) ||
        (priceFilter === 'over1000' && product.price > 1000)
      : true;

    const brandFilterPass = brandFilter
      ? product.brand === brandFilter
      : true;

    return priceFilterPass && brandFilterPass;
  });

  return (
    <>
      <Navbar cartItemsCount={Object.values(cart).reduce((a, b) => a + b, 0)} />
      <Box bg="gray.100">
        <Flex justifyContent="flex-end" p={4} bg="white" boxShadow="sm">
          <Box position="relative">
            <Icon as={FaFilter} position="absolute" right="10px" top="50%" transform="translateY(-50%)" zIndex={2} color="gray.500" />
            <Select
              placeholder="Filter by price"
              onChange={(e) => setPriceFilter(e.target.value)}
              pr="40px"
              bg="white"
              borderColor="gray.300"
            >
              <option value="under500">Under ₹500</option>
              <option value="500to1000">₹500 - ₹1000</option>
              <option value="over1000">Over ₹1000</option>
            </Select>
          </Box>
        </Flex>

        <Box overflowX="hidden" py={4} bg="gray.200">
          <Flex
            overflow="hidden"
            whiteSpace="nowrap"
            position="relative"
            width="100%"
            animation="marquee 50s linear infinite"
          >
            {brandImages.concat(brandImages).map((brand, index) => (
              <Flex
                key={index}
                direction="column"
                alignItems="center"
                mx={4}
                cursor="pointer"
                onClick={() => handleBrandClick(brand.name)}
              >
                <Image src={brand.src} alt={brand.name} h="50px" />
                <Text fontSize="sm" mt={1} fontWeight={1000}>{brand.name}</Text>
              </Flex>
            ))}
          </Flex>
        </Box>

        <Box 
          bg="#ffb3b3" 
          p={4} 
          textAlign="center" 
          display="flex" 
          justifyContent="center"
          alignItems="center"
          animation="pulse 2s infinite"
        >
          <Text fontSize="xl" fontWeight="bold" color="black.600">
            FLAT 15% OFF on Orders ₹5000 & above!
          </Text>
          <Text fontSize="xl" fontWeight="bold" color="black.600" ml={10}>
            USE CODE: FLAT15
          </Text>
          <style>
            {`
              @keyframes pulse {
                0% {
                  transform: scale(1);
                }
                50% {
                  transform: scale(1.05);
                }
                100% {
                  transform: scale(1);
                }
              }
            `}
          </style>
        </Box>

        <Box p={4}>
          {filteredProducts.length === 0 ? (
            <Center h="300px" flexDirection="column">
              <Icon as={MdSentimentDissatisfied} boxSize={24} color="gray.500" />
              <Text fontSize="xl" fontWeight="bold" color="gray.600" mt={4} animation="fadeIn 2s">
                No products available
              </Text>
              <Text color="gray.400" animation="fadeIn 2s">
                Try adjusting your filters.
              </Text>
              <style>
                {`
                  @keyframes fadeIn {
                    0% {
                      opacity: 0;
                    }
                    100% {
                      opacity: 1;
                    }
                  }
                `}
              </style>
            </Center>
          ) : (
            <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={6}>
              {filteredProducts.map((product) => (
                <Box key={product._id} borderWidth={1} borderRadius="lg" p={4} bg="white" boxShadow="md" transition="all 0.3s" _hover={{ transform: 'translateY(-5px)', boxShadow: 'lg' }}>
                  <Image 
                    src={product.image} 
                    alt={product.name} 
                    mb={4} 
                    objectFit="cover" 
                    h="300px" 
                    w="100%" 
                    cursor="pointer"
                    onClick={() => handleProductClick(product)}
                  />
                  <Text mb={2} fontWeight="bold" color="gray.700">{product.brand}</Text>
                  <Text fontWeight="bold" mb={2} color="gray.700" fontSize={25}>{product.name}</Text>
                  <Text mb={4} fontWeight="bold" fontSize={30} color="gray.600">₹{product.price}</Text>
                  <Button
                    colorScheme={cart[product._id] ? 'green' : 'red'}
                    onClick={() => handleAddToCart(product._id)}
                    isFullWidth
                    _hover={{ opacity: 0.8 }}
                  >
                    {cart[product._id] ? 'Added to Cart' : 'Add to Cart'}
                  </Button>
                </Box>
              ))}
            </SimpleGrid>
          )}
        </Box>
        <ToastContainer position="bottom-right" autoClose={3000} />
      </Box>
      <Footer />

      <ProductModal isOpen={isOpen} onClose={onClose} product={selectedProduct} />
    </>
  );
};

export default Products;
