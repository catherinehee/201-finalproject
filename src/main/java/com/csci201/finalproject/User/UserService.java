package com.csci201.finalproject.User;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;

import org.springframework.stereotype.Service;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.WriteResult;
import com.google.firebase.cloud.FirestoreClient;

@Service
public class UserService {
    private static final String COLLECTION_NAME ="users" ;

    public String saveUser(User user) throws ExecutionException, InterruptedException {

        Firestore dbFirestore= FirestoreClient.getFirestore();

        ApiFuture<WriteResult> collectionApiFuture=dbFirestore.collection(COLLECTION_NAME).document(user.getUsername()).set(user);

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

        ApiFuture<WriteResult> collectionApiFuture=dbFirestore.collection(COLLECTION_NAME).document(user.getUsername()).set(user);

        return collectionApiFuture.get().getUpdateTime().toString();

    }

    public String deleteUser(String name) throws ExecutionException, InterruptedException {

        Firestore dbFirestore= FirestoreClient.getFirestore();

        ApiFuture<WriteResult> collectionApiFuture=dbFirestore.collection(COLLECTION_NAME).document(name).delete();

        return "Document with User ID"+name+" has been deleted successfully";

    }

    // TODO: createDocument (User or FileSystem)
    // TODO: User Authentication
}