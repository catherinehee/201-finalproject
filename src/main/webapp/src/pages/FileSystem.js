
import React, {useState, useEffect} from 'react';
import axios from 'axios';
import NavBar from '../components/navBar';
import { useParams, useNavigate } from 'react-router-dom';


function FileSystem() {
    let { uid } = useParams();
    const [documents, setDocuments] = useState([]);
    const [newDocumentName, setNewDocumentName] = useState("");
    const navigate = useNavigate();

    // render header: with current user info -> user id
    useEffect(() => {
        const retrieveDocuments = () => {
            const retrieveDocumentsApi =  `http://localhost:8080/api/users/${uid}/documents`
            console.log(retrieveDocumentsApi);
            axios.get(retrieveDocumentsApi)
                .then((response) => response.data)
                .then((data) => {
                    setDocuments(data);
                })
                .catch((error) => {
                    console.log(error);
                })

        }
        console.log("retrieving documents");
        retrieveDocuments();
    }, [uid])

    const openDocument = (documentId) => {
        navigate(`/documents/edit/${documentId}`)
    }

    const addDocument = (documentName) => {
            const addDocumentApi = `http://localhost:8080/api/documents/${uid}/${documentName}/add`;

            axios.post(addDocumentApi )
                .then((response) => {
                    const newDocumentId = response.data;

                    // Update documents list with the new document ID
                    setDocuments((prevDocuments) => [...prevDocuments, newDocumentId]);

                    const updateUserDocumentsApi = `http://localhost:8080/api/users/${uid}/documents/${newDocumentId}/add`;
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

                    axios.delete(removeDocumentApi)
                        .then(() => {
                            // Update documents list by removing the specified document
                            setDocuments((prevDocuments) => prevDocuments.filter((id) => id !== documentId));
                        })
                        .catch((error) => {
                            console.log(error);
                        });
                    };

            useEffect(() => { // runs every time documents gets updated (re-renders page documents page)
                console.log('Documents have been updated:', documents);
                }, [documents]);
    return (
        <div>

            {/* Render header with current user info */}
            <NavBar uid={uid}/>

            {/* Render documents */}
            <h3>Documents:</h3>
            <ul>
                  {Array.isArray(documents) ? (
                    documents.map((documentId, index) => (
                      <li key={index}>
                        {documentId}
                        <button onClick={() => removeDocument(documentId)}>Remove Document</button>
                        <button onClick={() => openDocument(documentId)}>Open Document</button>
                      </li>
                    ))
                  ) : (
                    <p>Loading documents...</p>
                  )}
            </ul>


             {/* Add Document form */}
            <div>
                <label htmlFor="newDocumentName">New Document Name:</label>
                <input
                type="text"
                id="newDocumentName"
                value={newDocumentName}
                onChange={(e) => setNewDocumentName(e.target.value)}
                />
                <button onClick={() => addDocument(newDocumentName)}>Add Document</button>
            </div>

        </div>
    );


}

export default FileSystem;