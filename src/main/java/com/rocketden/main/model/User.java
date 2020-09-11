package com.rocketden.main.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class User {
    private String nickname;

    // Overriding equals() to compare two users
    @Override
    public boolean equals(Object o) { 
        // If the object is compared with itself then return true   
        if (o == this) { 
            return true; 
        } 
  
        /* Check if o is an instance of User or not 
          "null instanceof [type]" also returns false */
        if (!(o instanceof User)) { 
            return false; 
        } 
          
        // Typecast o to User so that we can compare data members  
        User user = (User) o; 
          
        // Compare the data members and return accordingly  
        return this.getNickname().equals(user.getNickname());
    } 

}
