import React from 'react';
// import { useHistory } from 'react-router-dom';
import triangle from '../assets/triangle.svg';
import mainLogo from '../assets/logo.svg'
import arch from '../assets/arch.svg';
import LandImg from '../assets/landing_img.png';
import bgLanding from '../assets/bg_landing.svg';
// import '../index.css'

const LandingPage = () => {
    // const history = useHistory();

    return (
        <div style={{width: '100%'}}>
        <nav className='landingNav' style={{  }}>
            <div style={{ display: 'flex', alignItems: 'center', marginLeft: '1.5rem'}}>
                <img src={mainLogo} alt="Icon" style={{ height: '40px', display: 'inline' }} />
                <p style={{ color: '#ffffff', margin: '0', paddingLeft: '8px' }}>FormBot</p>
            </div>
            <div style={{marginRight: '1.5rem'}}>
                <button 
                    onClick={() =>  window.location.href = '/login'}

                    style={{margin: '1rem 1rem 1rem 0', minWidth: '40px', borderRadius: '0.5rem', padding: '0.5rem 1rem', border: '2px solid #7EA6FF', backgroundColor: '#171923', color:'#7EA6FF' }}>
                    Sign In
                </button>
                <button className='clickBtn' style={{margin: '1rem 0 1rem 0', minWidth: '40px', border: '2px solid #1A5FFF', maxWidth:'10rem'}}>Create a Form Bot</button>
            </div>
        </nav>
        <div style={{ textAlign: 'center', margin: '0', padding: '10vh 0 0 0', backgroundColor: '#171923', backgroundImage: `url(${bgLanding})`, backgroundSize:'contain', backgroundRepeat: 'no-repeat'}}>
            <h1 style={{ fontSize: '4rem', marginBottom:'2vh', color: '#4B83FF' }}>Build advanced chatbots visually</h1>

            <p style={{ fontSize: '1.2rem', color: '#ffffff', margin:'0 0 3vh 0' }}>Typebot gives you powerful blocks to create unique chat experiences. <br />
            Embed them anywhere on your web/mobile apps and start collecting results like magic.</p>
            <button className='clickBtn' style={{  }}>
                Create a ChatBot for FREE
            </button> <br />
            <img src={LandImg} alt="Landing" style={{ width: '66vw', margin: '5vh 0 10vh 0', borderRadius: '10px' }} />
        </div>

        <footer style={{ backgroundColor: '#171923', color: '#ffffff', padding: '20px 0', marginTop: '0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-around', maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ textAlign: 'left' }}>
                    <h4 style={{ }}>FormBot</h4>
                    <img src={mainLogo} alt="Logo" style={{ height: '3rem', marginTop: '10px' }} />
                    <h6>Made with ❣️ <br />
                    by <a style={{textDecoration:'none'}} href="https://linkedin.com/in/nikhilpaleti">@NikhilPaleti</a></h6>
                </div>
                <div className='deadToMe' style={{ textAlign: 'left' }}>
                    <h4>Products</h4>
                    <ul style={{ listStyleType: 'none', padding: 0 }}>
                        <li style={{padding: '0.8rem 0 0 0'}}><a href="#status" style={{  }}>Status</a></li>
                        <li style={{padding: '0.8rem 0 0 0'}}><a href="#documents" style={{  }}>Documents</a></li>
                        <li style={{padding: '0.8rem 0 0 0'}}><a href="#roadmap" style={{  }}>Roadmap</a></li>
                        <li style={{padding: '0.8rem 0 0 0'}}><a href="#pricing" style={{  }}>Pricing</a></li>
                    </ul>
                </div>
                <div style={{ textAlign: 'left' }}>
                    <h4>Community</h4>
                    <ul style={{ listStyleType: 'none', padding: 0 }}>
                        <li style={{padding: '0.8rem 0 0 0'}}><a href="#discord" style={{  }}>Discord</a></li>
                        <li style={{padding: '0.8rem 0 0 0'}}><a href="#github" style={{  }}>GitHub</a></li>
                        <li style={{padding: '0.8rem 0 0 0'}}><a href="#twitter" style={{  }}>Twitter</a></li>
                        <li style={{padding: '0.8rem 0 0 0'}}><a href="#linkedin" style={{  }}>LinkedIn</a></li>
                        <li style={{padding: '0.8rem 0 2rem 0'}}><a href="#ossfriends" style={{  }}>OSSFriends</a></li>
                    </ul>
                </div>
                <div style={{ textAlign: 'left' }}>
                    <h4>Company</h4>
                    <ul style={{ listStyleType: 'none', padding: 0 }}>
                        <li style={{padding: '0.8rem 0 0 0'}}><a href="#about" style={{  }}>About</a></li>
                        <li style={{padding: '0.8rem 0 0 0'}}><a href="#contact" style={{  }}>Contact</a></li>
                        <li style={{padding: '0.8rem 0 0 0'}}><a href="#terms" style={{  }}>Terms of Service</a></li>
                        <li style={{padding: '0.8rem 0 0 0'}}><a href="#privacy" style={{  }}>Privacy Policy</a></li>
                    </ul>
                </div>
            </div>
        </footer>

        </div>
    );
};

export default LandingPage;
