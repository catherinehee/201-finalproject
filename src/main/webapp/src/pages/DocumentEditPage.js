import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { ref, onValue, set, onDisconnect } from 'firebase/database';
import { database } from '../firebase';
import Editor from '@monaco-editor/react';
import '../css/DocumentEditPage.css';
import NavBar from '../components/navBar';
import {useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faJs, faCss3Alt, faHtml5, faJava } from '@fortawesome/free-brands-svg-icons';
import { faFileAlt, faFile } from '@fortawesome/free-solid-svg-icons';

const generateSessionId = () => {
  return `guest_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
};

const getFileExtension = (filename) => {
    const parts = filename.split('.');
    return parts[parts.length - 1];
};

const extensionToLanguage = {
    'js': 'javascript',
    'css': 'css',
    'html': 'html',
    'java': 'java',
    'txt': 'plaintext',
};

function DocumentEditPage() {
  const API_BASE_URL = "https://cs201-final.appspot.com";
  const userid = Cookies.get('uid');
  const { documentID } = useParams();

  const [documentName, setDocumentName] = useState('');
  const [documentContent, setDocumentContent] = useState('');
  const [userID] = useState(generateSessionId());
  const editorRef = useRef(null);
  const monacoRef = useRef(null);
  var decorations = [];
    const navigate = useNavigate();

  useEffect(() => {
    const contentRef = ref(database, 'documents/' + documentID + '/content');
    const unsubscribeContent = onValue(contentRef, (snapshot) => {
      const content = snapshot.val();
      setDocumentContent(content ?? 'Document not found');
    });

    const cursorRef = ref(database, `documents/${documentID}/cursors/${userID}`);
    onDisconnect(cursorRef).remove();

    const cursorsRef = ref(database, `documents/${documentID}/cursors`);
    const unsubscribeCursors = onValue(cursorsRef, (snapshot) => {
      const cursors = snapshot.val();
      if (editorRef.current && monacoRef.current) {
        updateCursorsAndSelections(cursors);
      }
    });

    const getDocumentName = (documentID) => {
        const getDocumentApi = `${API_BASE_URL}/api/documents/id/${documentID}`;
        axios.get(getDocumentApi)
            .then((response) => response.data)
            .then((data) => {
                setDocumentName(data);
            })
            .catch((error) => { console.error(error); });
    };

    getDocumentName(documentID);

    return () => {
      unsubscribeContent();
      unsubscribeCursors();
      set(cursorRef, null);
    };
  }, [documentID, userID]);

    const languageMode = extensionToLanguage[getFileExtension(documentName)] || 'plaintext';
    console.log("Language Mode:", languageMode);

    useEffect(() => {
        if (editorRef.current && monacoRef.current) {
            const model = editorRef.current.getModel();
            if (model) {
                monacoRef.current.editor.setModelLanguage(model, languageMode);
            }
        }
    }, [documentName, languageMode]);


    const updateCursorsAndSelections = (cursors) => {
    console.log('updateCursorsAndSelections called with:', cursors);

    if (!monacoRef.current || !editorRef.current) return;

    const newDecorations =  Object.entries(cursors || {}).map(([id, cursorData]) => {
       console.log("ID: " + id);
       console.log(cursorData);
       var dec = [];
       if (id === userID) return []; // Ignore own cursor
       // Cursor Decoration
       dec.push({
         range: new monacoRef.current.Range(cursorData.line, cursorData.column, cursorData.line, cursorData.column),
         options: { isWholeLine: false, className: 'remote-cursor' }
       });
       // Selection Highlighting (if present)
       if (cursorData.selection && cursorData.selection.startLineNumber !== cursorData.selection.endLineNumber) {
         dec.push({
           range: new monacoRef.current.Range(
             cursorData.selection.startLineNumber,
             cursorData.selection.startColumn,
             cursorData.selection.endLineNumber,
             cursorData.selection.endColumn
           ),
           options: { className: 'remote-selection' }
         });
       }
       return dec;
     }).flat();
     console.log(decorations)

    // Clear existing decorations and apply the new ones
    decorations = editorRef.current.deltaDecorations(decorations, newDecorations);
  };

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    monaco.editor.defineTheme('customTheme', {
      base: 'vs-dark',
      inherit: true,
      rules: [], 
      colors: {
          'editor.background': '#141a30', // Changing only the background color
      }
    });
    
    monaco.editor.setTheme('customTheme');

    editor.onDidChangeCursorPosition(({ position }) => {
      const selection = editor.getSelection();
      const cursorData = {
        line: position.lineNumber,
        column: position.column,
        selection: {
          startLineNumber: selection.startLineNumber,
          startColumn: selection.startColumn,
          endLineNumber: selection.endLineNumber,
          endColumn: selection.endColumn
        }
      };
      const cursorRef = ref(database, `documents/${documentID}/cursors/${userID}`);
      set(cursorRef, cursorData).catch(console.error);
    });
  };

    const handleLogout = () => {
        document.cookie = 'uid=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
        navigate('/login');
    };

    const handleBackToDocument = () => {
        navigate(`/${userid}/files`);
    };

  const handleEditorChange = (value, event) => {
    setDocumentContent(value);
    const contentRef = ref(database, 'documents/' + documentID + '/content');
    set(contentRef, value).catch(console.error);
  };

  const handleDownload = () => {
        if (!editorRef.current) return;

        const code = editorRef.current.getValue();
        const blob = new Blob([code], { type: 'text/javascript' });
        const href = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = href;
        link.download = documentName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(href);
    };

    const getIconForExtension = (ext) => {
        switch (ext) {
            case 'js':
                return <FontAwesomeIcon icon={faJs} className="icon-js2" />;
            case 'css':
                return <FontAwesomeIcon icon={faCss3Alt} className="icon-css2" />;
            case 'html':
                return <FontAwesomeIcon icon={faHtml5} className="icon-html2" />;
            case 'java':
                return <FontAwesomeIcon icon={faJava} className="icon-java2" />;
            case 'txt':
                return <FontAwesomeIcon icon={faFileAlt} className="icon-txt2" />;
            default:
                return <FontAwesomeIcon icon={faFile} className="icon-else2" />;
        }
    };

    const documentIcon = getIconForExtension(getFileExtension(documentName));
    const displayInfo = {
        label: "Current File",
        value: (
            <>
                {documentIcon}
                <span className="document-name">{documentName}</span>
            </>
        ),
    };

  return (
    <div>
        <NavBar
            displayInfo={displayInfo}
            showDownloadButton={true}
            onDownload={handleDownload}
            onLogout={handleLogout}
            onBackToDocument={handleBackToDocument}
        />
      <Editor
        height="90vh"
        theme="dark"
        defaultLanguage={languageMode}
        value={documentContent}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
      />
    </div>
  );
}

export default DocumentEditPage;
