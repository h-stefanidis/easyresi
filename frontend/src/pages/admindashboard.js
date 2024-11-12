import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import AdminNavbar from '../components/AdminNavbar';
import { Button, Table, Thead, Tbody, Tr, Th, Td, TableContainer, Heading, Box, Text, Flex } from '@chakra-ui/react';
import Footer from '../components/Footer';
import AgentNavbar from '../components/AgentNavbar';
import NothingNavbar from '../components/NothingNavbar';
import Popup from '../components/Popup';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
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
            if (response.data.type === 'error') {
                setError('User was not logged in, redirecting to login...');
                navigate('/login', { state: { message: 'User was not logged in, redirecting to login...' } });
            }
            if (response.data.type === 'success') {
                setUserType(response.data.data.user_type);
                if (response.data.data.user_type !== 'admin') {
                    navigate('/login', { state: { message: 'User was not logged in as admin, redirecting to login...' } });
                }
            }
        } catch (err) {
            setError('Unexpected error occurred. Please contact administrator.');
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await axios.get('/api/get_all_records');
            const sortedData = response.data.sort((a, b) => a.data.user_id - b.data.user_id);
            setData(sortedData || []);
        } catch (err) {
            setError('Unexpected error occurred. Please contact administrator.');
        }
    };

    const handleEdit = (user_id) => {
        sessionStorage.setItem('edit_user_id', user_id);
        navigate(`/adminedituser`);
    };

    const handleDelete = async (user_id) => {
        try {
            await axios.delete(`/api/delete_user/${user_id}`);
            fetchUsers();
        } catch (err) {
            setError('Failed to delete user. Please contact administrator.');
        }
    };

    useEffect(() => {
        fetchLogin();
        fetchUsers();
    }, []);

    return (
        <Flex direction="column" minH="100vh">
            {renderNavbar()}
            <Box flex="1" px={6} py={8}>
                <Heading as="h1" size="xl" mb={8} textAlign="center">
                    Administrator Dashboard
                </Heading>

                <Box maxW="1200px" mx="auto" bg="white" p={6} borderRadius="md" boxShadow="lg">
                    <Heading as="h2" size="lg" mb={4}>
                        Users
                    </Heading>
                    {data.length > 0 ? (
                        <TableContainer>
                            <Table variant="simple">
                                <Thead bg="gray.100">
                                    <Tr>
                                        <Th>First Name</Th>
                                        <Th>Last Name</Th>
                                        <Th>Email</Th>
                                        <Th>User Type</Th>
                                        <Th>Actions</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {data.map((user) => (
                                        <Tr key={user.data.user_id}>
                                            <Td>{user.data.first_name}</Td>
                                            <Td>{user.data.last_name}</Td>
                                            <Td>{user.data.email}</Td>
                                            <Td>{user.data.user_type}</Td>
                                            <Td>
                                                <Button colorScheme="teal" size="sm" mr={2} onClick={() => handleEdit(user.data.user_id)}>
                                                    Edit
                                                </Button>
                                                <Button colorScheme="red" size="sm" onClick={() => handleDelete(user.data.user_id)}>
                                                    Delete
                                                </Button>
                                            </Td>
                                        </Tr>
                                    ))}
                                </Tbody>
                            </Table>
                        </TableContainer>
                    ) : (
                        <Text>No user data available.</Text>
                    )}
                </Box>
            </Box>

            <Popup error={error} onClose={handleClosePopup} />
            <Footer />
        </Flex>
    );
};

export default AdminDashboard;
