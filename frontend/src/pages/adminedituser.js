import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig';
import { useNavigate } from 'react-router-dom';
import Popup from '../components/Popup';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { Box, Heading, Button, Input, Select, Table, Thead, Tbody, Tr, Th, Td, Flex } from '@chakra-ui/react';
import AdminNavbar  from '../components/AdminNavbar';
import AgentNavbar from '../components/AgentNavbar';
import NothingNavbar from '../components/NothingNavbar';

const AdminEditUser = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState('');
    const editUserId = sessionStorage.getItem('edit_user_id');
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

    // Admin fetchlogin (apply to all admin pages)
    const fetchLogin = async () => {
        try {
            const response = await axios.get('/auth/login');
            if (response.data.type === 'error') {
                navigate('/login', { state: { message: 'User was not logged in, redirecting to login...' } });
            }
            if (response.data.type === 'success') {
                setUserType(response.data.data.user_type);
                if (response.data.data.user_type !== 'admin') {
                    navigate('/login', { state: { message: 'User was not logged in as admin, redirecting to login...' } });
                }
            }
        } catch (err) {}
    };

    const fetchUserData = async () => {
        if (editUserId) {
            try {
                const response = await axios.get(`/api/get_user/${editUserId}`);
                setUserData(response.data);
            } catch (err) {
                setError('Failed to load user data. Please contact administrator.');
            }
        }
    };

    const handleSubmit = async () => {
        try {
            const response = await axios.put(`/api/update_user/${editUserId}`, userData);
            navigate('/admindashboard'); // Redirect after successful update
        } catch (err) {
            setError('Failed to update user data. Please contact administrator.');
        }
    };

    useEffect(() => {
        fetchLogin();
        fetchUserData();
    }, []);

    return (
        <Flex direction="column" minH="100vh">
            {renderNavbar()}
            
            <Box flex="1" p={8} maxW="900px" mx="auto">
                <Heading as="h1" size="xl" mb={6} textAlign="center">
                    Edit User Information
                </Heading>

                <Box bg="white" p={8} borderRadius="md" boxShadow="lg">
                    <Heading as="h2" size="lg" mb={6}>
                        User Information
                    </Heading>

                    {userData ? (
                        <Table variant="simple" mb={6}>
                            <Thead>
                                <Tr>
                                    <Th>First Name</Th>
                                    <Th>Last Name</Th>
                                    <Th>Email</Th>
                                    <Th>User Type</Th>
                                    <Th>Actions</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                <Tr>
                                    <Td>
                                        <Input
                                            type="text"
                                            value={userData.first_name}
                                            onChange={(e) => setUserData({ ...userData, first_name: e.target.value })}
                                        />
                                    </Td>
                                    <Td>
                                        <Input
                                            type="text"
                                            value={userData.last_name}
                                            onChange={(e) => setUserData({ ...userData, last_name: e.target.value })}
                                        />
                                    </Td>
                                    <Td>
                                        <Input
                                            type="email"
                                            value={userData.email}
                                            onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                                        />
                                    </Td>
                                    <Td>
                                        {userData.user_type === 'admin' || userData.user_type === 'Admin' ? (
                                            <Input
                                                value={userData.user_type}
                                                readOnly
                                                bg="gray.100"
                                                border="none"
                                            />
                                        ) : (
                                            <Select
                                                value={userData.user_type}
                                                onChange={(e) => setUserData({ ...userData, user_type: e.target.value })}
                                            >
                                                <option value="Applicant">Applicant</option>
                                                <option value="Agent">Agent</option>
                                            </Select>
                                        )}
                                    </Td>
                                    <Td>
                                        <Button colorScheme="blue" onClick={handleSubmit}>
                                            Submit
                                        </Button>
                                    </Td>
                                </Tr>
                            </Tbody>
                        </Table>
                    ) : (
                        <Box textAlign="center" p={6}>
                            <Heading as="h3" size="md">
                                No user data available.
                            </Heading>
                        </Box>
                    )}

                    <Flex justify="center" mt={8}>
                        <Button colorScheme="teal" onClick={() => navigate('/admindashboard')}>
                            Go Back
                        </Button>
                    </Flex>
                </Box>
            </Box>

            <Popup error={error} onClose={handleClosePopup} />
            <Footer />
        </Flex>
    );
};

export default AdminEditUser;

