import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import sendSVG from '../assets/send.svg';



const Answer = () => {
    const { formbotId } = useParams();
    const [commands, setCommands] = useState([]);
    const [currentCommandIndex, setCurrentCommandIndex] = useState(0);
    const [userInput, setUserInput] = useState('');
    const [isInputEnabled, setIsInputEnabled] = useState(false);
    const [userResponses, setUserResponses] = useState([]);
    const [showThankYou, setShowThankYou] = useState(false);



    useEffect(() => {
        const fetchCommands = async () => {
            try {
                const response = await fetch(`https://formbot-backend-2mmu.onrender.com/fetchFormbot/${formbotId}`);
                const data = await response.json();
                setCommands(data.commands);

                const openedCount = data.opened || 0; // Default to 0 
                await updateOpenedCount(openedCount + 1);
            } catch (error) {
                console.error('Failed to fetch commands:', error);
            }
        };

        fetchCommands();
    }, [formbotId]);

    // This function updates whenever someone opens the page, a.k.a "tracking"
    const updateOpenedCount = async (newOpenedCount) => {
        try {
            await fetch(`https://formbot-backend-2mmu.onrender.com/modifyFormbot/${formbotId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    opened: newOpenedCount,
                }),
            });
        } catch (error) {
            console.error('Failed to update opened count:', error);
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
            if (command.type.startsWith('input')) {
                setIsInputEnabled(true);
            } else {
                setIsInputEnabled(false);
                setTimeout(() => {
                    setCurrentCommandIndex(index + 1);
                    handleCommand(index + 1);
                }, 1500); // This time out is there just to make it look like the computer is thinking lol. Removing has zero impact.
            }
        } else {
            setTimeout(() => {
                setShowThankYou(true);
            }, 1500); // This time out is there just to make it look like the computer is thinking lol. Removing has zero impact.

        }
    };

    const handleUserInput = (e) => {
        setUserInput(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isInputEnabled) {

            const newResponse = { command: commands[currentCommandIndex], response: userInput.toString() };
            setUserResponses([...userResponses, newResponse]);
            if (commands.slice(currentCommandIndex + 1).some(item => item.type.includes("input"))) {
                setCurrentCommandIndex(currentCommandIndex + 1);
                handleCommand(currentCommandIndex + 1);
                setUserInput('');
            } else {  // There are no more inputs (if check above). So now we're handling submit to API so that computer can do it's stipid little dance (THANK YOU)
                setIsInputEnabled(false)
                let temp = userResponses
                temp.push(newResponse)
                sendUserResponsesToModifyAPI(userResponses)
                setCurrentCommandIndex(currentCommandIndex + 1);
                handleCommand(currentCommandIndex + 1);
                setUserInput('');
            }

        }
    };

    const sendUserResponsesToModifyAPI = async () => {
        try {
            const responsesList = userResponses.map(response => response.response);
            const dateTimeString = new Date().toLocaleString()
            responsesList.push(dateTimeString)
            // console.log(responsesList, "LIST")
            await fetch(`https://formbot-backend-2mmu.onrender.com/modifyFormbot/${formbotId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    filled_forms: responsesList,
                }),
            });
        } catch (error) {
            console.error('Failed to send user responses:', error);
        }
    };

    function renderInputField() {
        const currentType = commands[currentCommandIndex]?.type;
        switch (currentType) {
            case 'input-text':
                return <input type="text" value={userInput} onChange={handleUserInput} placeholder="Enter text here" autoFocus className='input-fields' />;
            case 'input-number':
                return <input type="number" value={userInput} onChange={handleUserInput} placeholder="Enter numbers here" autoFocus className='input-fields' />;
            case 'input-email':
                return <input type="email" value={userInput} onChange={handleUserInput} placeholder="Enter email" autoFocus className='input-fields' />;
            case 'input-date':
                return <input type="date" value={userInput} onChange={handleUserInput} autoFocus className='input-fields' />;
            case 'input-rating':
                return (
                    <div className="rating-container">
                        {[1, 2, 3, 4, 5].map((num) => (
                            <div key={num} className={`rating-item ${userInput === num.toString() ? 'selected' : ''}`} onClick={() => handleRatingInput(num)}>
                                {num}
                            </div>
                        ))}
                    </div>
                );
            default:
                return <input type="text" value={userInput} onChange={handleUserInput} placeholder="Type here..." autoFocus className='input-fields' />;
        }
    }

    function handleRatingInput(num) {
        setUserInput(num.toString());
        if (isInputEnabled) {
            const newResponse = { command: commands[currentCommandIndex], response: num.toString() };
            setUserResponses([...userResponses, newResponse]);
            if (commands.slice(currentCommandIndex + 1).some(item => item.type.includes("input"))) {
                setCurrentCommandIndex(currentCommandIndex + 1);
                handleCommand(currentCommandIndex + 1);
                setUserInput('');
            } else { // There are no more inputs (if check above). So now we're handling submit to API 
                setIsInputEnabled(false)
                let temp = userResponses
                temp.push(newResponse)
                sendUserResponsesToModifyAPI(userResponses)
                setCurrentCommandIndex(currentCommandIndex + 1);
                handleCommand(currentCommandIndex + 1);
                setUserInput('');
            }
        }
    }




    return (
        <div className="chat-interface">
            {showThankYou ? (
                <div className="screwItAll">THANK YOU!
                    <br />
                    Your data is now being sold to the highest bidder!</div>
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
                        <button className='clickBtn' style={{ backgroundColor: isInputEnabled ? '#1A5FFF' : '#AAAAAA', width: '3rem' }} >
                            <img style={{ width: '2rem' }} src={sendSVG} />
                        </button>
                    </form>
                </>
            )}
        </div>
    );
};

export default Answer; 