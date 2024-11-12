import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig';
import Popup from '../components/Popup';
import Navbar from '../components/Navbar';
import AdminNavbar from '../components/AdminNavbar';
import AgentNavbar from '../components/AgentNavbar';
import NothingNavbar from '../components/NothingNavbar';
import Footer from '../components/Footer'; 
import { useNavigate } from 'react-router-dom';
import {
  ChakraProvider,
  Box,
  CircularProgress,
  CircularProgressLabel,
  VStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Heading,
  Text,
  Flex,
  Divider,
  Icon,
  Button,
} from '@chakra-ui/react';
import { InfoIcon } from '@chakra-ui/icons';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [progressState, setProgressState] = useState({
    percentage: null,
    isIndeterminate: true,
    color: 'blue.300',
    thickness: '12px',
    size: '200px',
  });
  const [userType, setUserType] = useState('');
  const [occupations, setOccupations] = useState([]);
  const [isQuestionnaireFilled, setIsQuestionnaireFilled] = useState(null); // To store the questionnaire submission status
  const loggedInUser = sessionStorage.getItem('user_id');
  const checkingUser = sessionStorage.getItem('checking_user_id');
  const navigate = useNavigate();

  const renderNavbar = () => {
    switch (userType) {
      case 'admin':
        return <AdminNavbar />;
      case 'agent':
        return <AgentNavbar />;
      case 'applicant':
        return <Navbar />;
      default:
        return <NothingNavbar />;
    }
  };

   // Function to check if the questionnaire is filled
   const checkQuestionnaireSubmission = async () => {
    try {
        
        const userIdToFetch = checkingUser || loggedInUser;
        const response = await axios.get(`/api/check_questionnaire_submission/${userIdToFetch}`);
        if (response.data.type === 'success') {
            setIsQuestionnaireFilled(true);
        } else {
            setIsQuestionnaireFilled(false);
        }
    } catch (err) {
        if(err.status === 404) {
            setError('Unable to load dashboard. Please complete the permanent residency questionnaire to get recommendations')}
        else {
        setError('An unexpected error occurred while fetching data. Please contact administrator');
        }
    }
};

  const fetchLogin = async () => {
    try {
      const response = await axios.get('/auth/login');
      if (response.data.type === 'error') {
        setError('User was not logged in, redirecting to login.');
        navigate('/login', {
          state: { message: 'User was not logged in, redirecting to login.' },
        });
      } else if (response.data.type === 'success') {
        setUserType(response.data.data.user_type);
        if (response.data.data.user_type === 'admin') {
          navigate('/admindashboard', { state: { message: 'Admin detected' } });
        }
      }
    } catch (err) {
      setError('An unexpected error occurred. Please contact the administrator.');
    }
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
      const allOccupations = Object.values(occupations).flatMap((category) => category);
      for (const occupation of allOccupations) {
        if (Number(occupation.anzsco) === anzscoNumber) {
          return occupation.occupation;
        }
      }
    }
    return 'Unknown Job Title';
  };

  const fetchProbability = async () => {
    try {
      const userIdToFetch = checkingUser || loggedInUser;
      const response = await axios.get(`/api/recommendations/${userIdToFetch}`);
      const percent = Math.round(response.data.data.probability_of_permanent_residency * 100) / 100;
      setData(response.data.data);
      updateProgress(percent, false, 'purple.400', '200px', '12px');
    } catch (err) {
      setError('Failed to load dashboard data. Please try again later.');
      updateProgress(100, true, 'red.400', '200px', '12px');
    }
  };

  const updateProgress = (percentage, isIndeterminate, color, size, thickness) => {
    setProgressState({ percentage, isIndeterminate, color, size, thickness });
  };

  const handleClosePopup = () => {
    setError('');
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
    checkQuestionnaireSubmission(); // Check questionnaire submission status
}, []);

useEffect(() => {
    if (isQuestionnaireFilled) {
        fetchQuest();
        fetchProbability();
    }
}, [isQuestionnaireFilled]);

  return (
    <ChakraProvider>
      <Flex direction="column" minH="100vh">
        {renderNavbar()}
        {isQuestionnaireFilled ? (
        <Box flex="1" py={8} px={4}>
          <VStack spacing={8} align="start" maxW="1200px" mx="auto">
            <Heading as="h1" size="xl">
              Dashboard
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
              <Text mt={4}>
                <Icon as={InfoIcon} mr={2} />
                This percentage represents your likelihood based on our analysis.
              </Text>
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

            {/* Cost of Living */}
            <Box
              w="full"
              p={6}
              bg="white"
              borderRadius="lg"
              boxShadow="md"
              borderWidth="1px"
            >
              <Heading as="h2" size="lg" mb={4}>
                Cost of Living Annual Fee
              </Heading>
              {data && data.cost_of_living ? (
                <Table variant="simple" colorScheme="gray">
                  <Thead bg="gray.200">
                    <Tr>
                      <Th>Cost of Living</Th>
                      <Th>Annual Fee</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {Object.entries(data.cost_of_living).map(([key, value]) => (
                      <Tr key={key} _hover={{ bg: 'gray.50' }}>
                        <Td>{key === 'min_cost' ? 'Minimum Cost' : key === 'max_cost' ? 'Maximum Cost' : key}</Td>
                        <Td>${value}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              ) : (
                <Text>No data available for cost of living annual fee.</Text>
              )}
            </Box>
          </VStack>
        </Box>) : (
                    <Box minH="100vh" flex="1" display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                        <Heading as="h2" size="lg">Please complete the permanent residency questionnaire to get recommendations</Heading>
                        <br />
                        <Button colorScheme="teal" onClick={() => navigate('/questionnaire')}>
                            Go to Questionnaire
                        </Button>
                    </Box>
                )}
        <Popup error={error} onClose={handleClosePopup} />
        <Footer />
      </Flex>
    </ChakraProvider>
  );
};

export default Dashboard;