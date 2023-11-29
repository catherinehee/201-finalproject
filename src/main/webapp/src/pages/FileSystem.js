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

    const API_BASE_URL = "https://cs201-final.appspot.com";

    useEffect(() => {
        const retrieveDocuments = () => {
            const retrieveDocumentsApi = `${API_BASE_URL}/api/users/${uid}/documents`;
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
    }, []);

    const openDocument = (documentId) => {
        navigate(`/documents/edit/${documentId}`);
    };

    const addDocument = (documentName) => {
                const addDocumentApi = `${API_BASE_URL}/api/documents/${uid}/${documentName}/add`;

                axios.patch(addDocumentApi )
                    .then((response) => {
                        if (response.data == "DUPLICATE") {
                            console.log(response.data);
                            window.alert("Don't add duplicate document names!");
                        }
                        else {
                            console.log(response.data);
                            const newDocumentId = response.data.id;

                            // Update documents list with the new document ID
                            const newDocument = {
                                id: newDocumentId,
                                name: documentName
                            }
                            setDocuments((prevDocuments) => [...prevDocuments, newDocument]);

                            const updateUserDocumentsApi = `${API_BASE_URL}/api/users/${uid}/documents/${newDocument.id}/add`;
                            axios.patch(updateUserDocumentsApi)
                            .then((updateResp) => {
                                console.log(updateResp.data);
                            })
                            .catch((error) => {
                                console.error(error);
                            });
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                    });
                };


        const removeDocument = (documentId) => {
                    const removeDocumentApi = `${API_BASE_URL}/api/users/${uid}/documents/${documentId}/delete`;
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


            const handleBackToDocument = () => {
               navigate('/${uid}/files');
            };
            const handleLogout = () => {
            document.cookie = 'uid=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
            navigate('/login');
        };


            useEffect(() => { // runs every time documents gets updated (re-renders page documents page)
                console.log('Documents have been updated:', documents);
                }, [documents]);

    return (
    <div>
           <NavBar
             displayInfo={{ label: "User ID", value: uid }}
             onLogout={handleLogout}
             onBackToDocument={handleBackToDocument}
             showBackButton={false}
           />
        <div className="file-system-container">

            <div className="add-document-bar">
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
                        <p>Add your first document!</p>

                    }
                </ul>
            </div>
        </div>
        </div>

    );
}

export default FileSystem;