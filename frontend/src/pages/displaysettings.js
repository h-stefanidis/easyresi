import React, { useState, useEffect } from "react";
import { Box, Button, Container, Text, Heading, VStack, useToast, Flex } from '@chakra-ui/react';
import Navbar from "../components/Navbar";
import AgentNavbar from '../components/AgentNavbar';
import AdminNavbar from '../components/AdminNavbar';
import NothingNavbar from '../components/NothingNavbar';
import axios from '../axiosConfig';
import Footer from "../components/Footer";
import { useNavigate } from 'react-router-dom';
import Popup from '../components/Popup'; 

const DisplaySettings = () => {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: ''
    });

    const navigate = useNavigate();
    const toast = useToast();
    
    const [error, setError] = useState('');const [userType, setUserType] = useState('');

    const handleClosePopup = () => {
        setError(''); // Close the popup by clearing the error message
    };

    const renderNavbar = () => {
        switch (userType) {
            case 'admin':
                return <AdminNavbar />;
            case 'agent':
                return <AgentNavbar />;
            case 'applicant':
                return <Navbar />;
            default:
                return <NothingNavbar />; // Render a default or blank navbar if no user_type
        }
    };

    const fetchSettingsData = async () => {
        try {
            const response = await axios.get('/api/profile'); // Adjust the URL if needed
            setFormData(response.data.data);
        } catch (err) {
            toast({
                title: "Failed to load user details.",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            setError('An unexpected error occurred fetching user details.. Please contact administrator');
        }
    };

    const fetchLogin = async () => {
        try {
            const response = await axios.get('/auth/login');
            if (response.data.type === "error") {
                setError('User was not logged in, redirecting to login.')
                navigate('/login', { state: { message: "User was not logged in, redirecting to login..." } });
            }
            if (response.data.type === "success") {
                setUserType(response.data.data.user_type);
            }
        } catch (err) { 
            setError('Unable to submit your responses. Please try again later');}
    };

    const handleLogout = async () => {
        try {
            const response = await axios.post('/auth/logout', {});
            sessionStorage.clear();
            console.log(response.data.message); // Log success message or handle accordingly
            window.location.href = '/login'; // Redirect to login page

        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    useEffect(() => {
        fetchLogin();
        fetchSettingsData();
    }, []);

    const handleEditClick = () => {
        navigate('/settings');
    };

    return (
        <>
        <div className="displaysettings">
            <Flex direction="column" minH="100vh">
            {renderNavbar()}
                <Flex flex="1" direction="column">
                    <Container maxW="container.md" py={8} flex="1">
                        <VStack spacing={6} align="start">
                            <Heading as="h1" size="xl">Settings</Heading>
                            <Text fontSize="lg">View your account details</Text>
                            <Box w="100%" bg="gray.50" p={6} borderRadius="md" boxShadow="md">
                                <VStack spacing={4} align="start">
                                    <Text fontWeight="bold">First Name: <Text as="span" fontWeight="normal">{formData.first_name}</Text></Text>
                                    <Text fontWeight="bold">Last Name: <Text as="span" fontWeight="normal">{formData.last_name}</Text></Text>
                                    <Text fontWeight="bold">Email: <Text as="span" fontWeight="normal">{formData.email}</Text></Text>
                                    <Button colorScheme="teal" onClick={handleEditClick}>
                                        Edit User Details
                                    </Button>
                                    <Button colorScheme="red" onClick={handleLogout}>
                                        Logout
                                    </Button>
                                </VStack>
                            </Box>
                        </VStack>
                    </Container>
                </Flex>
                <Footer />
            </Flex>
            </div>
            <Popup error={error} onClose={handleClosePopup} />
            <Footer />
        </>
    );
};

export default DisplaySettings;
