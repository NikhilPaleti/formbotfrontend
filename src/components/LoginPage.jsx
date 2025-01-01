import React, { useState } from 'react';
import GoogleSVG from '../assets/google.svg';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import bgUserTriangles from '../assets/bgUserTriangles.svg'
import bgUserRS from '../assets/bgUserRS.svg'
import bgUserBS from '../assets/bgUserBS.svg'
import { useNavigate } from 'react-router-dom'
import eyeSVG from '../assets/eye.svg';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            // console.error('Invalid email format');
            toast.warn('Please enter a valid email address.');
            return;
        }


        const userData = {
            email,
            password,
        };
        fetch('https://formbot-backend-2mmu.onrender.com/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                toast.success("Login Success!")
                localStorage.setItem('fp1_user_jwt', data.token);
                localStorage.setItem('fp1_email', userData.email);
                window.location.href = '/workspace'

            })
            .catch(error => {
                // console.log('There was a problem with the login:', error);
                toast.error('Login failed. Please check your credentials and try again.');
            });
    };

    return (
        <div className='reglog-main' style={{
            backgroundImage: `url(${bgUserTriangles}), url(${bgUserRS}), url(${bgUserBS})`
        }}>
            <ToastContainer />
            <button onClick={() => navigate(-1)} style={{ position: 'fixed', left: '5vw', top: '10vh', fontSize: '3.5rem', background: 'rgba(1,1,1,0)', border: '0', color: '#ffffff' }}> &lt; </button>
            {/* <h2>Login</h2> */}
            <div style={{}}>
                <label style={{ paddingLeft: '1rem', color: '#ffffff' }}> E-Mail </label> <br />
                <div className='forEye'>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className='input-fields'
                    />
                    <div style={{ display: "inline", opacity: '0', gap: '1rem', alignItems: 'center' }}> <img  //The JANK to make the UI consistent. 
                        src={eyeSVG}
                        alt="Show password"
                        style={{ cursor: 'pointer' }} />
                    </div>
                </div>

            </div>
            <div>
                <label style={{ paddingLeft: '1rem', color: '#ffffff' }}> Password </label> <br />
                <div className='forEye'>
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className='input-fields'
                    />
                    <div onClick={() => { setShowPassword(!showPassword) }} style={{ display: "inline", gap: '1rem', alignItems: 'center' }}> <img
                        src={eyeSVG}
                        alt="Show password"
                        style={{ cursor: 'pointer' }} />
                    </div>
                </div>
            </div>
            <button onClick={handleLogin} className='clickBtn' style={{ marginTop: '3vh', marginBottom: '3vh' }}>
                Log In
            </button>
            <p style={{ color: '#ffffff' }}> OR </p>
            <button className='clickBtn' style={{ marginTop: '3vh' }}>
                <img src={GoogleSVG} alt="Google Logo" style={{ height: '1.5rem', marginRight: '1rem' }} />
                Sign In with Google
            </button>
            <p style={{ marginTop: '1rem', color: '#ffffff' }}>
                New member? <a onClick={() => window.location.href = '/register'} style={{}}>Register</a>
            </p>
        </div>
    );
};

export default LoginPage;
