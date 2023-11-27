import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavBar from '../components/navBar';
import { useParams, useNavigate } from 'react-router-dom';
import '../css/FileSystem.css';

function FileSystem() {
    let { uid } = useParams();
    const [documents, setDocuments] = useState([]);
    const [newDocumentName, setNewDocumentName] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const retrieveDocuments = () => {
            const retrieveDocumentsApi = `http://localhost:8080/api/users/${uid}/documents`;
            axios.get(retrieveDocumentsApi)
                .then((response) => response.data)
                .then((data) => {
                    console.log(data);
                    setDocuments(data);
                })
                .catch((error) => {
                    console.error(error);
                });
        };
        retrieveDocuments();
    }, [uid]);

    const openDocument = (documentId) => {
        navigate(`/documents/edit/${documentId}`);
    };

    const addDocument = (documentName) => {
                const addDocumentApi = `http://localhost:8080/api/documents/${uid}/${documentName}/add`;

                axios.post(addDocumentApi )
                    .then((response) => {
                        console.log(response.data)
                        const newDocumentId = response.data.id;

                        // Update documents list with the new document ID
                        const newDocument = {
                            id: newDocumentId,
                            name: documentName
                        }
                        setDocuments((prevDocuments) => [...prevDocuments, newDocument]);

                        const updateUserDocumentsApi = `http://localhost:8080/api/users/${uid}/documents/${newDocument.id}/add`;
                        axios.patch(updateUserDocumentsApi)
                        .then((updateResp) => {
                            console.log(updateResp.data);
                        })
                        .catch((error) => {
                            console.error(error);
                        });
                    })
                    .catch((error) => {
                        console.log(error);
                    });
                };


        const removeDocument = (documentId) => {
                    const removeDocumentApi = `http://localhost:8080/api/users/${uid}/documents/${documentId}/delete`;
                    console.log(removeDocumentApi);
                    axios.delete(removeDocumentApi)
                        .then(() => {
                            // Update documents list by removing the specified document
                            setDocuments((prevDocuments) => prevDocuments.filter((data) => data.id !== documentId));
                        })
                        .catch((error) => {
                            console.log(error);
                        });
                    };
                    
        //THE LOGOUT FUNCTION -> FOR JUN!!!
        const handleLogout = () => {
            document.cookie = 'uid=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';       
            navigate('/login');
        };

            useEffect(() => { // runs every time documents gets updated (re-renders page documents page)
                console.log('Documents have been updated:', documents);
                }, [documents]);

    return (
        <div className="file-system-container">
            <NavBar uid={uid} />
            <div className="add-document-bar">
            <button className="logout-button" onClick={handleLogout}>Logout</button>
                <input
                    type="text"
                    id="newDocumentName"
                    placeholder="Enter document name"
                    value={newDocumentName}
                    onChange={(e) => setNewDocumentName(e.target.value)}
                />
                <button id="add-document-button" onClick={() => addDocument(newDocumentName)}>Add Document</button>
            </div>
            <div className="documents-list">
                <h3>Documents:</h3>
                <ul>
                    {
                    Array.isArray(documents) ? (
                    documents.map((document, index) => (
                        <li key={index} className="document-item">
                            <span className="document-name">{document.name}</span>
                            <button onClick={() => openDocument(document.id)}>View</button>
                            <button onClick={() => removeDocument(document.id)}>Delete</button>
                        </li>
                        ) )):
                        <p>Loading documents... </p>

                    }
                </ul>
            </div>
        </div>
    );
}

export default FileSystem;