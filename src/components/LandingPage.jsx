import React, { useEffect } from 'react';
// import triangle from '../assets/triangle.svg';
import mainLogo from '../assets/logo.svg'
import LandImg from '../assets/landing_img.png';
import bgLandTriangle from '../assets/bgLandTriangle.svg'
import bgLandArch from '../assets/bgLandArch.svg'
import bgLandMC from '../assets/bgLandMC.svg'
import '../index.css'
import { useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'

const LandingPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const wakeServer = async () => {
            await fetch('https://formbot-backend-2mmu.onrender.com/wake');
        };
        wakeServer();
    }, []); // this will wake the backend server when the website opens. Hopefully reduces just a little bit of the wait time

    return (
        <div style={{ width: '100%' }}>
            <ToastContainer></ToastContainer>
            <nav className='landingNav' style={{}}>
                <div style={{ display: 'flex', alignItems: 'center', marginLeft: '1.5rem' }}>
                    <img src={mainLogo} alt="Icon" style={{ height: '40px', display: 'inline' }} />
                    <p className='deadToMe' style={{ color: '#ffffff', margin: '0', paddingLeft: '8px' }}>FormBot</p>
                </div>
                <div style={{ marginRight: '1.5rem' }}>
                    <button
                        onClick={() => window.location.href = '/login'}

                        style={{ margin: '1rem 1rem 1rem 0', minWidth: '40px', height: '2.5rem', borderRadius: '0.5rem', padding: '0.5rem 1rem', border: '2px solid #7EA6FF', backgroundColor: '#171923', color: '#7EA6FF' }}>
                        Sign In
                    </button>
                    <button onClick={() => window.location.href = '/register'} className='clickBtn' style={{ margin: '1rem 0 1rem 0', border: '2px solid #1A5FFF', maxWidth: '9rem' }}>Create Form Bot</button>
                </div>
            </nav>
            <div className='landing-main' style={{ backgroundImage: `url(${bgLandArch}), url(${bgLandMC}), url(${bgLandTriangle}) ` }}>
                <h1 style={{ fontSize: '4rem', marginBottom: '2vh', color: '#4B83FF' }}>Build advanced chatbots visually</h1>

                <p style={{ fontSize: '1.2rem', color: '#ffffff', margin: '0 0 3vh 0' }}>Typebot gives you powerful blocks to create unique chat experiences. <br />
                    Embed them anywhere on your web/mobile apps and start collecting results like magic. <br />
                    NOTE - The backend server can take 1min+ to wake from sleep on the first use</p>
                <button className='clickBtn' style={{}} onClick={() => window.location.href = '/register'}>
                    Create a ChatBot for FREE
                </button> <br />
                <img src={LandImg} alt="Landing" style={{ width: '66vw', margin: '5vh 0 10vh 0', borderRadius: '10px' }} />
            </div>

            <footer style={{ backgroundColor: '#171923', color: '#ffffff', padding: '20px 0', margin: '0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-around', margin: '0 1rem', gap: '0.5rem' }}>
                    <div style={{ textAlign: 'left' }}>
                        <h4 style={{}}>FormBot</h4>
                        <img src={mainLogo} alt="Logo" style={{ height: '3rem', marginTop: '10px' }} />
                        <h6>Made with ❣️ <br />
                            by <a style={{ textDecoration: 'none' }} href="https://linkedin.com/in/nikhilpaleti">@NikhilPaleti</a></h6>
                    </div>
                    <div className='deadToMe' style={{ textAlign: 'left' }}>
                        <h4>Products</h4>
                        <ul style={{ listStyleType: 'none', padding: 0 }}>
                            <li style={{ padding: '0.8rem 0 0 0' }}><a href="#status" style={{}}>Status</a></li>
                            <li style={{ padding: '0.8rem 0 0 0' }}><a href="#documents" style={{}}>Documents</a></li>
                            <li style={{ padding: '0.8rem 0 0 0' }}><a href="#roadmap" style={{}}>Roadmap</a></li>
                            <li style={{ padding: '0.8rem 0 0 0' }}><a href="#pricing" style={{}}>Pricing</a></li>
                        </ul>
                    </div>
                    <div style={{ textAlign: 'left' }}>
                        <h4>Project Details</h4>
                        <ul style={{ listStyleType: 'none', padding: 0 }}>
                            <li style={{ padding: '0.8rem 0 0 0' }}><a href="https://github.com/NikhilPaleti/formbot_backend" style={{}}>Backend Code (GitHub)</a></li>
                            <li style={{ padding: '0.8rem 0 0 0' }}><a href="https://github.com/NikhilPaleti/formbotfrontend" style={{}}>Frontend Code (GitHub)</a></li>
                            <li style={{ padding: '0.8rem 0 0 0' }}><a href="https://formbotfrontend.vercel.app/" style={{}}>Frontend Deploy Link (Vercel)</a></li>
                            <li style={{ padding: '0.8rem 0 0 0' }}><a href="https://formbot-backend-2mmu.onrender.com" style={{}}>Backend Deploy Link (Render)</a></li>
                            {/* <li style={{padding: '0.8rem 0 2rem 0'}}><a href="#ossfriends" style={{  }}>OSSFriends</a></li> */}
                        </ul>
                    </div>
                    <div style={{ textAlign: 'left' }}>
                        <h4> Nikhil - The Developer </h4>
                        <ul style={{ listStyleType: 'none', padding: 0 }}>
                            <li style={{ padding: '0.8rem 0 0 0' }}><a href="https://www.linkedin.com/in/nikhilpaleti/" style={{}}>LinkedIn</a></li>
                            <li style={{ padding: '0.8rem 0 0 0' }}><a href="https://github.com/NikhilPaleti/" style={{}}>GitHub</a></li>
                            <li style={{ padding: '0.8rem 0 0 0' }}><a onClick={() => { navigator.clipboard.writeText("paletinikhil@gmail.com"); toast.success("Copied email address of the developer"); }} style={{}}> E-Mail </a></li>
                            <li style={{ padding: '0.8rem 0 0 0' }}><a onClick={() => { navigator.clipboard.writeText("+91-9391952329"); toast.success("Copied Phone Number of developer"); }} style={{}}> Phone </a></li>
                        </ul>
                    </div>
                </div>
            </footer>

        </div>
    );
};

export default LandingPage;
