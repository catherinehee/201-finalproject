import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { ref, onValue, set, onDisconnect } from 'firebase/database';
import { database } from '../firebase';
import Editor from '@monaco-editor/react';
import '../css/DocumentEditPage.css';

const generateSessionId = () => {
  return `guest_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
};

function DocumentEditPage() {
  const { documentID } = useParams();
  const [documentContent, setDocumentContent] = useState('');
  const [userID] = useState(generateSessionId());
  const editorRef = useRef(null);
  const monacoRef = useRef(null);

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
       if (id === userID) return []; // Ignore own cursor
       const decorations = [];
       // Cursor Decoration
       decorations.push({
         range: new monacoRef.current.Range(cursorData.line, cursorData.column, cursorData.line, cursorData.column),
         options: { isWholeLine: false, className: 'remote-cursor' }
       });
       // Selection Highlighting (if present)
       if (cursorData.selection && cursorData.selection.startLineNumber !== cursorData.selection.endLineNumber) {
         decorations.push({
           range: new monacoRef.current.Range(
             cursorData.selection.startLineNumber,
             cursorData.selection.startColumn,
             cursorData.selection.endLineNumber,
             cursorData.selection.endColumn
           ),
           options: { className: 'remote-selection' }
         });
       }
       return decorations;
     }).flat();

    // Clear existing decorations and apply the new ones
    editorRef.current.deltaDecorations([], newDecorations);
  };

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

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

  const handleEditorChange = (value, event) => {
    setDocumentContent(value);
    const contentRef = ref(database, 'documents/' + documentID + '/content');
    set(contentRef, value).catch(console.error);
  };

  return (
    <div>
      <h1>Editing Document: {documentID}</h1>
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