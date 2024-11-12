import '../index.css';
import HiddenNavbar from '../components/HiddenNavbar';
import Footer from '../components/Footer';
import { Box, SimpleGrid } from "@chakra-ui/react";
import Tile from "../components/Tile";
import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig';
import { useNavigate } from 'react-router-dom';
import "../index.css";
import Popup from '../components/Popup';

const Home = () => {
    const navigate = useNavigate();

    const [error, setError] = useState('');
    // Check to see if logged in
    const [userType, setUserType] = useState('');

    // Admin fetchlogin (apply to all admin pages)
    const fetchLogin = async () => {
        try {
            const response = await axios.get('/auth/login');
            if (response.data.type === "error") {
                setError('User was not logged in, redirecting to login...');
                navigate('/login', { state: { message: "User was not logged in, redirecting to login..." } });
            }
            if (response.data.type === "success") {
                setUserType(response.data.data.user_type);
            }
        } catch (err) { 
            setError('Unexpected error occured. Please contact administrator');
        }
    };

        // Fetch data when the component mounts
        useEffect(() => {
            fetchLogin();
        }, []);

        const handleClosePopup = () => {
            setError(''); // Close the popup by clearing the error message
        };

    return (
        <>
            <HiddenNavbar />
            <div className="home">
                <h1>Welcome to Easy Resi</h1>
                <Box p={8} textAlign="center" ml="-30px">
                    <SimpleGrid columns={[1, 2, 3]} spacing={10} justifyItems="center">
                        <Tile 
                            title="About" 
                            to="/about" 
                            description="Learn more about Easy Resi's mission and goals." 
                            imgSrc="/images/aboutImage.png"
                        />
                        <Tile 
                            title="Dashboard" 
                            to="/dashboard" 
                            description="View your personalised dashboard with key information." 
                            imgSrc="/images/dashboardImage.png"
                        />
                        <Tile 
                            title="Statistics" 
                            to="/statistics" 
                            description="Explore data and statistics relevant towards your permanent residency." 
                            imgSrc="/images/statisticsImage.jpg"
                        />
                        <Tile 
                            title="Questionnaire" 
                            to="/questionnaire" 
                            description="Answer questions to receive tailored recommendations." 
                            imgSrc="/images/questionnaireImage.png"
                        />
                        <Tile 
                            title="Account" 
                            to="/account" 
                            description="Manage your personal account settings and details." 
                            imgSrc="/images/accountImage.png"
                        />
                        <Tile 
                            title="Settings" 
                            to="/displaysettings" 
                            description="Adjust your preferences and system settings." 
                            imgSrc="/images/settingsImage.png"
                        />
                    </SimpleGrid>
                </Box>
            </div>
            <Popup error={error} onClose={handleClosePopup} />
            <Footer />
        </>
    );
}

export default Home;