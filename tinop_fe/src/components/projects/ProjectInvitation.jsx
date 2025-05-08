import React, {useEffect, useState} from 'react';
import {getAuthToken} from '../../utils/tokenAuth.js';
import {toast} from 'react-toastify';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTrash} from '@fortawesome/free-solid-svg-icons';

const ProjectInvitation = ({isOpen, project, onClose}) => {
    const [availableUsers, setAvailableUsers] = useState([]);
    const [selectedUserEmails, setSelectedUserEmails] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [members, setMembers] = useState([]);
    const [loadingMembers, setLoadingMembers] = useState(false);
    const [errorMembers, setErrorMembers] = useState(null);
    const [sendingInvites, setSendingInvites] = useState(false);
    const [memberToRemove, setMemberToRemove] = useState(null);

    useEffect(() => {
        if (isOpen && project && project.id) {
            fetchAvailableUsers();
            fetchMembers();
            setSelectedUserEmails([]);
            setSearchTerm('');
            setMemberToRemove(null);
        }
    }, [isOpen, project]);

    // Načte dostupné uživatele z endpointu, který vrací strukturu:
    // {
    //   "status": "success",
    //   "data": { "emails": [ "email1", "email2", ... ] }
    // }
    const fetchAvailableUsers = async () => {
        try {
            const response = await fetch(
                `http://127.0.0.1:8000/api/projects/${project.id}/noUsersInProject`,
                {
                    headers: {
                        'Authorization': `Bearer ${getAuthToken()}`,
                        'Accept': 'application/json',
                    },
                }
            );
            if (!response.ok) {
                throw new Error("Error fetching available users");
            }
            const json = await response.json();
            // Získáme pole emailů z json.data.emails
            const emails = json?.data?.emails || [];
            setAvailableUsers(emails);
            setFilteredUsers(emails);
        } catch (err) {
            toast.error("Error fetching available users: " + err.message);
        }
    };

    // Načte aktuální členy projektu
    const fetchMembers = async () => {
        setLoadingMembers(true);
        try {
            const response = await fetch(
                `http://127.0.0.1:8000/api/projects/${project.id}/allUsers`,
                {
                    headers: {
                        'Authorization': `Bearer ${getAuthToken()}`,
                        'Accept': 'application/json',
                    },
                }
            );
            if (!response.ok) {
                throw new Error("Error fetching project members");
            }
            const data = await response.json();
            const membersArray = Array.isArray(data)
                ? data
                : data.data
                    ? data.data
                    : [];
            setMembers(membersArray);
        } catch (err) {
            setErrorMembers(err.message);
        } finally {
            setLoadingMembers(false);
        }
    };

    // Filtrování dostupných uživatelů podle vyhledávacího řetězce
    useEffect(() => {
        if (searchTerm.trim() === "") {
            setFilteredUsers(availableUsers);
        } else {
            const lowerSearch = searchTerm.toLowerCase();
            const filtered = availableUsers.filter(email =>
                email.toLowerCase().includes(lowerSearch)
            );
            setFilteredUsers(filtered);
        }
    }, [searchTerm, availableUsers]);

    // Přepínání výběru uživatele
    const toggleSelectUser = (email) => {
        if (selectedUserEmails.includes(email)) {
            setSelectedUserEmails(selectedUserEmails.filter((item) => item !== email));
        } else {
            setSelectedUserEmails([...selectedUserEmails, email]);
        }
    };

    // Odešle pozvánky se všemi vybranými emaily
    const handleSendInvites = async () => {
        if (selectedUserEmails.length === 0) return;
        setSendingInvites(true);
        try {
            const response = await fetch(
                `http://127.0.0.1:8000/api/projects/${project.id}/invite`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${getAuthToken()}`,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    body: JSON.stringify({emails: selectedUserEmails}),
                }
            );
            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message || 'Error sending invitations');
            }
            toast.success("Invitations sent successfully");
            setSelectedUserEmails([]);
            fetchAvailableUsers();
            fetchMembers();
        } catch (err) {
            toast.error("Error sending invitations: " + err.message);
        } finally {
            setSendingInvites(false);
        }
    };

    // Odstranění člena s potvrzením ve vlastním modalu
    const confirmRemoveMember = async (memberId) => {
        try {
            const response = await fetch(
                `http://127.0.0.1:8000/api/projects/${project.id}/users/${memberId}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${getAuthToken()}`,
                        'Accept': 'application/json',
                    },
                }
            );
            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message || 'Error removing member');
            }
            toast.success("Member removed successfully");
            fetchMembers();
        } catch (err) {
            toast.error("Error removing member: " + err.message);
        } finally {
            setMemberToRemove(null);
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 backdrop-brightness-50 backdrop-blur-lg flex items-center justify-center p-4 z-50"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-lg p-6 w-full max-w-lg mx-auto shadow-xl flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-2xl font-bold mb-4 text-gray-800">
                    Invite Users for {project.name}
                </h2>

                {/* Multiselect s vyhledáváním dostupných uživatelů */}
                <div className="mb-4">
                    <label className="block text-gray-700 mb-1">Search and select users to invite</label>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-400"
                        placeholder="Search by email"
                    />
                    <div className="mt-2 max-h-60 overflow-y-auto border rounded p-2">
                        {filteredUsers.map((email, index) => (
                            <div
                                key={index}
                                className={`p-2 rounded cursor-pointer ${selectedUserEmails.includes(email) ? 'bg-blue-200' : 'hover:bg-gray-100'}`}
                                onClick={() => toggleSelectUser(email)}
                            >
                                {email}
                            </div>
                        ))}
                        {filteredUsers.length === 0 && (
                            <div className="p-2 text-gray-500">No users found</div>
                        )}
                    </div>
                </div>

                <button
                    onClick={handleSendInvites}
                    disabled={sendingInvites || selectedUserEmails.length === 0}
                    className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    {sendingInvites ? 'Sending...' : 'Send Invitations'}
                </button>

                <hr className="my-4"/>

                <h3 className="text-xl font-semibold mb-2">Project Members</h3>
                {loadingMembers ? (
                    <p>Loading members...</p>
                ) : errorMembers ? (
                    <p className="text-red-500">{errorMembers}</p>
                ) : (
                    <ul className="space-y-2">
                        {members.length > 0 ? (
                            members.map((member) => (
                                <li
                                    key={member.id}
                                    className="flex items-center justify-between bg-gray-50 p-2 rounded"
                                >
                  <span>
                    {member.email}
                      {member.name ? ` (${member.name})` : ''}
                  </span>
                                    <button onClick={() => setMemberToRemove(member)} title="Remove Member">
                                        <FontAwesomeIcon icon={faTrash} className="text-red-500 hover:text-red-700"/>
                                    </button>
                                </li>
                            ))
                        ) : (
                            <p>No members in this project.</p>
                        )}
                    </ul>
                )}

                <div className="mt-6 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                    >
                        Close
                    </button>
                </div>

                {/* Vlastní modal pro potvrzení odstranění člena */}
                {memberToRemove && (
                    <div className="fixed inset-0 flex items-center justify-center z-50">
                        <div
                            className="absolute inset-0 bg-gray-800 opacity-50"
                            onClick={() => setMemberToRemove(null)}
                        ></div>
                        <div
                            className="bg-white rounded shadow-lg z-10 p-6 w-full max-w-md mx-auto flex flex-col justify-center">
                            <p className="text-gray-800 mb-6">
                                Are you sure you want to remove this member?
                            </p>
                            <div className="flex justify-end space-x-2">
                                <button
                                    onClick={() => setMemberToRemove(null)}
                                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => confirmRemoveMember(memberToRemove.id)}
                                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default ProjectInvitation;
