package com.csci201.finalproject.Document;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Document {
    private String author;
    private ArrayList<String> collaborators;
    private String content;
    private String docName;
}
