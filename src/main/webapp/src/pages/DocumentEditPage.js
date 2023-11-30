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

const generateSessionId = () => {
  return `guest_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
};

function DocumentEditPage() {
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
        const getDocumentApi = `http://localhost:8080/api/documents/id/${documentID}`;
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
        link.download = 'download.js';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(href);
    };

  return (
    <div>
        <NavBar
          displayInfo={{ label: "Document Name", value: documentName }}
          showDownloadButton={true}
          onDownload={handleDownload}
          onLogout={handleLogout}
          onBackToDocument={handleBackToDocument}
        />

      <Editor
        height="90vh"
        theme="dark"
        defaultLanguage="javascript"
        value={documentContent}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
      />
    </div>
  );
}

export default DocumentEditPage;
