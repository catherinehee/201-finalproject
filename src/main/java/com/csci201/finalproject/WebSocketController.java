package com.csci201.finalproject;


import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class WebSocketController {
    @MessageMapping("/editCode")
    @SendTo("/topic/updates")
    public String processCodeEdit(String message) {
        // In a real application, you might process the message here
        return message;
    }
}
