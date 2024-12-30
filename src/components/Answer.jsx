import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import sendSVG from '../assets/send.svg';
import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';

const Answer = () => {
    const { workspaceId, folderId, formbotId } = useParams();
    const [commands, setCommands] = useState([]);
    const [currentCommandIndex, setCurrentCommandIndex] = useState(0);
    const [userInput, setUserInput] = useState('');
    const [isInputEnabled, setIsInputEnabled] = useState(false);
    const [userResponses, setUserResponses] = useState([]);
    const [showThankYou, setShowThankYou] = useState(false);

    useEffect(() => {
        const fetchCommands = async () => {
            try {
                const response = await fetch(`https://formbot-backend-2mmu.onrender.com/fetchFormbot/${workspaceId}/${folderId}/${formbotId}`);
                const data = await response.json();
                setCommands(data.commands);
                await updateOpenedCount((data.opened || 0) + 1);
            } catch (error) {
                toast.error('Failed to fetch commands:', error);
            }
        };

        fetchCommands();
    }, [workspaceId, folderId, formbotId]);

    const updateOpenedCount = async (newOpenedCount) => {
        try {
            await fetch(`https://formbot-backend-2mmu.onrender.com/modifyFormbot/${workspaceId}/${folderId}/${formbotId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    opened: newOpenedCount,
                }),
            });
        } catch (error) {
            toast.error('Failed to update backend:', error);
        }
    };

    useEffect(() => {
        if (commands.length > 0) {
            handleCommand(0);
        }
    }, [commands]);

    const handleCommand = async (index) => {
        if (index < commands.length) {
            const command = commands[index];
            setIsInputEnabled(command.type.startsWith('input'));
            
            if (!command.type.startsWith('input')) {
                setTimeout(() => {
                    setCurrentCommandIndex(index + 1);
                    handleCommand(index + 1);
                }, 1500);
            }
        } else {
            setTimeout(() => setShowThankYou(true), 1500);
        }
    };

    const handleUserResponse = async (response) => {
        const newResponse = { 
            command: commands[currentCommandIndex], 
            response: response.toString() 
        };
        
        const updatedResponses = [...userResponses, newResponse];
        setUserResponses(updatedResponses);

        const hasMoreInputs = commands
            .slice(currentCommandIndex + 1)
            .some(item => item.type.includes("input"));

        if (!hasMoreInputs) {
            setIsInputEnabled(false);
            await sendUserResponsesToModifyAPI(updatedResponses);
        }

        setCurrentCommandIndex(currentCommandIndex + 1);
        handleCommand(currentCommandIndex + 1);
        setUserInput('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isInputEnabled && userInput) {
            handleUserResponse(userInput);
        }
    };

    const handleRatingInput = (num) => {
        if (isInputEnabled) {
            handleUserResponse(num);
        }
    };

    const sendUserResponsesToModifyAPI = async (responses) => {
        try {
            const responsesList = responses.map(response => response.response);
            const dateTimeString = new Date().toLocaleString();
            responsesList.push(dateTimeString);

            await fetch(`https://formbot-backend-2mmu.onrender.com/modifyFormbot/${workspaceId}/${folderId}/${formbotId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    filled_forms: responsesList,
                }),
            });
        } catch (error) {
            toast.error('Failed to send user responses:', error);
        }
    };

    const renderInputField = () => {
        const currentType = commands[currentCommandIndex]?.type;
        switch (currentType) {
            case 'input-text':
                return <input type="text" value={userInput} onChange={(e) => setUserInput(e.target.value)} placeholder="Enter text here" autoFocus className='input-fields' />;
            case 'input-number':
                return <input type="number" value={userInput} onChange={(e) => setUserInput(e.target.value)} placeholder="Enter numbers here" autoFocus className='input-fields' />;
            case 'input-email':
                return <input type="email" value={userInput} onChange={(e) => setUserInput(e.target.value)} placeholder="Enter email" autoFocus className='input-fields' />;
            case 'input-date':
                return <input type="date" value={userInput} onChange={(e) => setUserInput(e.target.value)} autoFocus className='input-fields' />;
            case 'input-rating':
                return (
                    <div className="rating-container">
                        {[1, 2, 3, 4, 5].map((num) => (
                            <div 
                                key={num} 
                                className={`rating-item ${userInput === num.toString() ? 'selected' : ''}`}
                                onClick={() => handleRatingInput(num)}
                            >
                                {num}
                            </div>
                        ))}
                    </div>
                );
            default:
                return <input type="text" value={userInput} onChange={(e) => setUserInput(e.target.value)} placeholder="Type here..." autoFocus className='input-fields' />;
        }
    };

    return (
        <div className="chat-interface">
            <ToastContainer />
            {showThankYou ? (
                <div className="screwItAll">
                    THANK YOU!
                    <br />
                    Your data is now being sold to the highest bidder!
                </div>
            ) : (
                <>
                    <div className="messages">
                        {commands.slice(0, currentCommandIndex).map((command, index) => (
                            <div key={index} className={`message ${command.type.includes('output') ? 'computer' : 'user'}`}>
                                {command.type.includes('output-text') && <p>{command.content}</p>}
                                {command.type.includes('output-image') && <img src={command.content} alt="Output" />}
                                {command.type.includes('input') && (
                                    <p>{userResponses.find(response => response.command === command)?.response || ''}</p>
                                )}
                            </div>
                        ))}
                    </div>
                    <form className='answerForm' onSubmit={handleSubmit}>
                        {renderInputField()}
                        <button 
                            className='clickBtn' 
                            style={{ 
                                backgroundColor: isInputEnabled ? '#1A5FFF' : '#AAAAAA', 
                                width: '3rem' 
                            }}
                        >
                            <img style={{ width: '2rem' }} src={sendSVG} alt="Send" />
                        </button>
                    </form>
                </>
            )}
        </div>
    );
};

export default Answer;