package com.example.RetrieveDataFromJson.Controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
public class JsonController {

	@PostMapping(value="/displayJsonHasTable", produces="text/html")
	public String displayJson(@RequestBody String jsonString) {//@RequestBody -> convert json to java object
		
		try {
			ObjectMapper mapper = new ObjectMapper(); //jackson obj to work on json
			
			//parses the json string to an jsonNode tree
			JsonNode root=mapper.readTree(jsonString); //JsonNode -> single node in Json tree,readonly
			
			
			if(root.isObject()) { //type casting to ObjectNode to modify the JsonNode
				((ObjectNode) root).put("uuid",UUID.randomUUID().toString());
			}
			
			//convert json to an html table
			//helper function -> convertHtmlPage()
			String htmlTable=convertHtmlPage(root);
			
			return "<html> <body>"
					+ "<h2>Result of json </h2>"
					+htmlTable+
					"</body></html>";
			
		}catch(Exception e) {
			e.printStackTrace();
			return "<html><body>"
					+ "<h2>"
					+ "Error:"
				 +e.getMessage()+"</h2></body></html>";
		}
		
	}
	
	public String convertHtmlPage(JsonNode node) {
		StringBuilder sb=new StringBuilder();
		sb.append("<table border='1' cellspacing='0' cellpadding='5' style='border-collapse:collapse' >");
		
		if(node.isObject()) {
			Iterator<Map.Entry<String,JsonNode>> fields=node.fields();//node.fields -> gives iterator
			//Iterator<Map.Entry<String,JsonNode>> fields=(Iterator<Entry<String, JsonNode>>) ((ObjectNode) node).properties();
			while(fields.hasNext()) {
				Map.Entry<String,JsonNode> field=fields.next();
				sb.append("<tr>");
				sb.append("<td><b>").append(field.getKey()).append("<b></td>");
				sb.append("<td>").append(convertHtmlPage(field.getValue())).append("</td>");
				sb.append("</tr>");
			}
			
		}else if(node.isArray()) {
			for(JsonNode Arrayelements:node) {
				sb.append("<tr><td colspan='2'>").append(convertHtmlPage(Arrayelements)).append("</tr></td>");
			}
						
		}else {
			sb.append("<tr><td colspan='2'>").append(node.asText()).append("</tr></td>");
		}
		
		
		sb.append("</table>");
		
		
		
		return sb.toString();
	}
	
}
