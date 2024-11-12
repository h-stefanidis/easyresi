import { Link } from "react-router-dom";
import '../index.css';
import NothingNavbar from '../components/NothingNavbar';
import Footer from "../components/Footer";
import { Box, Button, Heading, Text } from '@chakra-ui/react';

const Notfound = () => {
    return (
        <Box display="flex" flexDirection="column" minHeight="100vh">
            <NothingNavbar />
            <Box flex="1" display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                <Heading as="h1" size="3xl" mb="20px" color="#333333" fontWeight="500" fontFamily="Quicksand">
                    Sorry!
                </Heading>
                <Text fontSize="1.5rem" mb="20px">
                    That page cannot be found.
                </Text>
                <Link to="/">
                    <Button
                        className="home-button"
                        sx={{
                            backgroundColor: '#008080',
                            color: '#ffffff',
                            padding: '6px 12px',
                            fontSize: '14px',
                            height: '35px',
                            fontWeight: '400',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            transition: 'background-color 0.3s ease, transform 0.2s ease',
                            marginRight: '10px',
                            _hover: { backgroundColor: '#003366', transform: 'scale(1.05)' },
                            _focus: { outline: 'none', boxShadow: '0 0 0 3px rgba(66, 153, 225, 0.6)' },
                        }}
                    >
                        Back to Home Page
                    </Button>
                </Link>
            </Box>
            <Footer />
        </Box>
    );
}

export default Notfound;
