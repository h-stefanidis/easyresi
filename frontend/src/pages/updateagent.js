import React, { useState, useEffect } from "react";
import '../index.css';
import axios from '../axiosConfig';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import Popup from '../components/Popup';
import AdminNavbar from '../components/AdminNavbar';
import { Box, Text, Button, Select, Heading, Flex } from '@chakra-ui/react';
import AgentNavbar from '../components/AgentNavbar';
import NothingNavbar from '../components/NothingNavbar';

const UpdateAgent = () => {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [formData, setFormData] = useState({});
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
    const handleClosePopup = () => {
        setError(''); 
    };

    const fetchLogin = async () => {
        try {
            const response = await axios.get('/auth/login');
            if (response.data.type === "error") {
                setError('User was not logged in, redirecting to login.');
                navigate('/login', { state: { message: "User was not logged in, redirecting to login." } });
            } else if (response.data.type === "success") {
                setUserType(response.data.data.user_type);
                if (response.data.data.user_type !== "admin") {
                    setError('Unauthorized Access. Please log in as administrator.');
                    navigate('/login', { state: { message: "User was not logged in as admin, redirecting to login." } });
                }
            }
        } catch (err) { 
            setError('An unexpected error occurred. Please contact administrator');
        }
    };

    const fetchAgentsAndUsers = async () => {
        try {
            const response = await axios.get('/admin/update_agents');
            setData(response.data.data);
        } catch (error) {
            setError('An unexpected error occurred. Please contact administrator');
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/admin/update_agents', formData);
            if (response.status === 200) {
                navigate('/admindashboard', { state: { data: response.data } });
            }
        } catch (error) {
            setError('An unexpected error occurred. Please contact administrator');
        }
    };

    const updateFormData = (field, value) => {
        setFormData({
            ...formData,
            [field]: value,
        });
    };

    useEffect(() => {
        fetchAgentsAndUsers();
        fetchLogin();
    }, []);

    return (
        <Flex direction="column" minH="100vh">
            {renderNavbar()}

            {/* Main content box, fixed size */}
            <Flex justify="center" align="center" flex="1">
                <Box 
                    w={{ base: "90%", md: "70%", lg: "50%" }} 
                    maxW="500px" // Prevents the box from stretching beyond a certain width
                    p={8} 
                    borderWidth="1px" 
                    borderRadius="lg" 
                    boxShadow="lg" 
                    bg="white"
                    mb={8}
                >
                    <Heading as="h2" size="lg" mb={6} textAlign="center">
                        Update Users to Agent
                    </Heading>

                    <form onSubmit={handleFormSubmit}>
                        <Text fontSize="lg" mb={2}>Select an Agent</Text>
                        <Select
                            placeholder="Select an agent"
                            onChange={(e) => updateFormData("agent_id", e.target.value)}
                            mb={4}
                        >
                            {data.agents && data.agents.length > 0 ? (
                                data.agents.map(agent => (
                                    <option key={agent.user_id} value={agent.user_id}>
                                        {`${agent.firstname} ${agent.lastname}`}
                                    </option>
                                ))
                            ) : (
                                <option disabled>Loading agents...</option>
                            )}
                        </Select>

                        <Text fontSize="lg" mb={2}>Select a User</Text>
                        <Select
                            placeholder="Select a user"
                            onChange={(e) => updateFormData("user_id", e.target.value)}
                            mb={6}
                        >
                            {data.users && data.users.length > 0 ? (
                                data.users.map(user => (
                                    <option key={user.user_id} value={user.user_id}>
                                        {`${user.firstname} ${user.lastname}`}
                                    </option>
                                ))
                            ) : (
                                <option disabled>Loading users...</option>
                            )}
                        </Select>

                        <Button colorScheme="teal" width="full" type="submit" size="lg">
                            Update Agent
                        </Button>
                    </form>
                </Box>
            </Flex>

            <Popup error={error} onClose={handleClosePopup} />

            {/* Footer */}
            <Footer />
        </Flex>
    );
};

export default UpdateAgent;
