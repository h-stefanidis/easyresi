import { Link } from "react-router-dom";
import { Box, Flex, Heading, Text, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react';
import axios from '../axiosConfig';


const Navbar = () => {
    const handleLogout = async () => {
        try {
            const response = await axios.post('/auth/logout', {});
            sessionStorage.removeItem('user_id');
            sessionStorage.removeItem('checking_user_id');
            console.log(response.data.message); // Log success message or handle accordingly
            window.location.href = '/login'; // Redirect to login page

        } catch (error) {
            console.error('Logout failed:', error);
        }
    };
    return (
        <Box 
            className="navbar" 
            bg="#003366" 
            padding="0 20px" 
            height="100px"
            display="flex" 
            justifyContent="space-between" 
            alignItems="center"
        >
            <Heading 
                size="lg" 
                fontSize="3rem"
                color="#fff"
                margin="0"
                fontWeight={"normal"}
            >
                <Link to="/" style={{ textDecoration: 'none', color: '#fff', marginLeft: '15px' }}>Easy Resi</Link>
            </Heading>
            <Flex className="links" gap="20px" align="center">
            </Flex>
        </Box>
    );
}

export default Navbar;