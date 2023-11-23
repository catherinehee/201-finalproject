package com.csci201.finalproject.Document;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;

import com.csci201.finalproject.User.User;
import com.google.cloud.firestore.*;
import org.springframework.stereotype.Service;

import com.google.api.core.ApiFuture;
import com.google.firebase.cloud.FirestoreClient;

import javax.print.Doc;

@Service
public class DocumentService {
    private static final String COLLECTION_NAME ="documents" ;

    public String saveDocument(Document document) throws ExecutionException, InterruptedException {

        Firestore dbFirestore= FirestoreClient.getFirestore();

        ApiFuture<WriteResult> collectionApiFuture=dbFirestore.collection(COLLECTION_NAME).document(document.getName()).set(document);

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

        ApiFuture<WriteResult> collectionApiFuture=dbFirestore.collection(COLLECTION_NAME).document(document.getName()).set(document);

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
}
