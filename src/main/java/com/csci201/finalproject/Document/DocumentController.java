package com.csci201.finalproject.Document;

import com.csci201.finalproject.User.User;
import com.csci201.finalproject.User.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.DependsOn;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.concurrent.ExecutionException;

@RestController
@CrossOrigin(origins = "*", allowedHeaders = "*")
@DependsOn("Firebase")
@RequestMapping("/api")
public class DocumentController {

    @Autowired
    private DocumentService documentService;
    @Autowired
    private UserService userService;

    @PostMapping("/documents")
    public String saveDocument(@RequestBody Document document) throws ExecutionException, InterruptedException {
        return documentService.saveDocument(document);
    }

    @PatchMapping("/documents/{userid}/{documentName}/add")
    public ResponseEntity<Object> addDocumentToUser(@PathVariable String userid, @PathVariable String documentName) throws ExecutionException, InterruptedException {
        Set<String> names = userService.getDocumentNamesByUser(userid);
        if (names != null && !names.isEmpty() && names.contains(documentName)) {
            return ResponseEntity.ok().body("DUPLICATE");
        }
        return documentService.addDocument(userid, documentName);
    }

    @GetMapping("/documents/{documentName}")
    public Document getDocument(@PathVariable String documentName) throws ExecutionException, InterruptedException {

        return documentService.getDocumentDetailsByName(documentName);
    }

    @CrossOrigin(origins = "*", allowedHeaders = "*")
    @GetMapping("/documents/id/{docid}")
    public String getDocumentName(@PathVariable String docid) throws ExecutionException, InterruptedException {

        return documentService.getDocumentNameById(docid);
    }

    @GetMapping("/documents")
    public List<Document> getAllDocuments() throws ExecutionException, InterruptedException {

        return documentService.getDocumentDetails();
    }


    @PutMapping("/documents")
    public String update(@RequestBody Document document) throws ExecutionException, InterruptedException {

        return documentService.updateDocument(document);
    }


    @DeleteMapping("/documents/{name}")
    public String deleteUser(@PathVariable String name) throws ExecutionException, InterruptedException {

        return documentService.deleteDocument(name);
    }
}
