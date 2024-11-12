import React, { useState, useEffect } from "react";
import '../index.css';
import axios from '../axiosConfig';  // Assuming axios is configured for API requests
import {
  Box, FormControl, FormLabel, Select, RadioGroup, Radio, Button, Stack, Tooltip, IconButton, Divider
} from '@chakra-ui/react';
import { InfoIcon } from '@chakra-ui/icons';  // Import the info icon for tooltips
import Navbar from '../components/Navbar';
import Footer from '../components/Footer'; 
import AdminNavbar from '../components/AdminNavbar';
import AgentNavbar from '../components/AgentNavbar';
import NothingNavbar from '../components/NothingNavbar';
import { useNavigate, useLocation } from 'react-router-dom';
import Popup from '../components/Popup';

const Questionnaire = () => {
    // Navigation and error
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const loggedInUser = sessionStorage.getItem('user_id');
    const checkingUser = sessionStorage.getItem('checking_user_id');
    // Form states
    const [formData, setFormData] = useState({});
    const [preferredIndustry, setPreferredIndustry] = useState('');

    // Location and data
    const location = useLocation();
    const locationData = location.state?.data;
    const [prefillData, setPrefillData] = useState({}); 
    const [occupations, setOccupations] = useState({});
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
                setError('User was not logged in, redirecting to login.')
                console.log('User not logged in')
                navigate('/login', { state: { message: "User was not logged in, redirecting to login." } });
            }
            if (response.data.type === "success") {
                setUserType(response.data.data.user_type);
                if (response.data.data.user_type === "admin") {
                    navigate('/admindashboard', { state: { message: "Admin detected" } });
                }
            }
        } catch (err) { 
            setError('An unexpected error occurred. Please contact administrator');
        }
    };
  
      // Fetch data when the component mounts
    const fetchOccupations = async () => {
            try {
                const userIdToFetch = checkingUser || loggedInUser;
                const response = await axios.get(`/api/questionnaire/${userIdToFetch}`); // API call for data
                const occupationData = response.data.data.occupations;
                setOccupations(occupationData);
              } catch (error) {
                setError('An unexpected error occurred fetching occupations. Please contact administrator');
            }
        };

    // Fetch data when the component mounts
    const checkPrefill = async () => {
        if (locationData) { // If location data is available
            console.log('prefilling using location data:', locationData);
            setPrefillData(locationData);
            console.log(locationData)
            setFormData(locationData); // Prefill form with location data
            setPreferredIndustry(locationData.preferredIndustry)
        } else {
            try {
                const userIdToFetch = checkingUser || loggedInUser;
                const response = await axios.get(`/api/questionnaire/${userIdToFetch}`); // API call for data
                console.log('Using API data:', response.data.data.prefill_data);
                if(response.data.data.prefill_data){
                setPrefillData(response.data.data.prefill_data);
                setFormData(response.data.data.prefill_data);
                setPreferredIndustry(response.data.data.prefill_data.preferredIndustry)
                } // Prefill form with API data
            } catch (error) {
                setError('An unexpected error occurred while prefilling. Please contact administrator');
            }
        }
    };

    // Handle form submission using axios to send data to backend
    const handleFormSubmit = async (e) => {
      formData.preferredCourse = 'TBD'
        e.preventDefault();
        try {
            const userIdToFetch = checkingUser || loggedInUser;
            const response = await axios.post(`/api/preview_results/${userIdToFetch}`, formData); // Submit form data
            console.log('Success:', response.data);
            if (response.status === 200) {
                navigate('/dashpreview', { state: { data: response.data } });
            } else {
                setError(response.data.message);
            }
        } catch (error) {
            setError('An unexpected error occurred submitting your response. Please contact administrator');
        }
    };

    // Update form data state
    const updateFormData = (field, value) => {
        setFormData({
            ...formData,
            [field]: value,
        });
        console.log('Form Data: ', formData)
    };

    const getOccupationsForIndustry = () => {
      if (occupations && preferredIndustry) {
          return occupations[preferredIndustry] || [];
      }
      return [];
  };

    useEffect(() => {
        fetchLogin();
        fetchOccupations();
        checkPrefill();
        console.log('Form Data: ',formData)
        
    }, []);

    return (
        <>
            {renderNavbar()}
            <h1 className="PR-Header">Permanent Residency Questionnaire</h1>
            <Box maxW="75%" mx="auto" mt={8} mb={12} p={6} borderWidth="1px" borderRadius="lg" boxShadow="lg" bg="#F9FAFC" borderColor="#E2E8F0">
                <form onSubmit={handleFormSubmit}>
                    {/* Visa Subclass Selection */}
                    <FormControl isRequired mb={4}>
                        <FormLabel fontWeight="bold" fontSize="lg" color="gray.700">
                            Which visa subclass are you applying for?
                            <Tooltip label="Select the visa category you are applying for." fontSize="md">
                                <IconButton variant="ghost" aria-label="Info" icon={<InfoIcon />} size="sm" />
                            </Tooltip>
                        </FormLabel>
                        <RadioGroup
                            value={formData.visaType || ''}
                            onChange={(value) => updateFormData('visaType', value)}
                        >
                            <Stack direction="column">
                                <Radio value="189" fontSize="lg" color="gray.600">Skilled Independent Visa (Subclass 189)</Radio>
                                <Radio value="190" fontSize="lg" color="gray.600">Skilled Nominated Visa (Subclass 190)</Radio>
                                <Radio value="491" fontSize="lg" color="gray.600">Skilled Work Regional (Subclass 491)</Radio>
                            </Stack>
                        </RadioGroup>
                    </FormControl>
                    <Divider my={4} borderColor="gray.300" />

                    {/* Age Selection */}
                    <FormControl isRequired mb={4}>
                        <FormLabel fontWeight="bold" fontSize="lg" color="gray.700">
                            Please select your age range at the time of invitation:
                            <Tooltip label="Your age range when you receive your invitation." fontSize="md">
                                <IconButton variant="ghost" aria-label="Info" icon={<InfoIcon />} size="sm" />
                            </Tooltip>
                        </FormLabel>
                        <Select
                            value={formData.age || ''}
                            onChange={(e) => updateFormData('age', e.target.value)}
                            fontSize="lg" color="gray.600"
                        >
                            <option value="">Please select an option</option>
                            <option value="18-25">At least 18 but less than 25 years</option>
                            <option value="25-33">At least 25 but less than 33 years</option>
                            <option value="33-40">At least 33 but less than 40 years</option>
                            <option value="40-45">At least 40 but less than 45 years</option>
                        </Select>
                    </FormControl>
                    <Divider my={4} borderColor="gray.300" />

                    {/* English Proficiency */}
                    <FormControl isRequired mb={4}>
                        <FormLabel fontWeight="bold" fontSize="lg" color="gray.700">
                            What is your level of English proficiency?
                            <Tooltip label="Select the level of English proficiency you possess." fontSize="md">
                                <IconButton variant="ghost" aria-label="Info" icon={<InfoIcon />} size="sm" />
                            </Tooltip>
                        </FormLabel>
                        <Select
                            value={formData.englishProficiency || ''}
                            onChange={(e) => updateFormData('englishProficiency', e.target.value)}
                            fontSize="lg" color="gray.600"
                        >
                            <option value="">Please select an option</option>
                            <option value="competent">Competent English</option>
                            <option value="proficient">Proficient English</option>
                            <option value="superior">Superior English</option>
                        </Select>
                    </FormControl>
                    <Divider my={4} borderColor="gray.300" />

                    {/* Overseas Skilled Employment Experience */}
                    <FormControl isRequired mb={4}>
                        <FormLabel fontWeight="bold" fontSize="lg" color="gray.700">
                            How many years of skilled employment experience do you have outside of Australia in your nominated occupation (within the last 10 years)?
                            <Tooltip label="Enter the number of years of skilled employment experience outside Australia." fontSize="md">
                                <IconButton variant="ghost" aria-label="Info" icon={<InfoIcon />} size="sm" />
                            </Tooltip>
                        </FormLabel>
                        <Select
                            value={formData.overseasExperience || ''}
                            onChange={(e) => updateFormData('overseasExperience', e.target.value)}
                            fontSize="lg" color="gray.600"
                        >
                            <option value="">Please select an option</option>
                            <option value="0">Less than 3 years</option>
                            <option value="3-5">At least 3 but less than 5 years</option>
                            <option value="5-8">At least 5 but less than 8 years</option>
                            <option value="8+">At least 8 years</option>
                        </Select>
                    </FormControl>
                    <Divider my={4} borderColor="gray.300" />

                    {/* Australian Skilled Employment Experience */}
                    <FormControl isRequired mb={4}>
                        <FormLabel fontWeight="bold" fontSize="lg" color="gray.700">
                            How many years of skilled employment experience do you have in Australia in your nominated occupation (within the last 10 years)?
                            <Tooltip label="Enter the number of years of skilled employment experience in Australia." fontSize="md">
                                <IconButton variant="ghost" aria-label="Info" icon={<InfoIcon />} size="sm" />
                            </Tooltip>
                        </FormLabel>
                        <Select
                            value={formData.australiaExperience || ''}
                            onChange={(e) => updateFormData('australiaExperience', e.target.value)}
                            fontSize="lg" color="gray.600"
                        >
                            <option value="">Please select an option</option>
                            <option value="0">Less than 1 year</option>
                            <option value="1-3">At least 1 but less than 3 years</option>
                            <option value="3-5">At least 3 but less than 5 years</option>
                            <option value="5-8">At least 5 but less than 8 years</option>
                            <option value="8+">At least 8 years</option>
                        </Select>
                    </FormControl>
                    <Divider my={4} borderColor="gray.300" />

                    {/* Australian Study Requirement */}
                    <FormControl mb={4}>
                        <FormLabel fontWeight="bold" fontSize="lg" color="gray.700">
                            Have you met the Australian Study Requirement?
                            <Tooltip label="Do you have at least 1 degree, diploma, or trade qualification from Australia?" fontSize="md">
                                <IconButton variant="ghost" aria-label="Info" icon={<InfoIcon />} size="sm" />
                            </Tooltip>
                        </FormLabel>
                        <Select
                            value={formData.australianStudy || ''}
                            onChange={(e) => updateFormData('australianStudy', e.target.value)}
                            fontSize="lg" color="gray.600"
                        >
                            <option value="">Please select an option</option>
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                        </Select>
                    </FormControl>
                    <Divider my={4} borderColor="gray.300" />

                    {/* Specialist Education Qualification */}
                    <FormControl mb={4}>
                        <FormLabel fontWeight="bold" fontSize="lg" color="gray.700">
                            Have you completed a Master's degree by research or Doctorate in STEM or ICT?
                            <Tooltip label="Select if you've completed advanced degrees in Australia in the STEM or ICT fields." fontSize="md">
                                <IconButton variant="ghost" aria-label="Info" icon={<InfoIcon />} size="sm" />
                            </Tooltip>
                        </FormLabel>
                        <Select
                            value={formData.specialistEducation || ''}
                            onChange={(e) => updateFormData('specialistEducation', e.target.value)}
                            fontSize="lg" color="gray.600"
                        >
                            <option value="">Please select an option</option>
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                        </Select>
                    </FormControl>
                    <Divider my={4} borderColor="gray.300" />

                    {/* Educational Qualification */}
                    <FormControl isRequired mb={4}>
                        <FormLabel fontWeight="bold" fontSize="lg" color="gray.700">
                            What is your highest level of educational qualification?
                            <Tooltip label="Select the highest level of educational qualification you possess." fontSize="md">
                                <IconButton variant="ghost" aria-label="Info" icon={<InfoIcon />} size="sm" />
                            </Tooltip>
                        </FormLabel>
                        <Select
                            value={formData.education || ''}
                            onChange={(e) => updateFormData('education', e.target.value)}
                            fontSize="lg" color="gray.600"
                        >
                            <option value="">Please select an option</option>
                            <option value="phd">Doctorate (PhD or a Masters Degree by Research)</option>
                            <option value="bachelor">Masters Degree by Coursework or a Bachelor’s Degree</option>
                            <option value="diploma">Diploma/Trade Qualification</option>
                            <option value="qualification">Qualification for Nominated Skilled Occupation</option>
                        </Select>
                    </FormControl>
                    <Divider my={4} borderColor="gray.300" />

                    {/* Professional Year in Australia */}
                    <FormControl mb={4}>
                        <FormLabel fontWeight="bold" fontSize="lg" color="gray.700">
                            Have you completed a Professional Year in Australia in Accounting, ICT, or Engineering?
                            <Tooltip label="Have you completed a Professional Year in Australia in one of the fields?" fontSize="md">
                                <IconButton variant="ghost" aria-label="Info" icon={<InfoIcon />} size="sm" />
                            </Tooltip>
                        </FormLabel>
                        <Select
                            value={formData.professionalYear || ''}
                            onChange={(e) => updateFormData('professionalYear', e.target.value)}
                            fontSize="lg" color="gray.600"
                        >
                            <option value="">Please select an option</option>
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                        </Select>
                    </FormControl>
                    <Divider my={4} borderColor="gray.300" />

                    {/* Credentialled Community Language */}
                    <FormControl mb={4}>
                        <FormLabel fontWeight="bold" fontSize="lg" color="gray.700">
                            Do you hold a recognised qualification in a credentialled community language?
                            <Tooltip label="Select whether you hold a recognised credentialled community language qualification." fontSize="md">
                                <IconButton variant="ghost" aria-label="Info" icon={<InfoIcon />} size="sm" />
                            </Tooltip>
                        </FormLabel>
                        <RadioGroup
                            value={formData.communityLanguage || ''}
                            onChange={(value) => updateFormData('communityLanguage', value)}
                        >
                            <Stack direction="column">
                                <Radio value="yes" fontSize="lg" color="gray.600">Yes</Radio>
                                <Radio value="no" fontSize="lg" color="gray.600">No</Radio>
                            </Stack>
                        </RadioGroup>
                    </FormControl>
                    <Divider my={4} borderColor="gray.300" />

                    {/* Study in Regional Australia */}
                    <FormControl mb={4}>
                        <FormLabel fontWeight="bold" fontSize="lg" color="gray.700">
                            Have you studied in a regional area of Australia and met the Australian study requirement?
                            <Tooltip label="Select whether you have studied in a regional area of Australia." fontSize="md">
                                <IconButton variant="ghost" aria-label="Info" icon={<InfoIcon />} size="sm" />
                            </Tooltip>
                        </FormLabel>
                        <RadioGroup
                            value={formData.regionalStudy || ''}
                            onChange={(value) => updateFormData('regionalStudy', value)}
                        >
                            <Stack direction="column">
                                <Radio value="yes" fontSize="lg" color="gray.600">Yes</Radio>
                                <Radio value="no" fontSize="lg" color="gray.600">No</Radio>
                            </Stack>
                        </RadioGroup>
                    </FormControl>
                    <Divider my={4} borderColor="gray.300" />

                    {/* State Preferred */}
                    <FormControl isRequired mb={4}>
                        <FormLabel fontWeight="bold" fontSize="lg" color="gray.700">
                            State Preferred
                            <Tooltip label="Select your preferred state in Australia." fontSize="md">
                                <IconButton variant="ghost" aria-label="Info" icon={<InfoIcon />} size="sm" />
                            </Tooltip>
                        </FormLabel>
                        <Select
                            value={formData.statePreferred || ''}
                            onChange={(e) => updateFormData('statePreferred', e.target.value)}
                            fontSize="lg" color="gray.600"
                        >
                            <option value="">Please select an option</option>
                            <option value="NSW">New South Wales</option>
                            <option value="VIC">Victoria</option>
                            <option value="QLD">Queensland</option>
                            <option value="WA">Western Australia</option>
                            <option value="SA">South Australia</option>
                            <option value="TAS">Tasmania</option>
                            <option value="ACT">Australian Capital Territory</option>
                            <option value="NT">Northern Territory</option>
                        </Select>
                    </FormControl>
                    <Divider my={4} borderColor="gray.300" />

                    {/* Preferred Industry */}
                    <FormControl isRequired mb={4}>
                        <FormLabel fontWeight="bold" fontSize="lg" color="gray.700">
                            Preferred Industry
                            <Tooltip label="Select your preferred industry." fontSize="md">
                                <IconButton variant="ghost" aria-label="Info" icon={<InfoIcon />} size="sm" />
                            </Tooltip>
                        </FormLabel>
                        <Select
                            value={formData.preferredIndustry || ''}
                            onChange={(e) => { 
                                setPreferredIndustry(e.target.value);
                                updateFormData('preferredIndustry', e.target.value);
                            }}
                            fontSize="lg" color="gray.600"
                        >
                            <option value="">Please select an option</option>
                            <option value="Business">Business</option>
                            <option value="IT">IT</option>
                            <option value="Education">Education</option>
                            <option value="Engineering">Engineering</option>
                            <option value="Healthcare">Healthcare</option>
                        </Select>
                    </FormControl>
                    <Divider my={4} borderColor="gray.300" />

                    {/* Preferred Level of Course */}
                    <FormControl isRequired mb={4}>
                        <FormLabel fontWeight="bold" fontSize="lg" color="gray.700">
                            Preferred Level of Course
                            <Tooltip label="Select the level of course you want to pursue." fontSize="md">
                                <IconButton variant="ghost" aria-label="Info" icon={<InfoIcon />} size="sm" />
                            </Tooltip>
                        </FormLabel>
                        <Select
                            value={formData.courseLevel || ''}
                            onChange={(e) => updateFormData('courseLevel', e.target.value)}
                            fontSize="lg" color="gray.600"
                        >
                            <option value="">Please select an option</option>
                            <option value="postgraduate">Masters</option>
                            <option value="undergraduate">Bachelors</option>
                        </Select>
                    </FormControl>
                    <Divider my={4} borderColor="gray.300" />

                    

                    {/* Preferred Occupation */}
                    <FormControl isRequired mb={4}>
                        <FormLabel fontWeight="bold" fontSize="lg" color="gray.700">
                            Preferred Occupation (based on industry)
                            <Tooltip label="Select your preferred occupation." fontSize="md">
                                <IconButton variant="ghost" aria-label="Info" icon={<InfoIcon />} size="sm" />
                            </Tooltip>
                        </FormLabel>
                        <Select
                            value={formData.preferredOccupation || ''}
                            onChange={(e) => updateFormData('preferredOccupation', e.target.value)}
                            fontSize="lg" color="gray.600"
                        >
                            <option value="">Please select an option</option>
                            {getOccupationsForIndustry().map((occupation) => (
                                <option key={occupation.anzsco} value={occupation.anzsco}>
                                    {occupation.occupation}
                                </option>
                            ))}
                        </Select>
                    </FormControl>
                    <Divider my={4} borderColor="gray.300" />

                    {/* Marital Status */}
                    <FormControl isRequired mb={4}>
                        <FormLabel fontWeight="bold" fontSize="lg" color="gray.700">
                            What is your marital status?
                            <Tooltip label="Select your current marital status." fontSize="md">
                                <IconButton variant="ghost" aria-label="Info" icon={<InfoIcon />} size="sm" />
                            </Tooltip>
                        </FormLabel>
                        <Select
                            value={formData.maritalStatus || ''}
                            onChange={(e) => updateFormData('maritalStatus', e.target.value)}
                            fontSize="lg" color="gray.600"
                        >
                            <option value="">Please select an option</option>
                            <option value="single">Single or partner is an Australian citizen/ permanent resident</option>
                            <option value="married_skilled">Married and partner meets age, English, and skill criteria</option>
                            <option value="married_unskilled">Married and partner has competent English</option>
                        </Select>
                    </FormControl>
                    <Divider my={4} borderColor="gray.300" />

                    {/* Nomination */}
                    <FormControl isRequired mb={4}>
                        <FormLabel fontWeight="bold" fontSize="lg" color="gray.700">
                            Have you been invited to apply for a Skilled Nominated visa (subclass 190)?
                            <Tooltip label="Select whether you've received an invitation for subclass 190." fontSize="md">
                                <IconButton variant="ghost" aria-label="Info" icon={<InfoIcon />} size="sm" />
                            </Tooltip>
                        </FormLabel>
                        <Select
                            value={formData.nomination || ''}
                            onChange={(e) => updateFormData('nomination', e.target.value)}
                            fontSize="lg" color="gray.600"
                        >
                            <option value="">Please select an option</option>
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                        </Select>
                    </FormControl>

                    {/* Submit Button */}
                    <button type="submit" className='login-button'>Preview Results</button>
                </form>
            </Box>
            <Popup error={error} onClose={handleClosePopup} />
            <Footer />
        </>
    );
};

export default Questionnaire;

