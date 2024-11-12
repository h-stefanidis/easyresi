import { Box, Text } from '@chakra-ui/react';

const Footer = () => {
  return (
    <Box
      bg="#003366"
      color="#ffffff"
      py={4}
      textAlign="center"
    >
      <Text fontSize="sm">
        © {new Date().getFullYear()} Easy Resi. All Rights Reserved.
      </Text>
    </Box>
  );
};

export default Footer;