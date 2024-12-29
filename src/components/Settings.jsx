import React, { useState } from 'react';
import { useDarkMode } from '../DarkModeContext';
// import '../index.css'
import logoutIcon from '../assets/logout.svg'
import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'

function Settings() {
    const { isDarkMode, toggleDarkMode } = useDarkMode();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    async function handleUpdate() {
        // Prepare the data for the API request
        const userData = {
            oldUsername: localStorage.getItem('fp1_username'),
            oldEmail: localStorage.getItem('fp1_email'), 
            newUsername: username,
            newEmail: email,
            oldPassword: oldPassword,
            newPassword: newPassword
        };

        try {
            const response = await fetch('https://formbot-backend-2mmu.onrender.com/updateUser', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to update user');
            }
            toast.success('User updated successfully!');
            if (email){
            localStorage.setItem('fp1_email', email);}
            if (username){
            localStorage.setItem('fp1_username', username);}
            // Optionally reset form or handle further actions
        } catch (error) {
            toast.error(`Error: ${error.message}`);
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('fp1_user_jwt');
        localStorage.removeItem('fp1_email');
        localStorage.getItem('fp1_username');
        window.location.href = "/"// Redirect to homepage
    };

    return (
        <div className={isDarkMode ? 'dark-mode settings-container' : 'light-mode settings-container'} >
            <h2>UPDATE DETAILS</h2>
            <div>
                {/* <label style={{paddingLeft: '1rem'}}>(New) Username</label> */}
                <input
                    type="text"
                    value={username}
                    placeholder="Username" 
                    onChange={(e) => setUsername(e.target.value)}
                    className='input-fields' 
                    // style={{ width: '60%' }}
                />
            </div>
            <div>
                {/* <label style={{paddingLeft: '1rem'}}>(New) Email</label> */}
                <input
                    type="email"
                    value={email}
                    placeholder="E-Mail"
                    onChange={(e) => setEmail(e.target.value)}
                    className='input-fields' 
                    // style={{ width: '60%' }}
                />
            </div>
            <div>
                {/* <label style={{paddingLeft: '1rem'}}>Old Password</label> */}
                <input
                    type="password"
                    value={oldPassword}
                    placeholder="Old Password"
                    onChange={(e) => setOldPassword(e.target.value)}
                    className='input-fields' 
                    // style={{ width: '60%' }}
                />
            </div>
            <div>
                {/* <label style={{paddingLeft: '1rem'}}>New Password</label> */}
                <input
                    type="password"
                    value={newPassword}
                    placeholder="New Password"
                    onChange={(e) => setNewPassword(e.target.value)}
                    className='input-fields' 
                    // style={{ width: '60%' }}
                />
            </div>
            <button onClick={handleUpdate} className='clickBtn'>Update</button>
            <button onClick={handleLogout} style={{position:'fixed', left:'5vw', bottom:'10vh', fontSize:'1.5rem', background: 'rgba(1,1,1,0)', border:'0',  color:'#CF3636'}}> <img style={{height:'1.2rem'}} src={logoutIcon} /> Log Out</button>
        </div>
    );
}

export default Settings;
