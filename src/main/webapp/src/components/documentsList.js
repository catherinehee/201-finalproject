import React, {useState, useEffect} from 'react';
import axios from 'axios';



function DocumentList() {
    const [documents, setDocuments] = useState([]);
    const apiUrl = "";
    useEffect (() => {
        axios.get(apiUrl)
        .then(response => {

            const dummyResponse = [

                {
                    "id": "1",
                    "name": "Document 1"
                }
            ];
            setDocuments(response.data);
        })
        .catch(error => {
            console.error("error fetching documents");
        });
    }, [])
    return (
        <div>
            <h2>
                Documents
            </h2>
            <ul>
                {
                    documents.map(document => (
                        <li key={document.id}>{document.name}</li>
                    ))
                }
            </ul>
        </div>
    )
}

export default DocumentList;