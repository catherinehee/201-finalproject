package com.csci201.finalproject.User;

import java.sql.Array;
import java.util.*;
import java.util.concurrent.ExecutionException;

import com.csci201.finalproject.Document.Document;
import com.csci201.finalproject.Document.DocumentService;
import com.google.cloud.firestore.*;
import org.springframework.context.annotation.DependsOn;
import org.springframework.stereotype.Service;

import com.google.api.core.ApiFuture;
import com.google.firebase.cloud.FirestoreClient;

@Service
@DependsOn("Firebase")
public class UserService {
    private static final String COLLECTION_NAME ="users" ;

    public List<Map<String, String>> getDocumentsByUser(String userid) throws ExecutionException, InterruptedException {
        Firestore dbFirestore= FirestoreClient.getFirestore();

        DocumentReference documentReference=dbFirestore.collection(COLLECTION_NAME).document(userid); // username = document name

        ApiFuture<DocumentSnapshot> future=documentReference.get();

        DocumentSnapshot document=future.get();

        DocumentService documentService = new DocumentService();
        if(document.exists()) {
            List<String> arr  = (List<String>) document.get("documents");
            if (arr != null && !arr.isEmpty()) {
                List<Map<String, String>> docInfo = new ArrayList<>();
                for (String docid : arr) {
                    Map<String, String> map = new HashMap<>();
                    map.put("id", docid);
                    map.put("name", documentService.getDocumentNameById(docid));

                    docInfo.add(map);
                }

                return docInfo;
            }
        }
        return null;
    }

    public Set<String> getDocumentNamesByUser(String userid) throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();

        DocumentReference documentReference = dbFirestore.collection(COLLECTION_NAME).document(userid); // username = document name

        ApiFuture<DocumentSnapshot> future = documentReference.get();

        DocumentSnapshot document = future.get();

        DocumentService documentService = new DocumentService();
        if(document.exists()) {
            List<String> arr  = (List<String>) document.get("documents");
            if (arr != null && !arr.isEmpty()) {
                LinkedList<String> ll = new LinkedList<>(arr);
                Set<String> st = new HashSet<>();
                for (String docid : ll) {
                    st.add(documentService.getDocumentNameById(docid));
                }

                return st;
            }
        }
        return Collections.emptySet();
    }

    public String saveUser(User user) throws ExecutionException, InterruptedException {

        Firestore dbFirestore= FirestoreClient.getFirestore();

        ApiFuture<WriteResult> collectionApiFuture=dbFirestore.collection(COLLECTION_NAME).document(user.getId()).set(user);

        return collectionApiFuture.get().getUpdateTime().toString();

    }

    public User getUserDetailsByUsername(String username) throws ExecutionException, InterruptedException {

        Firestore dbFirestore= FirestoreClient.getFirestore();

        DocumentReference documentReference=dbFirestore.collection(COLLECTION_NAME).document(username); // username = document name

        ApiFuture<DocumentSnapshot> future=documentReference.get();

        DocumentSnapshot document=future.get();

        User user=null;
        if(document.exists()) {
            user = document.toObject(User.class);
            return  user;
        }else{
            return null;
        }


    }

    public String addDocument(String userid, String docid) throws ExecutionException, InterruptedException {
        Firestore dbFirestore= FirestoreClient.getFirestore();

        DocumentReference documentReference = dbFirestore.collection(COLLECTION_NAME).document(userid);

        ApiFuture<DocumentSnapshot> future = documentReference.get();
        DocumentSnapshot documentSnapshot = future.get();
        Map<String, Object> map = documentSnapshot.getData();
        if (!map.containsKey("documents")) { // create new field if documents does not exist yet
            System.out.println("creating Document field");
            Map<String, Object> data = new HashMap<>();

            data.put("documents", Arrays.asList(docid));
            ApiFuture<WriteResult> addedDocRef = documentReference.set(data, SetOptions.merge());
        } else {
            System.out.println("reached Array Union");
            ApiFuture<WriteResult> arrayUnion =
                    documentReference.update("documents", FieldValue.arrayUnion(docid));
        }

        return docid;


    }
    public List<User> getUserDetails() throws ExecutionException, InterruptedException {
        Firestore dbFirestore= FirestoreClient.getFirestore();

        Iterable<DocumentReference> documentReference=dbFirestore.collection(COLLECTION_NAME).listDocuments();
        List<User> userList=new ArrayList<>();
        User user=null;

        for (DocumentReference documentReference1 : documentReference) {
            ApiFuture<DocumentSnapshot> future= documentReference1.get();
            DocumentSnapshot document=future.get();

            user=document.toObject(User.class);
            userList.add(user);

        }
        return userList;
    }


    public String updateUser(User user) throws ExecutionException, InterruptedException {

        Firestore dbFirestore= FirestoreClient.getFirestore();

        ApiFuture<WriteResult> collectionApiFuture=dbFirestore.collection(COLLECTION_NAME).document(user.getId()).set(user);

        return collectionApiFuture.get().getUpdateTime().toString();

    }

    public String deleteUser(String name) throws ExecutionException, InterruptedException {

        Firestore dbFirestore= FirestoreClient.getFirestore();

        ApiFuture<WriteResult> collectionApiFuture=dbFirestore.collection(COLLECTION_NAME).document(name).delete();

        return "Document with User ID"+name+" has been deleted successfully";

    }

    public String deleteDocument(String userid, String docid) throws ExecutionException, InterruptedException{
        Firestore dbFirestore= FirestoreClient.getFirestore();

        DocumentReference documentReference=dbFirestore.collection(COLLECTION_NAME).document(userid);
        ApiFuture<WriteResult> arrayUnion =
                documentReference.update("documents", FieldValue.arrayRemove(docid));

        return "Document with doc ID"+docid+" has been deleted successfully";

    }
}