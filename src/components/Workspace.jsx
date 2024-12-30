import React, { useState, useEffect } from 'react';
import { useDarkMode } from '../DarkModeContext';
import trashIcon from '../assets/trash.svg'
import { useNavigate } from 'react-router-dom';
import sun from '../assets/sun.svg'
import moon from '../assets/moon.svg'
import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';


function Workspace() {
    const { isDarkMode, toggleDarkMode } = useDarkMode();
    const [workspaces, setWorkspaces] = useState([]);
    const [currentWorkspace, setCurrentWorkspace] = useState('');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [folders, setFolders] = useState([]); // State for folders
    const [formbots, setFormbots] = useState([]); // State for formbots
    const [currentFolder, setCurrentFolder] = useState('root'); // New state for current folder
    const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
    const [isShareModalOpen, setIsShareModalOpen] = useState(false); // State for share modal visibility
    const [Editable, setEditStatus] = useState(false);
    const navigate = useNavigate();
    const [isFormBotModalOpen, setIsFormBotModalOpen] = useState(false); // State for FormBot modal visibility
    const [isDeleteFolderModalOpen, setIsDeleteFolderModalOpen] = useState(false);
    const [folderToDelete, setFolderToDelete] = useState('');
    const [isDeleteFormbotModalOpen, setIsDeleteFormbotModalOpen] = useState(false);
    const [formbotToDelete, setFormbotToDelete] = useState('');
    

    useEffect(() => {
        fetchWorkspaces();
        if (localStorage.getItem('fp1_email')) {
            // console.log("all OK")
            fetch(`https://formbot-backend-2mmu.onrender.com/alluserdetails?email=${localStorage.getItem('fp1_email')}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network error');
                    }
                    return response.json();
                })
                .then(data => {
                    const userUsername = data.username; // Extract username from the response
                    // console.log("here", data.username)
                    localStorage.setItem('fp1_username', data.username);
                    const workspaceId = userUsername + '_workspace';
                    setCurrentWorkspace(workspaceId);
                    setEditStatus(true)
                    fetchFolders(workspaceId); // Fetch folders for the current workspace
                    fetchFormbots(workspaceId, currentFolder);
                })
                .catch(error => {
                    // console.error('There was a problem with fetching user details:', error);
                    toast.error('Error with user account');
                });
        }
        else {
            const queryParams = new URLSearchParams(window.location.search);
            const workspace = queryParams.get('currentWorkspace');
            if (workspace) {
                setCurrentWorkspace(workspace);
                fetchFolders(workspace);
                fetchFormbots(workspace, currentFolder);
            }
            if (queryParams.has('edit')) {
                setEditStatus(true);
            }
            else {
                setEditStatus(false);
            }
        }
        // fetchFolders(currentWorkspace);
    }, []);

    useEffect(() => {
        // Load dark mode preference from localStorage
        const darkModePreference = localStorage.getItem('darkMode') === 'true';
        if (darkModePreference !== isDarkMode) {
            toggleDarkMode(); // Set the initial state based on localStorage
        }
    }, []);

    const fetchWorkspaces = async () => {
        try {
            const email = localStorage.getItem('fp1_email');
            const response = await fetch(`https://formbot-backend-2mmu.onrender.com/fetchWorkspaces?email=${email}`);
            if (!response.ok) {
                throw new Error('Failed to fetch workspaces');
            }
            const data = await response.json();
            setWorkspaces(data); // Update state with fetched workspaces
        } catch (error) {
            // console.error('Error fetching workspaces:', error);
            toast.error('Error fetching workspaces: ' + error.message); // Notify user of error
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('fp1_user_jwt');
        localStorage.removeItem('fp1_email');
        localStorage.getItem('fp1_username');
        window.location.href = "/"// Redirect to homepage
    };

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const handleToggleDarkMode = () => {
        toggleDarkMode();
        // Store the current dark mode preference in localStorage
        localStorage.setItem('darkMode', !isDarkMode);
    };

    // New function to fetch folders from API
    const fetchFolders = async (workspaceName) => {
        try {
            const response = await fetch(`https://formbot-backend-2mmu.onrender.com/fetchFolders/${workspaceName}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch folders');
            }
            const data = await response.json();
            if (data.length === 0) { // Continue with the rest of the code 
                return
            }
            else { setFolders(data); }
            // Update state with fetched folders
        } catch (error) {
            // console.error('Error fetching folders:', error);
            toast.error('Error fetching folders: ' + error.message); // Notify user of error
        }
    };

    // New function to fetch formbots from API
    const fetchFormbots = async (workspaceId, folder) => {
        // console.log(workspaceId, folder)
        try {
            const response = await fetch(`https://formbot-backend-2mmu.onrender.com/fetchFormbots?workspaceId=${workspaceId}&folderName=${folder}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch formbots');
            }
            const data = await response.json();
            // console.log(data, "deets");
            setFormbots(data || []); // Update state with fetched formbots, default to empty array if no data

        } catch (error) {
            setFormbots([]);
            console.log('Possibly no formbots.', error);
            // toast.error('Error fetching formbots: ' + error.message); // Notify user of error
        }
    };

    // New function to handle folder deletion
    const handleDeleteFolder = (folderName) => {
        setFolderToDelete(folderName);
        setIsDeleteFolderModalOpen(true);
    };

    // New function to handle formbot deletion
    const handleDeleteFormbot = (formbotName) => {
        setFormbotToDelete(formbotName);
        setIsDeleteFormbotModalOpen(true);
    };

    // Function to handle folder creation with validation for name
    const handleCreateFolder = async (folderName) => {
        const email = localStorage.getItem('fp1_email');
        const workspaceId = currentWorkspace;
        const validName = /^[A-Za-z]+$/; // Regex to check if the name contains only alphabets

        if (!validName.test(folderName)) {
            toast.error('Folder name should contain only alphabets.');
            return;
        }

        try {
            const response = await fetch(`https://formbot-backend-2mmu.onrender.com/addFolder/${workspaceId}/folder`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: folderName }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                // console.error('Error creating Folder:', errorData.error);
                return toast.error('Error creating Folder: ' + errorData.error);
            }

            await fetchFolders(workspaceId); // Refresh folder list after creation
        } catch (error) {
            // console.error('Error creating folder:', error);
            toast.error('Error creating folder: ' + error.message);
        }
    };

    // New function to create a formbot
    // const handleCreateFormbot = async (formbotName) => {

    // };

    // New function to handle folder selection
    const handleFolderClick = async (folderPath) => {
        setCurrentFolder(folderPath); // Update current folder state
        await fetchFormbots(currentWorkspace, folderPath); // Fetch formbots in the selected folder
    };

    const Slider = ({ isDarkMode, handleToggleDarkMode }) => (
    <div className="slider" onClick={handleToggleDarkMode} style={{ display: 'inline-block', width: '3.5rem', height: '1.8rem', backgroundColor: isDarkMode ? '#1A5FFF' : '#AAAAAA', borderRadius: '3rem', position: 'relative', cursor: 'pointer', }}> 
    <div className="slider-thumb" style={{ width: '1.7rem', height: '1.7rem', backgroundColor: isDarkMode ? '#171923' : '#FFFFFF', background: isDarkMode? `${sun}` : `${moon}`, borderRadius: '50%', position: 'absolute', top: '1px', left: isDarkMode ? '1.7rem' : '1px', transition: 'left 0.2s', }} /> 
    </div>);


    // Modal Component for Folder Creation
    const Modal = ({ isOpen, onClose, onCreate }) => {
        const [folderName, setFolderName] = useState('');

        const handleSubmit = () => {
            if (folderName) {
                onCreate(folderName);
                setFolderName(''); // Reset input
                onClose(); // Close modal
            }
        };

        if (!isOpen) return null;

        return (
            <div className={isDarkMode ? 'modal-overlay dark-mode' : 'modal-overlay light-mode'}>
                <div className={isDarkMode ? 'modal-content dark-mode' : 'modal-content light-mode'}>
                    <h2>Create New Folder</h2>
                    <input
                        type="text"
                        value={folderName}
                        onChange={(e) => setFolderName(e.target.value)}
                        placeholder="Enter folder name"
                        className='input-fields'

                    />
                    <button className={isDarkMode ? 'clickBtn dark-mode' : 'clickBtn light-mode'} onClick={handleSubmit}>Create</button>
                    <button className={isDarkMode ? 'clickBtn  dark-mode' : 'clickBtn light-mode'} onClick={onClose}>Cancel</button>
                </div>
            </div>
        );
    };

    // Share Modal Component
    const ShareModal = ({ isOpen, onClose }) => {
        const [email, setEmail] = useState('');
        const [permission, setPermission] = useState('view'); // Default permission

        const handleInviteByEmail = async () => {
            // Logic to invite by email
            // console.log(`Inviting ${email} with ${permission} permission`);

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                // console.error('Invalid email format');
                toast.error('Please enter a valid email address.');
                return;
            }
            // if (!email) {
            //     toast.warn('Please enter a valid email address.');
            //     return;
            // }

            try {
                const response = await fetch(`http://localhost:5000/updateWorkspace/${currentWorkspace}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        sharedWith: [{ email, access: permission }] // Add email with permission
                    }),
                });
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.error || "network error");
                }
                // console.log(data.message); // Log success message
                toast.success(`Successfully invited *THAT* person (${email})!`); // Notify user of success

                // Reset fields after inviting
                setEmail('');
                onClose();
            } catch (error) {
                // console.error('Error inviting by email:', error);
                toast.error(`Error inviting *that* person (${email})` + error.message); // Notify user of error
            }
        };

        const handleInviteByLink = () => {
            const currentUrl = window.location.href; // Get the current page URL
            let linkToCopy = currentUrl; // Default to current URL
            linkToCopy = linkToCopy.replace('https://', '').replace('http://', '')
            linkToCopy = linkToCopy.split('/')[0] 
            linkToCopy += `/workspace/?currentWorkspace=${currentWorkspace}&${permission}`; // Append workspace name for edit permission

            // if (permission === 'edit') {
            // }
            // else if (permission === 'view'){
            //     linkToCopy += `?currentWorkspace=${currentWorkspace}`+`${permission}`;
            // }

            // Copy the link to the clipboard
            navigator.clipboard.writeText(linkToCopy)
                .then(() => {
                    // console.log('Link copied to clipboard:', linkToCopy);
                    toast.success('Link copied to clipboard!'); // Notify user
                })
                .catch(err => {
                    // console.error('Failed to copy link:', err);
                    toast.error('Failed to copy link.'); // Notify user of error
                });

            onClose();
        };

        if (!isOpen) return null;

        return (
            <div className={isDarkMode ? 'modal-overlay dark-mode' : 'modal-overlay light-mode'}>
                
                <div className={isDarkMode ? 'modal-content dark-mode' : 'modal-content light-mode'}>
                    <button style={{ border: 'none', position: 'absolute', right: '0', top: '0', margin: '1rem' }} onClick={onClose}>❌</button>
                    <div style={{ display: 'flex', justifyContent: 'space-evenly', marginTop: '3vh' }}>
                        <h2 style={{ display: 'inline' }}>Share Workspace</h2>
                        <select style={{ padding: '0 0.5rem', borderRadius: '0.5rem' }} value={permission} onChange={(e) => setPermission(e.target.value)}>
                            <option value="view">View</option>
                            <option value="edit">Edit</option>
                        </select>
                    </div>

                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter email ID"
                        className='input-fields'
                    />
                    <button className='clickBtn' style={{ marginBottom: '1rem', borderRadius: '0.5rem' }} onClick={handleInviteByEmail}>Invite by Email</button>
                    <br />
                    <button className='clickBtn' style={{ marginBottom: '1rem', borderRadius: '0.5rem' }} onClick={handleInviteByLink}>Copy Link</button>
                </div>
            </div>
        );
    };

    // New Modal Component for FormBot Creation
    const FormBotModal = ({ isOpen, onClose }) => {
        const [formbotName, setFormbotName] = useState('');
        const [commands, setCommands] = useState([]); // Initialize commands as an empty array

        const handleSubmit = async () => {
            if (formbotName) {
                const email = localStorage.getItem('fp1_email');
                const workspaceId = currentWorkspace;
                const folderName = currentFolder; // Assuming currentFolder holds the name of the folder
                const validName = /^[A-Za-z]+$/; // Regex to check if the name contains only alphabets

                if (!validName.test(formbotName)) {
                    toast.error('FormBot name should contain only alphabets.');
                    return;
                }

                try {
                    const response = await fetch('https://formbot-backend-2mmu.onrender.com/createFormbot', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            name: formbotName,
                            commands: commands, // Currently set to an empty array
                            workspaceId: workspaceId,
                            folderName: folderName
                        }),
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        // console.error('Error creating FormBot:', errorData.error);
                        return toast.error('Error creating FormBot: ' + errorData.error);
                    }
                    const data = await response.json();
                    window.location.href = `/formbot/${workspaceId}/${folderName}/${formbotName}`;
                    await fetchFormbots(currentWorkspace, currentFolder); // Refresh formbot list after creation
                    setFormbotName(''); // Reset input
                    onClose(); // Close modal
                } catch (error) {
                    // console.error('Error creating FormBot:', error);
                    toast.error('Error creating FormBot: ' + error.message);
                }
            }
        };

        if (!isOpen) return null;

        return (
            <div className={isDarkMode ? 'modal-overlay dark-mode' : 'modal-overlay light-mode'}>
                <div className={isDarkMode ? 'modal-content dark-mode' : 'modal-content light-mode'}>
                    <h2>Create New FormBot</h2>
                    <input
                        type="text"
                        value={formbotName}
                        onChange={(e) => setFormbotName(e.target.value)}
                        placeholder="Enter FormBot name"
                        className='input-fields'
                    />
                    <button className={isDarkMode ? 'clickBtn dark-mode' : 'clickBtn light-mode'} onClick={handleSubmit}>Create</button>
                    <button className={isDarkMode ? 'clickBtn dark-mode' : 'clickBtn light-mode'} onClick={onClose}>Cancel</button>
                </div>
            </div>
        );
    };

    // Delete Folder Confirmation Modal
    const DeleteFolderModal = ({ isOpen, onClose, onConfirm }) => {
        if (!isOpen) return null;

        return (
            <div className={isDarkMode ? 'modal-overlay dark-mode' : 'modal-overlay light-mode'}>
                <div className={isDarkMode ? 'modal-content dark-mode' : 'modal-content light-mode'}>
                    <h2>Confirm Delete</h2>
                    <p style={{padding:'1rem'}}>Are you sure you want to delete the folder '{folderToDelete}'?</p>
                    <button className={isDarkMode ? 'clickBtn dark-mode' : 'clickBtn light-mode'} onClick={() => {
                        confirmDeleteFolder(folderToDelete);
                        onClose();
                    }}>Delete</button>
                    <button className={isDarkMode ? 'clickBtn dark-mode' : 'clickBtn light-mode'} onClick={onClose}>Cancel</button>
                </div>
            </div>
        );
    };

    // Delete Formbot Confirmation Modal
    const DeleteFormbotModal = ({ isOpen, onClose, onConfirm }) => {
        if (!isOpen) return null;

        return (
            <div className={isDarkMode ? 'modal-overlay dark-mode' : 'modal-overlay light-mode'}>
                <div className={isDarkMode ? 'modal-content dark-mode' : 'modal-content light-mode'}>
                    <h2>Confirm Delete</h2>
                    <p style={{padding:'1rem'}}>Are you sure you want to delete the formbot '{formbotToDelete}'?</p>
                    <button className={isDarkMode ? 'clickBtn dark-mode' : 'clickBtn light-mode'} onClick={() => {
                        confirmDeleteFormbot(formbotToDelete);
                        onClose();
                    }}>Delete</button>
                    <button className={isDarkMode ? 'clickBtn dark-mode' : 'clickBtn light-mode'} onClick={onClose}>Cancel</button>
                </div>
            </div>
        );
    };

    // Actual deletion after confirmation
    const confirmDeleteFolder = async (folderName) => {
            const workspaceId = currentWorkspace; // Use the current workspace ID
    
            try {
                const response = await fetch(`https://formbot-backend-2mmu.onrender.com/deleteFolder/${workspaceId}/folder/${folderName}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
    
                if (!response.ok) {
                    throw new Error('Failed to delete folder');
                }
    
                // await fetchFolders(currentWorkspace); // Refresh folder list after deletion
                window.location.reload();
            } catch (error) {
                // console.error('Error deleting folder:', error);
                toast.error('Error deleting folder: ' + error.message); // Notify user of error
            }
    };

    const confirmDeleteFormbot = async (formbotName) => {
        
            try {
                const response = await fetch(`https://formbot-backend-2mmu.onrender.com/deleteFormbot/${formbotName}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
    
                if (!response.ok) {
                    throw new Error('Failed to delete formbot');
                }
                
                await fetchFormbots(currentWorkspace, currentFolder); // Refresh formbot list after deletion
            } catch (error) {
                // console.error('Error deleting formbot:', error);
                toast.error('Error deleting formbot: ' + error.message); // Notify user of error
            }
    };
    // THIS IS THE MAIN RETURN FUNCTION.
    return (
        <div className={isDarkMode ? 'dark-mode' : 'light-mode'}>
            <ToastContainer />
            <nav className={isDarkMode ? 'worknav dark-mode' : 'worknav light-mode'}>
                <div className="dropdown" onClick={toggleDropdown}>
                    {currentWorkspace}
                    {dropdownOpen && (
                        <div className="dropdown-content">
                            {workspaces.map(workspace => (
                                <a key={workspace.name} onClick={() => {
                                    setCurrentWorkspace(workspace.name);
                                    fetchFolders(workspace.name); // Fetch folders for the current workspace
                                    setCurrentFolder('root')
                                    fetchFormbots(workspace.name, 'root');
                                    const entry = workspace.sharedWith.find(user => user.email === localStorage.getItem('fp1_email'));
                                    if (entry.access === 'edit') {
                                        setEditStatus(true);
                                    }
                                    else {
                                        setEditStatus(false);
                                    }
                                    setDropdownOpen(false); // Close dropdown on selection
                                }}>
                                    {workspace.name}
                                </a>
                            ))}
                            {localStorage.getItem('fp1_email') && <a onClick={() => {
                                // Navigate to settings
                                window.location.href = '/settings';
                                setDropdownOpen(false); // Close dropdown
                            }}>
                                Settings
                            </a>}
                            {localStorage.getItem('fp1_email') && <a onClick={() => {
                                handleLogout();
                                setDropdownOpen(false); // Close dropdown
                            }}>
                                Logout
                            </a>}
                        </div>
                    )}
                </div>
                {/* <button onClick={handleToggleDarkMode} style={{color: #1A5FFF }}> </button> */}
                <Slider isDarkMode={isDarkMode} handleToggleDarkMode={handleToggleDarkMode} />
                {localStorage.getItem('fp1_email') && <button className='clickBtn' style={{maxWidth:'5rem'}} onClick={() => setIsShareModalOpen(true)}>Share</button>}
            </nav>
            {/* New file explorer UI */}
            <div className="file-explorer">
                <div className="folders">
                    {Editable && <div onClick={() => setIsModalOpen(true)} className='folder'>Create Folder</div>}
                    <div onClick={() => handleFolderClick('root')} className='folder'> /(Root)</div>
                    {folders.map(folder => (
                        folder !== 'root' && ( //Janky check to ensure root doesn't "appear twice"
                            <div key={folder} className="folder" onClick={() => handleFolderClick(folder)}>
                                <span style={{ marginRight: '0.5rem', backgroundColor: '#AAAAAA' }}>{folder}</span>
                                {Editable && <img src={trashIcon} style={{ border: 'none', backgroundColor: '#AAAAAA' }} onClick={() => handleDeleteFolder(folder)}></img>}
                            </div>
                        )
                    ))}
                </div>
                <div className="formbots">
                    {Editable && <div onClick={() => setIsFormBotModalOpen(true)} className='formbot-card'>Create FormBot</div>}
                    {formbots.map(formbot => (
                        <div key={formbot.name} className="formbot-card" >
                            {Editable && <img src={trashIcon} style={{ border: 'none', backgroundColor: 'rgba(0,0,0,0)', position:'absolute', top:'0', right:'0', padding:'0.5rem', zIndex:'2' }} onClick={() => handleDeleteFormbot(formbot.name)}></img>}
                            <span style={{cursor:'pointer', backgroundColor:'rgba(0,0,0,0)', padding:'2rem'}} onClick={() => window.location.href = `/formbot/${currentWorkspace}/${currentFolder}/${formbot.name}`} >{formbot.name}</span>
                        </div>
                    ))}
                </div>
            </div>
            {/* Additional component content */}

            {/* Modal for folder creation */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onCreate={handleCreateFolder}
            />

            {/* Share Modal */}
            <ShareModal
                isOpen={isShareModalOpen}
                onClose={() => setIsShareModalOpen(false)}
            />

            {/* Modal for FormBot creation */}
            <FormBotModal
                isOpen={isFormBotModalOpen}
                onClose={() => setIsFormBotModalOpen(false)}
            // onCreate={handleCreateFormbot}
            />

            <DeleteFolderModal
                isOpen={isDeleteFolderModalOpen}
                onClose={() => setIsDeleteFolderModalOpen(false)}
                onConfirm={confirmDeleteFolder}
            />

            <DeleteFormbotModal
                isOpen={isDeleteFormbotModalOpen}
                onClose={() => setIsDeleteFormbotModalOpen(false)}
                onConfirm={confirmDeleteFormbot}
            />
        </div>
    );
}


export default Workspace;
