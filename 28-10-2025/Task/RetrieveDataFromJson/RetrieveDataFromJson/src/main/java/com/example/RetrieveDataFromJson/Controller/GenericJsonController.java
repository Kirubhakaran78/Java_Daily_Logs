package com.example.RetrieveDataFromJson.Controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.web.bind.annotation.*;

import java.util.Iterator;
import java.util.Map;
import java.util.UUID;

@RestController
public class GenericJsonController {

    @PostMapping(value = "/displayJson", produces = "text/html")
    public String displayJson(@RequestBody String jsonString) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(jsonString);

            // Add GUID to the root JSON (or nested if you want)
            if (root.isObject()) {
                ((ObjectNode) root).put("guid", UUID.randomUUID().toString());
            }

            // Convert the JSON into HTML table
            String htmlTable = convertJsonToHtmlTable(root);

            // Return a simple HTML page
            return "<html><body style='font-family: Arial;'>" +
                    "<h2>Received JSON Data</h2>" +
                    htmlTable +
                    "</body></html>";

        } catch (Exception e) {
            e.printStackTrace();
            return "<html><body><h3>Error parsing JSON: " + e.getMessage() + "</h3></body></html>";
        }
    }

    // Recursive function to convert JSON to HTML table
    private String convertJsonToHtmlTable(JsonNode node) {
        StringBuilder sb = new StringBuilder();
        sb.append("<table border='1' cellspacing='0' cellpadding='5' style='border-collapse:collapse;'>");

        if (node.isObject()) {
            Iterator<Map.Entry<String, JsonNode>> fields = node.fields();//node.fields -> gives iterator
            while (fields.hasNext()) {
                Map.Entry<String, JsonNode> field = fields.next();
                sb.append("<tr>");
                sb.append("<td><b>").append(field.getKey()).append("</b></td>");
                sb.append("<td>").append(convertJsonToHtmlTable(field.getValue())).append("</td>");
                sb.append("</tr>");
            }
        } else if (node.isArray()) {
            for (JsonNode arrayElement : node) {
                sb.append("<tr><td colspan='2'>").append(convertJsonToHtmlTable(arrayElement)).append("</td></tr>");
            }
        } else {
            sb.append("<tr><td colspan='2'>").append(node.asText()).append("</td></tr>");
        }

        sb.append("</table>");
        return sb.toString();
    }
}

