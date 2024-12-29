import React, { useState } from 'react';
// import { useHistory } from 'react-router-dom';
import GoogleSVG from '../assets/google.svg';
import bgUser from '../assets/bg_user.svg';
import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // const history = useHistory();

    const handleLogin = () => {
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            // console.error('Invalid email format');
            toast.warn('Please enter a valid email address.');
            return;
        }

        // Prepare data for API
        const userData = {
            email,
            password,
        };
        console.log("gi")
        // Send data to backend API
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
            // console.log('Login successful:', data);
            // Store the token in localStorage or sessionStorage
            toast.success("Login Success!")
            localStorage.setItem('fp1_user_jwt', data.token);
            localStorage.setItem('fp1_email', userData.email);
            window.location.href='/workspace'

            // Redirect to another page after successful login
            // history.push('/dashboard'); // Change to your desired route
        })
        .catch(error => {
            // console.log('There was a problem with the login:', error);
            toast.error('Login failed. Please check your credentials and try again.');
        });
    };

    return (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#171923', textAlign:'left', backgroundImage: `url(${bgUser})`, backgroundSize:'contain', backgroundRepeat: 'no-repeat'}}>
            <ToastContainer />
            <button /*onClick={() => history.goBack()}*/ style={{ position:'fixed', left:'5vw', top:'10vh', fontSize:'3.5rem', background: 'rgba(1,1,1,0)', border:'0', color:'#ffffff'  }}> &lt; </button>
            {/* <h2>Login</h2> */}
            <div style={{}}>
            <label style={{paddingLeft:'1rem', color:'#ffffff'}}> E-Mail </label> <br />
            <input 
                type="email" 
                placeholder="Email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className='input-fields' 
            />
            </div>
            <div>
            <label style={{paddingLeft:'1rem', color:'#ffffff'}}> Password </label> <br />
            <input 
                type="password" 
                placeholder="Password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className='input-fields' 
            />
            </div>
            <button onClick={handleLogin} className='clickBtn' style={{ marginTop: '3vh', marginBottom:'3vh' }}>
                Log In
            </button>
            <p style={{color: '#ffffff'}}> OR </p>
            <button className='clickBtn' style={{ marginTop: '3vh'  }}>
                <img src={GoogleSVG} alt="Google Logo" style={{ height: '1.5rem', marginRight: '1rem' }} />
                Sign In with Google
            </button>
            <p style={{ marginTop: '1rem', color:'#ffffff' }}>
                New member? <a onClick={() => window.location.href='/register'} style={{  }}>Register</a>
            </p>
        </div>
    );
};

export default LoginPage;
