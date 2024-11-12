import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig';
import Popup from '../components/Popup';
import Navbar from '../components/Navbar';
import AdminNavbar from '../components/AdminNavbar';
import AgentNavbar from '../components/AgentNavbar';
import NothingNavbar from '../components/NothingNavbar';
import Footer from '../components/Footer';
import { ChakraProvider, Box, CircularProgress, CircularProgressLabel, Button, Table, Thead, Tbody, Tr, Th, Td, Heading, VStack, Text, Divider } from '@chakra-ui/react';
import { useNavigate, useLocation } from 'react-router-dom';

const Dashpreview = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const locationData = location.state?.data;
    const loggedInUser = sessionStorage.getItem('user_id');
    const checkingUser = sessionStorage.getItem('checking_user_id');
    const [error, setError] = useState('');
    const [progressState, setProgressState] = useState({
        percentage: null,
        isIndeterminate: true,
        color: 'blue.300',
        thickness: '12px',
        size: '200px',
    });
    const [data, setData] = useState(null);
    const [occupations, setOccupations] = useState([]);
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
        setError(''); // Close the popup by clearing the error message
    };

    const fetchLogin = async () => {
        try {
            const response = await axios.get('/auth/login');
            if (response.data.type === "error") {
                setError('User was not logged in, redirecting to login.');
                navigate('/login', { state: { message: "User was not logged in, redirecting to login..." } });
            }
            if (response.data.type === "success") {
                setUserType(response.data.data.user_type);
                if (response.data.data.user_type === "admin") {
                    navigate('/admindashboard', { state: { message: "Admin detected" } });
                }
            }
        } catch (err) {
            setError('Unable to submit your responses. Please try again later.');
        }
    };

    const updateProgress = (percentage, isIndeterminate, color, size, thickness) => {
        setProgressState({ percentage, isIndeterminate, color, size, thickness });
    };

    const displayProbability = async () => {
        updateProgress(null, true, 'blue.300', '200px', '12px');
        try {
            const percent = Math.round(locationData.data.probability_of_permanent_residency * 100) / 100;
            updateProgress(percent, false, 'purple.400', '200px', '12px');
            setData(locationData.data);
        } catch (err) {
            setError('Unable to submit your responses. Please try again later.');
            updateProgress(100, false, 'red.400', '200px', '12px');
        }
    };

    const handleAccept = async (e) => {
        e.preventDefault();
        try {
            const userIdToFetch = checkingUser || loggedInUser;
            if (!userIdToFetch) {
                throw new Error('User ID is missing');
            }

            const userInput = locationData?.data?.user_input_for_prefill_or_save;
            if (!userInput) {
                setError('User input data is missing');
            }

            const response = await axios.post(`/api/questionnaire/${userIdToFetch}`, userInput);

            if (response.status === 200) {
                navigate('/dashboard');
            } else {
                setError('Unable to submit your responses. Please try again later.');
            }
        } catch (error) {
            setError('Unable to submit your responses. Please try again later.');
        }
    };

    const handleRevert = async (e) => {
        e.preventDefault();
        navigate('/questionnaire', { state: { data: locationData.data.user_input_for_prefill_or_save } });
    };

    const fetchQuest = async () => {
        try {
            const userIdToFetch = checkingUser || loggedInUser;
            const response = await axios.get(`/api/questionnaire/${userIdToFetch}`);
            setOccupations(response.data.data.occupations);
        } catch (err) {
            setError('Failed to load occupations. Please try again later.');
        }
    };

    const getJobTitleByAnzsco = (anzsco) => {
        const anzscoNumber = Number(anzsco);
        if (occupations && typeof occupations === 'object') {
            const allOccupations = Object.values(occupations).flatMap(category => category);
            for (const occupation of allOccupations) {
                if (Number(occupation.anzsco) === anzscoNumber) {
                    return occupation.occupation;
                }
            }
        }
        return 'Unknown Job Title';
    };

    const highlightHighestProbability = (entries) => {
        const maxProbability = Math.max(...Object.values(entries));
        return Object.entries(entries).map(([key, probability]) => ({
            key,
            probability,
            isHighest: probability === maxProbability,
        }));
    };

    useEffect(() => {
        fetchLogin();
        fetchQuest();
        displayProbability();
    }, []);

    return (
        <ChakraProvider>
            {renderNavbar()}
            <Box flex="1" py={8} px={4}>
                <VStack spacing={8} align="start" maxW="1200px" mx="auto">
                    <Heading as="h1" size="xl">
                        Preview Results
                    </Heading>

                    {/* Circular Progress for Residency Probability */}
                    <Box
                        w="full"
                        p={6}
                        bg="white"
                        borderRadius="lg"
                        boxShadow="md"
                        borderWidth="1px"
                        textAlign="center"
                    >
                        <Heading as="h2" size="lg" mb={4}>
                            Your Chances of Getting Permanent Residency
                        </Heading>
                        <CircularProgress
                            value={progressState.percentage}
                            color={progressState.color}
                            thickness={progressState.thickness}
                            size={progressState.size}
                            isIndeterminate={progressState.isIndeterminate}
                        >
                            <CircularProgressLabel>{progressState.percentage}%</CircularProgressLabel>
                        </CircularProgress>
                    </Box>

                    {/* Probability for Other Occupations */}
                    <Box
                        w="full"
                        p={6}
                        bg="white"
                        borderRadius="lg"
                        boxShadow="md"
                        borderWidth="1px"
                    >
                        <Heading as="h2" size="lg" mb={4}>
                            Probability for Other Occupations
                        </Heading>
                        {data && data.probability_of_other_jobs ? (
                            <Table variant="simple" colorScheme="gray">
                                <Thead bg="gray.200">
                                    <Tr>
                                        <Th>ANZSCO</Th>
                                        <Th>Job Title</Th>
                                        <Th>Probability (%)</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {highlightHighestProbability(data.probability_of_other_jobs).map(
                                        ({ key, probability, isHighest }) => (
                                            <Tr key={key} _hover={{ bg: 'gray.50' }}>
                                                <Td>{key}</Td>
                                                <Td>{getJobTitleByAnzsco(key)}</Td>
                                                <Td color={isHighest ? 'green.500' : 'inherit'}>{probability}</Td>
                                            </Tr>
                                        )
                                    )}
                                </Tbody>
                            </Table>
                        ) : (
                            <Text>No data available for probabilities of other jobs.</Text>
                        )}
                    </Box>

                    {/* Probability of Other States */}
                    <Box
                        w="full"
                        p={6}
                        bg="white"
                        borderRadius="lg"
                        boxShadow="md"
                        borderWidth="1px"
                    >
                        <Heading as="h2" size="lg" mb={4}>
                            Probability of Other States
                        </Heading>
                        {data && data.probability_of_other_states ? (
                            <Table variant="simple" colorScheme="gray">
                                <Thead bg="gray.200">
                                    <Tr>
                                        <Th>State</Th>
                                        <Th>Probability (%)</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {highlightHighestProbability(data.probability_of_other_states).map(
                                        ({ key, probability, isHighest }) => (
                                            <Tr key={key} _hover={{ bg: 'gray.50' }}>
                                                <Td>{key}</Td>
                                                <Td color={isHighest ? 'green.500' : 'inherit'}>{probability}</Td>
                                            </Tr>
                                        )
                                    )}
                                </Tbody>
                            </Table>
                        ) : (
                            <Text>No data available for probabilities of other states.</Text>
                        )}
                    </Box>

                    {/* Divider */}
                    <Divider orientation="horizontal" />

                    {/* University Recommendations Based on Fee */}
                    <Box
                        w="full"
                        p={6}
                        bg="white"
                        borderRadius="lg"
                        boxShadow="md"
                        borderWidth="1px"
                    >
                        <Heading as="h2" size="lg" mb={4}>
                            University Recommendations Based on Fee
                        </Heading>
                        {data && data.uni_recommendations_based_on_fee ? (
                            <Table variant="simple" colorScheme="gray">
                                <Thead bg="gray.200">
                                    <Tr>
                                        <Th>Course</Th>
                                        <Th>University</Th>
                                        <Th>Fee</Th>
                                        <Th>Duration (Years)</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {data.uni_recommendations_based_on_fee.map((uni, index) => (
                                        <Tr key={index} _hover={{ bg: 'gray.50' }}>
                                            <Td>{uni.course}</Td>
                                            <Td>{uni.uni}</Td>
                                            <Td>${uni.fee}</Td>
                                            <Td>{uni.duration}</Td>
                                        </Tr>
                                    ))}
                                </Tbody>
                            </Table>
                        ) : (
                            <Text>No university recommendations based on fee available.</Text>
                        )}
                    </Box>

                    {/* University Recommendations Based on Rank */}
                    <Box
                        w="full"
                        p={6}
                        bg="white"
                        borderRadius="lg"
                        boxShadow="md"
                        borderWidth="1px"
                    >
                        <Heading as="h2" size="lg" mb={4}>
                            University Recommendations Based on Rank
                        </Heading>
                        {data && data.uni_recommendations_based_on_rank ? (
                            <Table variant="simple" colorScheme="gray">
                                <Thead bg="gray.200">
                                    <Tr>
                                        <Th>Course</Th>
                                        <Th>University</Th>
                                        <Th>Rank</Th>
                                        <Th>Fee</Th>
                                        <Th>Duration (Years)</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {data.uni_recommendations_based_on_rank.map((uni, index) => (
                                        <Tr key={index} _hover={{ bg: 'gray.50' }}>
                                            <Td>{uni.course}</Td>
                                            <Td>{uni.uni}</Td>
                                            <Td>{uni.uni_rank}</Td>
                                            <Td>${uni.fee}</Td>
                                            <Td>{uni.duration}</Td>
                                        </Tr>
                                    ))}
                                </Tbody>
                            </Table>
                        ) : (
                            <Text>No university recommendations based on rank available.</Text>
                        )}
                    </Box>

                    {/* Accept and Revert Buttons */}
                    <Box>
                        <Button
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
                                border: 'none',
                                _hover: { backgroundColor: '#003366', transform: 'scale(1.05)' },
                                _focus: { outline: 'none', boxShadow: '0 0 0 3px rgba(66, 153, 225, 0.6)' },
                            }}
                            onClick={handleAccept}
                        >
                            Accept Results
                        </Button>
                        <Button
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
                                border: 'none',
                                _hover: { backgroundColor: '#003366', transform: 'scale(1.05)' },
                                _focus: { outline: 'none', boxShadow: '0 0 0 3px rgba(66, 153, 225, 0.6)' },
                            }}
                            onClick={handleRevert}
                        >
                            Revert
                        </Button>
                    </Box>
                </VStack>
            </Box>

            <Popup error={error} onClose={handleClosePopup} />
            <Footer />
        </ChakraProvider>
    );
};

export default Dashpreview;
