import { Box, Text, Divider } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const Tile = ({ title, to, description, imgSrc }) => {
    return (
        <Box
            width="450px"
            height="275px"
            bg="#ffffff"
            borderRadius="10px"
            border="3px solid #003366"
            display="flex"
            flexDirection="column"
            justifyContent="flex-start"
            alignItems="center"
            p={4}
            boxShadow="lg"
            backgroundImage={`url(${imgSrc})`} 
            backgroundSize="cover"
            backgroundPosition="center"
        >
            <Link to={to} style={{ textDecoration: 'none', width: '100%' }}>
                <Box 
                    bg="rgba(255, 255, 255, 0.8)"
                    transition="background-color 0.3s, border 0.1s"
                    _hover={{ 
                        bg: "rgba(255, 255, 255, 1)", 
                        border: "2px solid #ff6f00"
                    }}
                    borderRadius="8px"
                    p={2}
                    textAlign="center"
                    width="100%"
                    height="100%"
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                >
                    <Text 
                        fontSize="1.75rem" 
                        fontWeight="bold" 
                        color="#333333" 
                        mb={2}
                        transition="transform 0.3s"
                    >
                        {title}
                    </Text>
                    <Divider 
                        borderColor="#ff6f00"
                        width="60%"
                        borderWidth="1px"
                        margin="auto"
                        my={2}
                    />                
                    <Text fontSize="1.25rem" color="#333333">{description}</Text>
                </Box>
            </Link>
        </Box>
    );
};

export default Tile;