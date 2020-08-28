package com.rocketden.main.util;

import com.google.gson.Gson;

public class Utility {

  public static String convertObjectToJsonString(Object o) {
    Gson gson = new Gson();
    return gson.toJson(o);
  }
  
}