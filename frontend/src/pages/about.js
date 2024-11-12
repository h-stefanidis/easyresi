import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig';
import { useNavigate } from 'react-router-dom';
import Popup from '../components/Popup';
import "../index.css";
import Navbar from '../components/Navbar';
import AdminNavbar from '../components/AdminNavbar';
import AgentNavbar from '../components/AgentNavbar';
import NothingNavbar from '../components/NothingNavbar';
import Footer from '../components/Footer';
import FadeInSection from '../components/fadeInSection';

const About = () => {
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

    // Fetch data when the component mounts
    useEffect(() => {
        fetchLogin();
    }, []);


    return (
        <>
            {/* Conditionally render the correct navbar based on user_type */}
            {renderNavbar()}
            <div className="about">
            <FadeInSection>
                <div className="about-header">
                    <h1>About Easy Resi</h1>
                    <p>
                        Easy Resi is a user-friendly web-based platform designed to assist skilled migrants in navigating 
                        the complex process of obtaining permanent residence (PR) in Australia. By leveraging up-to-date 
                        immigration data and a personalised recommendation algorithm, Easy Resi provides users with 
                        tailored pathways that align with their unique skills, experience, and preferences.
                    </p>
                </div>

                <hr className="orange-hr" />
            </FadeInSection>

            <FadeInSection delay={0.5}>
                <h1>What We Do</h1>
                <p>
                    Our mission is to simplify the journey to permanent residence for skilled migrants by offering a 
                    comprehensive, step-by-step guide based on individual profiles. Easy Resi helps users identify 
                    the most suitable and efficient study-to-PR pathways, reducing the guesswork and uncertainty in 
                    the migration process.
                </p>

                <hr className="orange-hr3" />
            </FadeInSection>

                <div className="key-features">
                    <FadeInSection>
                    <h1>Key Features</h1>
                    <p>
                        Easy Resi offers a range of key features to enhance the user experience:
                    </p>
                    <ul>
                        <li>
                            <strong>Personalised Recommendations:</strong><br />
                            Generates customised PR pathway suggestions by analysing user inputs such as skills, work experience, English proficiency, and location preferences.
                        </li>
                        <li>
                            <strong>Comprehensive Questionnaire:</strong><br />
                            Allows users to complete a detailed questionnaire to build their profiles, enabling the system to offer accurate and relevant recommendations.
                        </li>
                        <li>
                            <strong>Current Data Integration:</strong><br />
                            Integrates the latest skilled occupation lists and immigration data, ensuring users receive the most up-to-date information on their PR options.
                        </li>
                        <li>
                            <strong>Probability Calculation:</strong><br />
                            Uses an advanced algorithm to calculate the likelihood of receiving a PR invitation based on the user’s profile, helping them make informed decisions.
                        </li>
                        <li>
                            <strong>Optimised Recommendations:</strong><br />
                            Provides course and location recommendations optimised for the quickest and easiest path to PR, along with detailed cost and duration estimates.
                        </li>
                        <li>
                            <strong>Comparison Tool:</strong><br />
                            Allows users to compare the top recommended pathways, making it easier to choose the best option for their circumstances.
                        </li>
                    </ul>
                    </FadeInSection>
                </div>

                <div className="serve">
                    <FadeInSection>
                    <h1>Who We Serve</h1>
                    <p>
                        Easy Resi serves a variety of user groups, including:
                    </p>
                    <ul>
                        <li>
                            <strong>Prospective Skilled Migrants:</strong><br />
                            Create profiles, explore tailored PR pathways, and access comprehensive information on costs and timelines.
                        </li>
                        <li>
                            <strong>Migration Agents:</strong><br />
                            Create accounts to view anonymised statistics and provide feedback on recommendations, enhancing their ability to assist clients.
                        </li>
                        <li>
                            <strong>Education Providers:</strong><br />
                            Submit course details and view anonymised interest statistics, helping align their offerings with the needs of prospective students.
                        </li>
                    </ul>
                    <div className="serve-image">
                        <img src="/images/skilledMigrant.png" alt="Skilled Migrant" className="about-image" />
                    </div>
                    </FadeInSection>
                </div>

                <div className="commitment">
                    <FadeInSection>
                    <hr className="orange-hr2" />
                    <h1>Our Commitment</h1>
                    <p>
                        At Easy Resi, we understand that the journey to permanent residence can be overwhelming. We are committed to 
                        providing accurate, accessible, and transparent guidance, though we always advise consulting with professional 
                        migration agents for personalised advice. While we strive to ensure the highest quality and reliability, we 
                        acknowledge that immigration policies are subject to change and recommend users stay informed of the latest updates.
                    </p>
                    </FadeInSection>
                </div>
            </div>
            <Popup error={error} onClose={handleClosePopup} />
            <Footer />
        </>
    );
};

export default About;
