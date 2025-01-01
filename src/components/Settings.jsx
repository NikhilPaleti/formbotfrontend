import React, { useEffect, useState } from 'react';
import { useDarkMode } from '../DarkModeContext';
// import '../index.css'
import logoutIcon from '../assets/logout.svg'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import eyeSVG from '../assets/eye.svg';

function Settings() {
    const { isDarkMode, toggleDarkMode } = useDarkMode();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordX, setShowPasswordX] = useState(false);

    useEffect(() => {
        if (!localStorage.getItem('fp1_user_jwt')) {
            navigate("/login")
        }
    }, []);

    async function handleUpdate() {
        const userData = {
            oldUsername: localStorage.getItem('fp1_username'),
            oldEmail: localStorage.getItem('fp1_email'),
            newUsername: username,
            newEmail: email,
            oldPassword: oldPassword,
            newPassword: newPassword
        };



        try {
            // console.log(JSON.stringify(userData))
            const response = await fetch('https://formbot-backend-2mmu.onrender.com/updateUser', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Failed to update user');
            }
            toast.success('User updated successfully!');
            if (email) {
                localStorage.setItem('fp1_email', email);
            }
            if (username) {
                localStorage.setItem('fp1_username', username);
            }
        } catch (error) {
            // console.log(error);
            toast.error(`Error: ${error}`);
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('fp1_user_jwt');
        localStorage.removeItem('fp1_email');
        localStorage.getItem('fp1_username');
        window.location.href = "/"
    };

    return (
        <div className={isDarkMode ? 'dark-mode settings-container' : 'light-mode settings-container'} >
            <ToastContainer></ToastContainer>
            <h2>UPDATE DETAILS</h2>
            <div className='settingChild'>
                {/* <label style={{paddingLeft: '1rem'}}>(New) Username</label> */}
                <input
                    type="text"
                    value={username}
                    placeholder="Username"
                    onChange={(e) => setUsername(e.target.value)}
                    className='input-fields'
                // style={{ width: '60%' }}
                />

                <div style={{ display: "inline", opacity: '0', gap: '1rem', alignItems: 'center' }}> <img
                    src={eyeSVG}
                    alt="Show password"
                    style={{ cursor: 'pointer' }} />
                </div>
            </div>
            <div className='settingChild'>
                {/* <label style={{paddingLeft: '1rem'}}>(New) Email</label> */}
                <input
                    type="email"
                    value={email}
                    placeholder="E-Mail"
                    onChange={(e) => setEmail(e.target.value)}
                    className='input-fields'
                // style={{ width: '60%' }}
                />

                <div style={{ display: "inline", opacity: '0', gap: '1rem', alignItems: 'center' }}> <img
                    src={eyeSVG}
                    alt="Show password"
                    style={{ cursor: 'pointer' }} />
                </div>
            </div>
            <div className='settingChild'>
                {/* <label style={{paddingLeft: '1rem'}}>Old Password</label> */}
                <input
                    type={showPassword ? "text" : "password"} // Toggle input type
                    value={oldPassword}
                    placeholder="Enter the old password"
                    onChange={(e) => setOldPassword(e.target.value)}
                    className='input-fields'
                // style={{ width: '60%' }}
                />
                <div onClick={() => { setShowPassword(!showPassword) }} style={{ display: "inline", gap: '1rem', alignItems: 'center' }}> <img
                    src={eyeSVG}
                    alt="Show password"
                    style={{ cursor: 'pointer' }} />
                </div>

            </div>
            <div className='settingChild'>
                {/* <label style={{paddingLeft: '1rem'}}>New Password</label> */}
                <input
                    type={showPasswordX ? "text" : "password"}
                    value={newPassword}
                    placeholder="New Password"
                    onChange={(e) => setNewPassword(e.target.value)}
                    className='input-fields'
                />
                <div onClick={() => { setShowPasswordX(!showPasswordX) }} style={{ display: "inline", gap: '1rem', alignItems: 'center' }}> <img
                    src={eyeSVG}
                    alt="Show password"
                    style={{ cursor: 'pointer' }} />
                </div>
            </div>

            <button onClick={handleUpdate} className='clickBtn'>Update</button>
            <button onClick={handleLogout} style={{ position: 'fixed', left: '5vw', bottom: '10vh', fontSize: '1.5rem', background: 'rgba(1,1,1,0)', border: '0', color: '#CF3636' }}> <img style={{ height: '1.2rem' }} src={logoutIcon} /> Log Out</button>
        </div>
    );
}

export default Settings;
