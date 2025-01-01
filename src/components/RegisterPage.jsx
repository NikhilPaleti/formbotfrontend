import React, { useState } from 'react';
import GoogleSVG from '../assets/google.svg';
// import bgUser from '../assets/bg_user.svg';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import bgUserTriangles from '../assets/bgUserTriangles.svg'
import bgUserRS from '../assets/bgUserRS.svg'
import bgUserBS from '../assets/bgUserBS.svg'
import { useNavigate } from 'react-router-dom'
import eyeSVG from '../assets/eye.svg';

const RegisterPage = () => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [passwordX, setPasswordX] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordX, setShowPasswordX] = useState(false);
    const navigate = useNavigate();


    const handleRegister = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            console.error('Invalid email format');
            toast.error('Please enter a valid email address.');
            return;
        }

        const nameRegex = /^[A-Za-z]+$/; // Only-Alphabets ka RegeX
        if (!nameRegex.test(username)) {
            // console.error('Username contains invalid characters');
            toast.error('Username must contain only alphabets.');
            return;
        }

        if (password !== passwordX) {
            console.error('Passwords do not match');
            toast.error('Passwords do not match. Please try again.');
            return;
        }

        // Removed hashing because...... Why not. Server does it for us
        // const hashedPassword = bcrypt.hashSync(password, 10); 

        const userData = {
            email,
            username,
            password,
            // password: hashedPassword, //ex-hashed password
        };

        fetch('https://formbot-backend-2mmu.onrender.com/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(err => {
                        throw new Error(err.error || 'Network response was not ok');
                    });
                }
                return response.json();
            })
            .then(data => {
                // console.log('Registration successful:', data);
                toast.success('Registration successful!');
                window.location.href = '/login'
            })
            .catch(error => {
                console.error('There was a problem with the registration:', error);
                toast.error('Registration failed: ' + error.message);
            });
    };

    return (
        <div className='reglog-main' style={{ backgroundImage: `url(${bgUserTriangles}), url(${bgUserRS}), url(${bgUserBS})` }}>
            <ToastContainer />
            <button onClick={() => navigate(-1)} style={{ position: 'fixed', left: '5vw', top: '10vh', fontSize: '3.5rem', background: 'rgba(1,1,1,0)', border: '0', color: '#ffffff' }}> &lt; </button>
            {/* <h2>REGISTER</h2> */}
            <div>
                <label style={{ paddingLeft: '1rem', color: '#ffffff' }}> Username </label> <br />
                <div className="forEye">
                    <input
                        type="name"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className='input-fields'
                        style={{ backgroundColor: '#171923' }}
                    />

                    <div style={{ display: "inline", opacity: '0', gap: '1rem', alignItems: 'center' }}> <img
                        src={eyeSVG}
                        style={{ cursor: 'pointer' }} />
                    </div>
                </div>
            </div>
            <div>
                <label style={{ paddingLeft: '1rem', color: '#ffffff' }}> E-Mail </label> <br />
                <div className="forEye"><input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ backgroundColor: '#171923' }}
                    className='input-fields'
                />

                    <div style={{ display: "inline", opacity: '0', gap: '1rem', alignItems: 'center' }}> <img
                        src={eyeSVG}
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
            <div>
                <label style={{ paddingLeft: '1rem', color: '#ffffff' }}> Confirm Password </label> <br />
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
                    <input
                        type={showPasswordX ? "text" : "password"}
                        placeholder="Confirm Password"
                        value={passwordX}
                        onChange={(e) => setPasswordX(e.target.value)}

                        className='input-fields'
                    />
                    <div onClick={() => { setShowPasswordX(!showPasswordX) }} style={{ display: "inline", gap: '1rem', alignItems: 'center' }}> <img
                        src={eyeSVG}
                        alt="Show password"
                        style={{ cursor: 'pointer' }} />
                    </div>
                </div>
            </div>

            <button onClick={handleRegister} className='clickBtn' style={{ marginTop: '3vh', marginBottom: '3vh' }}>
                Register Now
            </button>
            <p style={{ color: '#ffffff' }}> OR </p>
            <button className='clickBtn' style={{ marginTop: '3vh' }}>
                <img src={GoogleSVG} alt="Google Logo" style={{ height: '1.5rem', marginRight: '1rem' }} />
                Register with Google
            </button>
            <p style={{ marginTop: '1rem', color: '#ffffff' }}>
                Already got an account? <a href="/login" style={{}}>Login!</a>
            </p>
        </div>
    );
};

export default RegisterPage;
