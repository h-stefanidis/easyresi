import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig';
import { useNavigate } from 'react-router-dom';
import "../index.css";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FadeInSection from '../components/fadeInSection'; // Import your new component
import { Box, Text, Button, Select } from '@chakra-ui/react';
import AdminNavbar from '../components/AdminNavbar';
import AgentNavbar from '../components/AgentNavbar';
import NothingNavbar from '../components/NothingNavbar';
import Popup from '../components/Popup';


const Statistics = () => {
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [data, setData] = useState([]);
    const [selectedStat, setSelectedStat] = useState('');

    const handleClosePopup = () => {
        setError(''); // Close the popup by clearing the error message
    };
    
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
                if (response.data.data.user_type === "admin") {
                    navigate('/admindashboard', { state: { message: "Admin detected" } });
                }
            }
        } catch (err) { 
            setError('An unexpected error occurred. Please contact administrator');
        }
    };

    // Fetch statistics data from the backend
    const fetchStatistics = async () => {
        try {
            const response = await axios.get('/api/statistics'); // API call using axios
            setData(response.data);
        } catch (error) {
            setError('Statistics feature is still being built. Please wait untill the next update. Thank you for your patience.');
        }
    };

    // Fetch data when the component mounts
    useEffect(() => {
        fetchLogin();
    }, []);

    return (
        <>
            {renderNavbar()}
            <div className="about">
                <FadeInSection>
                    <div className="about-header">
                        <h1>Statistics on Skilled Immigration to Australia</h1>
                        <p>
                            Skilled immigration is a vital part of Australia's economy, contributing significantly to its workforce 
                            and diversity. Here we present key statistics that highlight the trends, demographics, and impact of 
                            skilled migration in Australia.
                        </p>
                    </div>

                    <hr className="orange-hr4" />
                </FadeInSection>

                <FadeInSection delay={0.5}>
                    <h1>Key Statistics</h1>
                    <ul>
                        <li>
                            <strong>Skilled Migration Program:</strong><br />
                            In the 2021-2022 program year, Australia granted approximately <strong>79,600 visas</strong> under the 
                            Skilled Migration Program.
                        </li>
                        <li>
                            <strong>Primary Source Countries:</strong><br />
                            The top three countries for skilled migrants were <strong>India, China, and the UK</strong>.
                        </li>
                        <li>
                            <strong>Occupational Demand:</strong><br />
                            Occupations in high demand include <strong>nurses, engineers, and IT specialists</strong>, reflecting 
                            Australia’s growing need for skilled professionals.
                        </li>
                        <li>
                            <strong>Permanent Residency Rates:</strong><br />
                            Over <strong>60%</strong> of skilled visa holders successfully transition to permanent residency after 
                            fulfilling their visa conditions.
                        </li>
                        <li>
                            <strong>Impact on Economy:</strong><br />
                            Skilled migrants contribute an estimated <strong>$25 billion</strong> to the Australian economy annually.
                        </li>
                    </ul>

                    <hr className="orange-hr3" />
                </FadeInSection>

                <div className="skilled-immigration-process">
                    <FadeInSection>
                        <h1>The Skilled Immigration Process</h1>
                        <p>
                            The pathway to skilled migration to Australia involves several steps:
                        </p>
                        <ol>
                            <li>
                                <strong>Skills Assessment:</strong> Applicants must have their skills assessed by a relevant assessing authority.
                            </li>
                            <li>
                                <strong>Expression of Interest (EOI):</strong> Submit an EOI through SkillSelect to be considered for an invitation to apply.
                            </li>
                            <li>
                                <strong>Receive Invitation:</strong> If selected, applicants will receive an invitation to apply for a visa.
                            </li>
                            <li>
                                <strong>Visa Application:</strong> Submit a visa application along with necessary documents, including health and character checks.
                            </li>
                            <li>
                                <strong>Visa Grant:</strong> Once approved, the applicant can move to Australia as a permanent resident.
                            </li>
                        </ol>
                    </FadeInSection>
                </div>

                <div className="commitment">
                    <FadeInSection>
                        <hr className="orange-hr2" />
                        <h1>Our Commitment to Information</h1>
                        <p>
                            At Easy Resi, we aim to provide clear and accurate information regarding skilled immigration. 
                            While the immigration process can be complex, our resources are designed to help you navigate 
                            the system effectively. We encourage prospective migrants to seek professional advice tailored to their individual circumstances.
                        </p>
                    </FadeInSection>
                </div>
            </div>
            <Popup error={error} onClose={handleClosePopup} />
            <Footer />
        </>
    );
};

export default Statistics;