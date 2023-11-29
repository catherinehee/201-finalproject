package com.csci201.finalproject.Document;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;

import com.csci201.finalproject.User.User;
import com.google.cloud.firestore.*;
import com.google.firebase.database.*;
import lombok.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.google.api.core.ApiFuture;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.context.annotation.DependsOn;

import javax.print.Doc;

@DependsOn("Firebase")
@Service
public class DocumentService {
    private static final String COLLECTION_NAME ="documents" ;

    // ADDING TO REALTIME DATABASE
    public ResponseEntity<Object> addDocument(String userid, String docName) throws ExecutionException, InterruptedException {
        final FirebaseDatabase database = FirebaseDatabase.getInstance();
        DatabaseReference ref = database.getReference("documents");
        DatabaseReference newDocRef = ref.push();
        Document newDoc = new Document(userid, new ArrayList<String>(), "", docName);
        newDocRef.setValueAsync(newDoc);

        Map<String, String> data = new HashMap<>();
        data.put("id", newDocRef.getKey());
        data.put("name", docName);

        addDocumentToFirestore(data);

        return new ResponseEntity<>(data, HttpStatus.OK);
    }

    public void addDocumentToFirestore(Map<String, String> data) {
        Firestore dbFirestore= FirestoreClient.getFirestore();
        Map<String, Object> dataName = new HashMap<>();
        dataName.put("name", data.get("name"));
        ApiFuture<WriteResult> collectionApiFuture=dbFirestore.collection(COLLECTION_NAME).document(data.get("id")).set(dataName);


    }
    public String saveDocument(Document document) throws ExecutionException, InterruptedException {

        Firestore dbFirestore= FirestoreClient.getFirestore();

        ApiFuture<WriteResult> collectionApiFuture=dbFirestore.collection(COLLECTION_NAME).document(document.getDocName()).set(document);

        return collectionApiFuture.get().getUpdateTime().toString();

    }

    public Document getDocumentDetailsByName(String name) throws ExecutionException, InterruptedException {
        Firestore dbFirestore= FirestoreClient.getFirestore();

        DocumentReference documentReference=dbFirestore.collection(COLLECTION_NAME).document(name);

        ApiFuture<DocumentSnapshot> future=documentReference.get();

        DocumentSnapshot documentSnapshot =future.get();

        Document document = null;
        if(documentSnapshot.exists()) {
            document = documentSnapshot.toObject(Document.class);
            return document;
        }else{
            return null;
        }
    }

    public String getDocumentNameById(String docid) throws ExecutionException, InterruptedException {
        Firestore dbFirestore= FirestoreClient.getFirestore();

        DocumentReference documentReference=dbFirestore.collection(COLLECTION_NAME).document(docid); // username = document name

        ApiFuture<DocumentSnapshot> future=documentReference.get();

        DocumentSnapshot document=future.get();

        return document.get("name", String.class);
    }

    public List<Document> getDocumentDetails() throws ExecutionException, InterruptedException {

        Firestore dbFirestore= FirestoreClient.getFirestore();

        Iterable<DocumentReference> documentReference=dbFirestore.collection(COLLECTION_NAME).listDocuments();
        List<Document> docList=new ArrayList<>();
        Document document=null;

        for (DocumentReference documentReference1 : documentReference) {
            ApiFuture<DocumentSnapshot> future= documentReference1.get();
            DocumentSnapshot documentSnapshot=future.get();

            document=documentSnapshot.toObject(Document.class);
            docList.add(document);
        }
        return docList;
    }

    public String updateDocument(Document document) throws ExecutionException, InterruptedException {

        Firestore dbFirestore= FirestoreClient.getFirestore();

        ApiFuture<WriteResult> collectionApiFuture=dbFirestore.collection(COLLECTION_NAME).document(document.getDocName()).set(document);

        return collectionApiFuture.get().getUpdateTime().toString();

    }

    public String deleteDocument(String name) throws ExecutionException, InterruptedException {

        Firestore dbFirestore= FirestoreClient.getFirestore();

        ApiFuture<WriteResult> collectionApiFuture=dbFirestore.collection(COLLECTION_NAME).document(name).delete();

        return "Document with Document ID"+name+" has been deleted successfully";

    }

    /**
     * Update document string
     */
    public String updateDocumentContent(String newContent, String name) throws ExecutionException, InterruptedException {

        Firestore dbFirestore= FirestoreClient.getFirestore();

        ApiFuture<WriteResult> collectionApiFuture=dbFirestore.collection(COLLECTION_NAME).document(name).update("content", newContent);

        return collectionApiFuture.get().getUpdateTime().toString();

    }

    /**
     * update permission (add collaborators)
     * @param username
     * @param name
     * @return
     * @throws ExecutionException
     * @throws InterruptedException
     */
    public String addCollaborator(String username, String name) throws ExecutionException, InterruptedException {

        Firestore dbFirestore= FirestoreClient.getFirestore();

        ApiFuture<WriteResult> collectionApiFuture=dbFirestore.collection(COLLECTION_NAME).document(name).update("content", FieldValue.arrayUnion(username));
        // note: TODO: update username's document array

        return collectionApiFuture.get().getUpdateTime().toString();
    }


    /**
     * update permission (remove collaborators)
     * @param username
     * @param name
     * @return
     * @throws ExecutionException
     * @throws InterruptedException
     */
    public String removeCollaborator(String username, String name) throws ExecutionException, InterruptedException {

        Firestore dbFirestore= FirestoreClient.getFirestore();

        ApiFuture<WriteResult> collectionApiFuture=dbFirestore.collection(COLLECTION_NAME).document(name).update("content", FieldValue.arrayRemove(username));

        // note: TODO: update username's document array
        return collectionApiFuture.get().getUpdateTime().toString();
    }

    // todo: GET DOCUMENT NAME BY ID
}
