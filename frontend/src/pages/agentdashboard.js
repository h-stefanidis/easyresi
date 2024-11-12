import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import AgentNavbar from '../components/AgentNavbar';
import AdminNavbar from '../components/AdminNavbar';
import NothingNavbar from '../components/NothingNavbar';
import { Button } from '@chakra-ui/react'; // Import Button from Chakra UI
import Footer from "../components/Footer";

import Popup from '../components/Popup';

const AgentDashboard = () => {
    const navigate = useNavigate();
    const [welcomeMessage, setWelcomeMessage] = useState('');
    const [data, setData] = useState([]); // Ensure this is initialized as an empty array
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [userType, setUserType] = useState('');

    const handleClosePopup = () => {
        setError(''); // Close the popup by clearing the error message
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

    // Admin fetchlogin (apply to all admin pages)
    const fetchLogin = async () => {
        try {
            const response = await axios.get('/auth/login');
            if (response.data.type === "error") {
                navigate('/login', { state: { message: "User was not logged in, redirecting to login..." } });
            }
            if (response.data.type === "success") {
                setUserType(response.data.data.user_type);
                if (response.data.data.user_type !== "agent") {
                    navigate('/login', { state: { message: "User was not logged in as agent, redirecting to login..." } });
                }
            }
        } catch (err) { }
    };

    const fetchUsers = async () => {
        try {
            // Fetch only applicants managed by the agent
            const response = await axios.get('/api/agent_applicants'); // New API endpoint
            console.log(response.data); // For debugging
            setData(response.data || []); // Set the data (applicants) received from the API
        } catch (err) {
            if(err.status === 404) {
                setError(err.response.data.message)}
            else {
            setError('An unexpected error occurred while submitting. Please contact administrator');
            }
        }
    };
    

    // Function to handle viewing a user
    const handleView = (user_id) => {
        sessionStorage.setItem('checking_user_id', user_id)
        navigate(`/dashboard`);
    };

    // Function to handle editing a user
    const handleUpdate = (user_id) => {
        sessionStorage.setItem('checking_user_id', user_id);
        navigate(`/questionnaire`);
    };


    useEffect(() => {
        fetchLogin();
        fetchUsers();
    }, []);

    return (
        <>
            {renderNavbar()}
            <div className="dashboard">
                    <div>
                        <h1>Dashboard</h1>
                        {/* Display Users in a Table */}
                        <h2>Your Clients</h2>
                        {data.length > 0 ? (
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr>
                                        <th style={{ border: '1px solid black', padding: '8px', fontWeight: 'bold' }}>First Name</th>
                                        <th style={{ border: '1px solid black', padding: '8px', fontWeight: 'bold' }}>Last Name</th>
                                        <th style={{ border: '1px solid black', padding: '8px', fontWeight: 'bold' }}>Email</th>
                                        <th style={{ border: '1px solid black', padding: '8px', fontWeight: 'bold' }}>Actions</th> {/* New Column */}
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map((user) => (
                                        <tr key={user.data.user_id}>
                                            <td style={{ border: '1px solid black', padding: '8px' }}>{user.data.first_name}</td>
                                            <td style={{ border: '1px solid black', padding: '8px' }}>{user.data.last_name}</td>
                                            <td style={{ border: '1px solid black', padding: '8px' }}>{user.data.email}</td>
                                            <td style={{ border: '1px solid black', padding: '8px' }}>
                                                <Button colorScheme="teal" margin="3px" onClick={() => handleView(user.data.user_id)}>View</Button>
                                                <Button colorScheme="teal" margin="3px" onClick={() => handleUpdate(user.data.user_id)}>Update</Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>No user data available.</p>
                        )}
                    </div>
            </div>
            <Popup error={error} onClose={handleClosePopup} />
            <Footer />
        </>
    );
};

export default AgentDashboard;
