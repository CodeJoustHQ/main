package com.rocketden.main.util;

import java.util.HashMap;
import java.util.Map;

public class Utility {

  /**
   * Convert the Request Body in 'x-www-form-urlencoded' format to a HashMap 
   * matching the keys to values.
   * 
   * @param bodyStr The passed-in String representing the Request Body.
   * @return HashMap<String, String> that matches the body keys to values.
   */
  public static Map<String, String> bodyToMap(String bodyStr) {
    Map<String, String> body = new HashMap<>();

    // Iterate through and parse out key-value pairs.
    String[] values = bodyStr.split("&");
    for (String value : values) {
      String[] pair = value.split("=");
      if (pair.length == 2) {
        /**
         * Add the key-value pairs to the HashMap, replacing the '+' and '%0A'
         * with ' ' (space) and '\n' (newline).
         */
        body.put(pair[0], pair[1].replace("+", " ").replace("%0A", "\n"));
      }
    }
    return body;
  }
  
}
