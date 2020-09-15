package com.rocketden.main.model;

<<<<<<< HEAD
=======
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

>>>>>>> master
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

<<<<<<< HEAD
@EqualsAndHashCode
=======
@Entity
>>>>>>> master
@Getter
@Setter
@EqualsAndHashCode
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @EqualsAndHashCode.Exclude
    private Integer id;
    
    private String nickname;
}
