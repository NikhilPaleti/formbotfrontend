import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDarkMode } from '../DarkModeContext';
import trashIcon from '../assets/trash.svg'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import startFlag from '../assets/startFlag.svg'
// import { color } from 'chart.js/helpers';
import o_video from '../assets/video.svg'
import o_text from '../assets/text.svg'
import i_text from '../assets/input-text.svg'
// import text from '../assets/text.svg'
import i_date from '../assets/date.svg'
import i_email from '../assets/email.svg'
import i_rating from '../assets/rating.svg'
import i_number from '../assets/number.svg'
import o_image from '../assets/image.svg'
import { PieChart } from 'react-minimal-pie-chart';
import { useNavigate } from 'react-router-dom'

const FormBot = () => {
    const { isDarkMode, toggleDarkMode } = useDarkMode();
    const { workspaceId, folderId, formbotId } = useParams();
    const [formName, setFormName] = useState('');
    const [activeTab, setActiveTab] = useState('Form');
    const [formData, setFormData] = useState([]);
    const [wholeForm, setWholeForm] = useState([]);
    const [selectedButton, setSelectedButton] = useState('Form');    
    const navigate = useNavigate();

    useEffect(() => {
        const darkModePreference = localStorage.getItem('darkMode') === 'true';
        if (darkModePreference !== isDarkMode) {
            toggleDarkMode();
        } if (!localStorage.getItem('fp1_user_jwt')) {
            navigate("/login")
        }
        setFormName(formbotId);
    }, []);

    const handleFormNameChange = (e) => {
        setFormName(e.target.value);
    };

    const handleTabChange = (tab) => {
        if (wholeForm.length !== 0) {
            console.log(wholeForm);
            setSelectedButton(tab)
            setActiveTab(tab);
        }
    };

    const handleToggleDarkMode = () => {
        toggleDarkMode();
        localStorage.setItem('darkMode', !isDarkMode);
    };

    useEffect(() => {
        const fetchFormData = async () => {
            try {
                const response = await fetch(`https://formbot-backend-2mmu.onrender.com/fetchFormbot/${workspaceId}/${folderId}/${formbotId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch form data');
                }
                const data = await response.json();
                if (data.commands) {
                    // if(data.commands[data.commands.length-1].type == 'input-text' && data.commands[data.commands.length-1].content == 'x'){
                    //     data.commands.pop();
                    // } // Some long ass code originally written to test some crap. IGNOREEE
                    setWholeForm(data);
                    setFormData(data.commands);
                }
                else {
                    // console.log('we here')
                    setFormData([]);
                    setWholeForm([]);
                }
            } catch (err) {
                toast.error(err.message);
            }
        };

        fetchFormData();

    }, [activeTab, formbotId]);


    const Slider = ({ isDarkMode, handleToggleDarkMode }) =>
    (<div className="slider" onClick={handleToggleDarkMode} style={{ display: 'inline-block', width: '3.5rem', height: '1.8rem', backgroundColor: isDarkMode ? '#1A5FFF' : '#AAAAAA', borderRadius: '3rem', position: 'relative', cursor: 'pointer', }}>
        <div className="slider-thumb" style={{ width: '1.7rem', height: '1.7rem', backgroundColor: isDarkMode ? '#171923' : '#FFFFFF', borderRadius: '50%', position: 'absolute', top: '1px', left: isDarkMode ? '1.7rem' : '1px', transition: 'left 0.2s', }} />
    </div>);

    // Test code ignore
    // useEffect(() =>{
    //     console.log(wholeForm)
    // }, [wholeForm]) 

    const handleButtonClick = (type) => {
        const newElement = {
            type: type,
            content: ""
        };
        setFormData([...formData, newElement]);
        // console.log(formData)
    };

    const handleContentChange = (e, index) => {
        const updatedFormData = [...formData];
        updatedFormData[index].content = e.target.value;
        setFormData(updatedFormData);
        // console.log(formData)
    };

    const handleSave = async () => {
        // console.log(formData[formData.length-1])
        // if(formData[formData.length-1].type != 'input-text' || formData[formData.length-1].content != 'x'){
        //     formData.push(
        //         {
        //             "type": "input-text",
        //             "content": "x",
        //         }
        //     )
        // } //S ome long ass code originally written to test some crap. IGGGNOOOOTTTREEEEEEE

        const allOutputsFilled = formData.every(item =>
            !item.type.startsWith('output') || (item.type.startsWith('output') && item.content.trim() !== '')
        );

        if (!allOutputsFilled) {
            toast.error('Please fill in all output fields before saving.');
            return;
        }

        try {
            const response = await fetch(`https://formbot-backend-2mmu.onrender.com/modifyFormbot/${workspaceId}/${folderId}/${formbotId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formName,
                    commands: formData,
                }),
            });

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.error || 'Failed to save form data');
            }

            // console.log(result.message); 
            toast.success("Saved form details");
            if (formName != formbotId) {
                setTimeout(() => {
                    window.location.href = window.location.href.replace(formbotId, formName)
                }, 1000);
            }
        } catch (error) {
            toast.error('Error:', error.message);
        }
    };

    const handleDelete = (index) => {
        const updatedFormData = formData.filter((_, i) => i !== index);
        setFormData(updatedFormData);
    };

    const MyTable = ({ data }) => {
        const maxLength = Math.max(...data.filled_forms.map(arr => arr.length));
        return (
            <table border="1">
                <tbody> {data.filled_forms.map((row, rowIndex) =>
                (<tr key={rowIndex}> {Array.from({ length: maxLength }).map((_, colIndex) =>
                (<td key={colIndex}> {row[colIndex] || '___'}
                </td>))}
                </tr>))}
                </tbody>
            </table>);
    };
    // Some very low quality, hacky code to create table in "Responses" Section

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href.replace('/formbot/', '/answer/'));
        toast.success("Copied Link to respond to this form");
    }

    const imageMap = {
        'input-number': i_number,
        'output-text': o_text,
        'input-email': i_email,
        'input-date': i_date,
        'output-image': o_image,
        'input-rating': i_rating,
        'input-text': i_text,
    };


    return (
        <div>

            <nav className={isDarkMode ? 'dark-mode FormNav' : 'light-mode FormNav'}>
                <input
                    type="text"
                    placeholder="Enter form Name"
                    value={formName}
                    onChange={handleFormNameChange}
                    className='input-fields'
                />
                <div className='formNavButtonContainer'>
                    <button onClick={() => handleTabChange('Form')} className={selectedButton === 'Form' ? 'navButton select' : 'navButton'}>Form</button>
                    <button onClick={() => handleTabChange('Response')} className={selectedButton === 'Response' ? 'navButton select' : 'navButton'}>Response</button>
                </div>
                <Slider isDarkMode={isDarkMode} handleToggleDarkMode={handleToggleDarkMode} />
                <div className='formNavButtonContainer'>
                    <button className='clickBtn' onClick={handleShare}>Share</button>
                    <button className='clickBtn' style={{ backgroundColor: '#4ADE80cc' }} onClick={handleSave}>Save</button>
                    <p onClick={() => window.location.href = '/workspace'}> ❌ </p>
                </div>
            </nav>
            {activeTab === 'Form' && (
                <div className={isDarkMode ? 'dark-mode formFlex' : 'light-mode formFlex'}>
                    <ToastContainer />
                    <div className={isDarkMode ? 'dark-mode fbc-left-part' : 'light-mode fbc-left-part'} style={{}}>
                        <h4 style={{ marginLeft: '1rem', backgroundColor: 'rgba(0,0,0,0)' }}>Your Message/Output (to user)</h4>
                        <div className='IOOptions'>
                            <br />
                            <button onClick={() => handleButtonClick('output-text')}>
                                <img src={o_text} style={{ backgroundColor: 'rgba(0,0,0,0)', margin: '0 1rem 0 0' }} />
                                Text
                            </button>
                            <button onClick={() => handleButtonClick('output-image')}>
                                <img src={o_image} style={{ backgroundColor: 'rgba(0,0,0,0)', margin: '0 1rem 0 0' }} />
                                Image/GIF
                            </button>
                        </div>
                        <h4 style={{ marginLeft: '1rem', backgroundColor: 'rgba(0,0,0,0)' }}>User Response Options</h4>
                        <div className='IOOptions'>
                            <button onClick={() => handleButtonClick('input-text')}>
                                <img src={i_text} style={{ backgroundColor: 'rgba(0,0,0,0)', margin: '0 1rem 0 0' }} />
                                Text
                            </button>
                            <button onClick={() => handleButtonClick('input-number')}>
                                <img src={i_number} style={{ backgroundColor: 'rgba(0,0,0,0)', margin: '0 1rem 0 0' }} />
                                Number
                            </button>
                            <button onClick={() => handleButtonClick('input-email')}>
                                <img src={i_email} style={{ backgroundColor: 'rgba(0,0,0,0)', margin: '0 1rem 0 0' }} />
                                Email
                            </button>
                            <button onClick={() => handleButtonClick('input-date')}>
                                <img src={i_date} style={{ backgroundColor: 'rgba(0,0,0,0)', margin: '0 1rem 0 0' }} />
                                Date
                            </button>
                            <button onClick={() => handleButtonClick('input-rating')}>
                                <img src={i_rating} style={{ backgroundColor: 'rgba(0,0,0,0)', margin: '0 1rem 0 0' }} />
                                Rating
                            </button>
                        </div>
                    </div>
                    <div className={isDarkMode ? 'dark-mode formElementList' : 'light-mode formElementList'} style={{}}>
                        <div className="formBotUnit"> <img src={startFlag} style={{ marginRight: '1rem' }} /> Hello </div>
                        {formData ? (
                            formData.map((item, index) => (
                                <div key={index} className="formBotUnit">
                                    <div className="top-section">
                                        <h2 style={{ marginLeft: '1rem' }}>
                                            {item.type.startsWith('input') && (
                                                <img
                                                    src={imageMap[item.type]}
                                                    alt=""
                                                    style={{ margin: '0 0.5rem 0 0' }}
                                                />
                                            )}

                                            {/* {item.type.startsWith('output') ? 'output' : 'input'} - */ item.type.replace('input-', '').replace('output-', '')}
                                        </h2>
                                        <img src={trashIcon} onClick={() => handleDelete(index)} />
                                    </div>
                                    <div className="bottom-section">
                                        {item.type.startsWith('output') && (
                                            <img
                                                src={imageMap[item.type]}
                                                alt=""
                                                style={{ margin: '0 0.5rem 0 1rem' }}
                                            />
                                        )}

                                        {item.type.includes('output') ? (
                                            <input className='input-fields'
                                                type="text"
                                                placeholder={
                                                    ['output-video', 'output-image'].includes(item.type)
                                                        ? "Paste Link to display"
                                                        : "Enter text to show to user"
                                                }
                                                value={item.content}
                                                onChange={(e) => handleContentChange(e, index)} />
                                        ) : (
                                            <span style={{ marginLeft: '1rem' }}>Hint: User will input {item.type.replace('input-', '')} here, you need not do anything</span>
                                        )}
                                    </div>
                                </div>
                            ))
                            // formData.map(item => item.element) // Seems simple let's keep this as an option
                        ) : (
                            <div className='formElementList'>
                                <div className="formBotUnit">Start</div>
                            </div>
                        )}
                    </div>
                </div>
            )}
            {activeTab === 'Response' && (
                <div className={isDarkMode ? 'dark-mode responses' : 'light-mode responses'}>
                    <ToastContainer />
                    <div className='stat-container'>
                        <p className='stat'>People who filled the form <br />{wholeForm.filled_forms.length}</p>
                        <p className='stat'>People who opened the form <br /> {wholeForm.opened}</p>
                    </div>
                    <div style={{ height: '30vh', overflowY: 'auto' }}>
                        <MyTable data={wholeForm} />
                    </div>
                    <div className='chart-container'>

                        <PieChart data={[{ title: 'Filled', value: wholeForm.filled_forms.length, color: '#1A5FFF' },
                        { title: 'Total', value: wholeForm.opened - wholeForm.filled_forms.length, color: '#AAAAAA' }]}
                            style={{ width: '30%' }}
                            lineWidth={25}></PieChart>
                        <p className='stat' style={{ height: '30%' }}> Completion Rate <br /> {wholeForm.filled_forms.length / wholeForm.opened}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FormBot;