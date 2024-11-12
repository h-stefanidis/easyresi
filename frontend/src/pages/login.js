import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../axiosConfig';
import Popup from '../components/Popup';

function Login() {
    // Constants
    const navigate = useNavigate();

    // State variables
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loginerror, setLoginerror] = useState('');

    const [userType, setUserType] = useState('');

    const handleClosePopup = () => {
        setError(''); // Close the popup by clearing the error message
    };

    const fetchLogin = async () => {
        try {
            const response = await axios.get('/auth/login');
            if (response.data.type === "success") {
                setUserType(response.data.data.user_type);
                if (response.data.data.user_type === "admin") {
                    navigate('/admindashboard', { state: { message: "Admin detected" } });
                }
                if (response.data.data.user_type === "applicant") {
                    navigate('/', { state: { message: "Admin detected" } });
                }
                if (response.data.data.user_type === "agent") {
                    navigate('/agentdashboard', { state: { message: "Admin detected" } });
                }
            }
        } catch (err) { 
            setError('Unable to fetch loging details. Please try again later');}
    };

    // Handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('/auth/login', { email, password });
            setUserType(response.data.data.user_type);
            
            // Check if the response status is 200
            if (response.status === 200) {
                sessionStorage.setItem('user_id', response.data.data.user_id);

                if (response.data.data.user_type === "admin") {
                    navigate('/admindashboard', { state: { message: 'Logged in' } });
                }
                else if (response.data.data.user_type === "applicant") {
                    navigate('/', { state: { message: 'Logged in' } });
                }
                else if (response.data.data.user_type === "agent") {
                    navigate('/agentdashboard', {state: {message: 'Logged in'}});
                }
            } else {
                setError(response.data.message); // show this on a popup - bottom right
            }
        } catch (error) {
            if(error.status === 401) {
                setLoginerror(error.response.data.message)}
            else {
            setError('Unexpected error occured. Please contact administrator');
            }
        }
    };

    useEffect(() => {
        fetchLogin();
    }, []);
    return (
        <div className='login'>
            <h1><strong>Easy Resi</strong></h1>
            <p>The easy way to find your best pathway to permanent residency in Australia.</p>
            <div className='login-container'>
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className='email-container'>
                        <label className='email'>Email:</label>
                        <input 
                            className='login-input-1'
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className='password-container'>
                        <label className='password'>Password:</label>
                        <input 
                            className='login-input-2'
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {loginerror && <div className="error">{loginerror}</div>}
                    <button type="submit" className='login-button'>Login</button>
                    <button 
                        type="button" 
                        className='register-button' 
                        onClick={() => navigate('/register')}
                    >
                        Register
                    </button>
                </form>
            </div>
            
            <Popup error={error} onClose={handleClosePopup} />
        </div>
    );
}

export default Login;

