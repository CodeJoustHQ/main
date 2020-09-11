package com.rocketden.main.model;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    private String userId;
    
    private String nickname;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id")
    private Room room;

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

    @Override
    public int hashCode() {
        return nickname.hashCode();
    } 

}
