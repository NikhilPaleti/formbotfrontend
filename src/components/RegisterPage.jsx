import React, { useState } from 'react';
import GoogleSVG from '../assets/google.svg';
import bgUser from '../assets/bg_user.svg';
import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'

const RegisterPage = () => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [passwordX, setPasswordX] = useState('');
    // const history = useHistory();

    const handleRegister = () => {
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            console.error('Invalid email format');
            toast.error('Please enter a valid email address.');
            return;
        }

        // Check if passwords match
        if (password !== passwordX) {
            console.error('Passwords do not match');
            toast.error('Passwords do not match. Please try again.');
            return;
        }

        // Hash the password
        // const hashedPassword = bcrypt.hashSync(password, 10); // Hashing the password

        // Prepare data for API
        const userData = {
            email,
            username,
            password, // Use hashed password
            // password: hashedPassword, // Use hashed password
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
            toast.success('Registration successful!'); // Notify user of success
            window.location.href='/login'
            // Handle successful registration (e.g., redirect to login)
        })
        .catch(error => {
            console.error('There was a problem with the registration:', error);
            toast.error('Registration failed: ' + error.message); // Notify user of error
        });
    };

    return (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#171923', backgroundImage: `url(${bgUser})`, backgroundSize:'contain', backgroundRepeat: 'no-repeat', textAlign:'left' }}>
            <ToastContainer />
            <button /*onClick={() => history.goBack()}*/ style={{ position:'fixed', left:'5vw', top:'10vh', fontSize:'3.5rem', background: 'rgba(1,1,1,0)', border:'0', color:'#ffffff'  }}> &lt; </button>
            {/* <h2>REGISTER</h2> */}
            <div>
            <label style={{paddingLeft:'1rem', color:'#ffffff'}}> Username </label> <br />
            <input 
                type="name" 
                placeholder="Username" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                className='input-fields' 
            />
            </div>
            <div>
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
            <div>
            <label style={{paddingLeft:'1rem', color:'#ffffff'}}> Confirm Password </label> <br />
            <input 
                type="password" 
                placeholder="Confirm Password" 
                value={passwordX} 
                onChange={(e) => setPasswordX(e.target.value)} 
               
                className='input-fields' 
            />
            </div>
            <button onClick={handleRegister} className='clickBtn' style={{ marginTop: '3vh', marginBottom:'3vh'}}>
                Register Now
            </button>
            <p style={{color: '#ffffff'}}> OR </p>
            <button className='clickBtn' style={{ marginTop: '3vh'}}>
                <img src={GoogleSVG} alt="Google Logo" style={{ height: '1.5rem', marginRight: '1rem' }} />
                Register with Google
            </button>
            <p style={{ marginTop: '1rem', color:'#ffffff' }}>
                Already got an account? <a href="/login" style={{  }}>Login!</a>
            </p>
        </div>
    );
};

export default RegisterPage;
