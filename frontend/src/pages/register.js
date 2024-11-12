import React, { useState } from 'react';
import '../App.js';
import axios from '../axiosConfig';
import { useNavigate } from 'react-router-dom';

const FormComponent = () => {
    // State to store user input and errors
    const [formData, setFormData] = useState({
        fname: '',
        lname: '',
        email: '',
        pass: '',
        repass: '',
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // Real-time validation for passwords
        if (name === 'repass' || name === 'pass') {
            if (value !== formData.pass && name === 'repass') {
                setError('Passwords do not match');
            } else if (value === '') {
                setError('Password cannot be empty');
            } else {
                setError('');
            }
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check password match
        if (formData.repass !== formData.pass) {
            setError('Passwords do not match');
            return;
        } else {
            setError('');
        }

        try {
            const response = await axios.post('/auth/register', formData);
            console.log(response.data); // Handle response from backend
            navigate('/', { state: { message: 'Registered' } }); // Navigate after successful registration
        } catch (error) {
            console.error('There was an error submitting the form!', error);
            setError('An error occurred while registering. Please try again.'); // Set error message on catch
        }
    };

    return (
        <form className='register' onSubmit={handleSubmit}>
            <h1><strong>Easy Resi</strong></h1>
            <p>The easy way to find your best pathway to permanent residency in Australia.</p>
            <h2>Register</h2>
            
            <label className='fname'>
                First Name:
                <input
                    className='input'
                    type="text"
                    name="fname"
                    value={formData.fname}
                    onChange={handleChange}
                    required
                />
            </label>
            <br />
            <label className='lname'>
                Last Name:
                <input
                    className='input'
                    type="text"
                    name="lname"
                    value={formData.lname}
                    onChange={handleChange}
                    required
                />
            </label>
            <br />
            <label className='email'>
                Email:
                <input
                    className='input'
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
            </label>
            <br />
            <label className='password'>
                Password:
                <input
                    className='input'
                    type="password"
                    name="pass"
                    value={formData.pass}
                    onChange={handleChange}
                    required
                />
            </label>
            <br />
            <label className='re-password'>
                Re-Enter Password:
                <input
                    className='input'
                    type="password"
                    name="repass"
                    value={formData.repass}
                    onChange={handleChange}
                    required
                />
            </label>

            {error && <p className="error-message">{error}</p>}

            <button className='register-button' type="submit">Submit</button>
            <button className='login-button' type="button" onClick={() => navigate('/login')}>Login</button>
        </form>
    );
};

export default FormComponent;