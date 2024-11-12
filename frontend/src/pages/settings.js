import React, { useState, useEffect } from "react";
import { Box, Button, Container, Text, Heading, VStack, FormControl, FormLabel, Input, useToast, Flex } from '@chakra-ui/react';
import Navbar from "../components/Navbar"; // Make sure Navbar is correctly imported and styled
import AdminNavbar from '../components/AdminNavbar';
import Footer from "../components/Footer"; // Make sure Footer is correctly imported and styled
import Popup from '../components/Popup';
import axios from '../axiosConfig';
import { useNavigate } from 'react-router-dom';
import AgentNavbar from '../components/AgentNavbar';
import NothingNavbar from '../components/NothingNavbar';



const Settings = () => {
    const navigate = useNavigate();
    const toast = useToast();
    const [error, setError] = useState('');
    const [userType, setUserType] = useState('');

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
    
    const fetchLogin = async () => {
        try {
            const response = await axios.get('/auth/login');
            if (response.data.type === "error") {
                setError('User was not logged in, redirecting to login.')
                console.log('User not logged in')
                navigate('/login', { state: { message: "User was not logged in, redirecting to login." } });
            }
            if (response.data.type === "success") {
                setUserType(response.data.data.user_type);
            }
        } catch (err) { 
            setError('An unexpected error occurred. Please contact administrator');
        }
    };

    const handleClosePopup = () => {
        setError(''); // Close the popup by clearing the error message
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Current Password',formData.current_password)
        if (formData.current_password) {
            console.log(formData.current_password)
            console.log('Current password is not null or empty');
            console.log('new password: ', formData.new_password)
            console.log('confirm new password: ', formData.confirm_new_password)
            if(formData.new_password){
                if((formData.new_password === formData.confirm_new_password)) {        
                    console.log('All good. sending to backend');   // wait for axios post request      
                    try {
                        console.log('Trying to update with password change')
                        const response = await axios.post('/api/profile', formData); // format needed. success (200) or error (400)
                        console.log('completed update with password change', response)
                        if (response.status === 200) {
                            alert('User details updated successfully');
                            console.log('User details updated successfully');
                            // navigate to the displaysettings page
                            navigate('/displaysettings', { state: { message: response.message } });
                        }
                    }
                    catch (err) { 
                        if(err.status === 409) {
                            setError(err.response.data.message)}
                        else {
                        setError('An unexpected error occurred while submitting. Please contact administrator');
                        }
                    }
                }  
                else {
                    setError('Passwords do not match');
                    console.log('Passwords do not match');
                }
        }
        else {
            setError('Please enter new password.');
            console.log('Please enter new password.');
        }
        }
        else {
            try {
                console.log('Trying to update without password change')
                const response = await axios.post('/api/profile', formData); // format needed. success (200) or error (400)
                if (response.status === 200) {
                    alert('User details updated successfully');
                    console.log('User details updated successfully');
                    // navigate to the displaysettings page
                    navigate('/displaysettings', { state: { message: response.message } });
                    }
                } catch (err) {
                    setError('An unexpected error occurred while submitting. Please contact administrator');
                }

        }
    };
    const fetchSettingsData = async () => {
        try {
            const response = await axios.get('/api/profile'); // Adjust the URL if needed
            console.log(response);
            setFormData(response.data.data);
        } catch (err) {
            setError('An unexpected error occurred fetching user details.. Please contact administrator');
        }
    };

    useEffect(() => {
        fetchSettingsData();
        fetchLogin();
    }, []);

    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        current_password: '',
        new_password: '',
        confirm_new_password: ''
    });

    const updateFormData = (field, value) => {
        setFormData({
            ...formData,
            [field]: value,
        });
    };

    return (
        <>
            <Flex direction="column" minH="100vh">
                {/* Navbar at the top */}
                 {renderNavbar()}

                {/* Main content area */}
                <Flex flex="1" direction="column" justify="center" align="center" py={10}>
                    <Container maxW="container.md">
                        <VStack spacing={6} align="start">
                            <Heading as="h1" size="xl">Settings</Heading>
                            <Text fontSize="lg">Update your account details</Text>
                            <Box w="100%" bg="gray.50" p={6} borderRadius="md" boxShadow="md">
                                <VStack spacing={4} align="start">
                                    <FormControl>
                                        <FormLabel>First Name</FormLabel>
                                        <Input
                                            type="text"
                                            value={formData.first_name}
                                            onChange={(e) => updateFormData('first_name', e.target.value)}
                                            pattern="[a-zA-Z]*"
                                            title="Please enter a valid name"
                                        />
                                    </FormControl>

                                    <FormControl>
                                        <FormLabel>Last Name</FormLabel>
                                        <Input
                                            type="text"
                                            value={formData.last_name}
                                            onChange={(e) => updateFormData('last_name', e.target.value)}
                                            pattern="[a-zA-Z]*"
                                            title="Please enter a valid name"
                                        />
                                    </FormControl>

                                    <FormControl>
                                        <FormLabel>Email</FormLabel>
                                        <Input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => updateFormData('email', e.target.value)}
                                            pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                                            title="Please enter a valid email address"
                                        />
                                    </FormControl>

                                    <FormControl>
                                        <FormLabel>Current Password</FormLabel>
                                        <Input
                                            type="password"
                                            value={formData.current_password}
                                            onChange={(e) => updateFormData('current_password', e.target.value)}
                                        />
                                    </FormControl>

                                    <FormControl>
                                        <FormLabel>New Password</FormLabel>
                                        <Input
                                            type="password"
                                            value={formData.new_password}
                                            onChange={(e) => updateFormData('new_password', e.target.value)}
                                        />
                                    </FormControl>

                                    <FormControl>
                                        <FormLabel>Confirm New Password</FormLabel>
                                        <Input
                                            type="password"
                                            value={formData.confirm_new_password}
                                            onChange={(e) => updateFormData('confirm_new_password', e.target.value)}
                                        />
                                    </FormControl>

                                    <Button colorScheme="teal" type="submit" onClick={handleSubmit}>
                                        Save Changes
                                    </Button>
                                </VStack>
                            </Box>
                        </VStack>
                        {error && <Text color="red.500">Error: {error}</Text>}
                        <Popup error={error} onClose={handleClosePopup} />
                    </Container>
                </Flex>
                {/* Footer at the bottom */}
                <Footer />
            </Flex>
        </>
    );
};

export default Settings;

