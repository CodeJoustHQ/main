package com.rocketden.main.model;

import com.rocketden.main.game_object.GameTimer;
import com.rocketden.main.model.problem.Problem;
import com.rocketden.main.model.problem.ProblemDifficulty;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToMany;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    private String roomId;

    private Instant createdDateTime = Instant.now();

    // host_id column in room table holds the primary key of the user host
    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "host_id")
    private User host;

    /**
     * Generated from all the matching room variables in the User class.
     * If the room is deleted or users removed from this list, those users will also be deleted.
     * Setter is set to private to ensure proper use of addUser and removeUser methods.
     */
    @OneToMany(mappedBy = "room", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @Setter(AccessLevel.PRIVATE)
    private List<User> users = new ArrayList<>();

    private Boolean active = false;

    @Enumerated(EnumType.STRING)
    private ProblemDifficulty difficulty = ProblemDifficulty.RANDOM;

    private Long duration = GameTimer.DURATION_15;

    private Integer numProblems = 1;

    private Integer maxSize = 4;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinColumn(name = "selectable_problem_id")
    private List<Problem> problems = new ArrayList<>();

    public void addUser(User user) {
        users.add(user);
        user.setRoom(this);
    }

    // Removes user if the nicknames match (based on equals/hashCode implementation)
    // Note: if we switch to permanent users and disable orphanRemoval, this will
    // need to call getEquivalentUser(user).setRoom(null) first
    public boolean removeUser(User user) {
        return users.remove(user);
    }

    /**
     * Given a user object, return the equivalent user object in this room's list
     * of users, or null if it doesn't exist. The reason this is necessary is
     * because, while a user object constructed from a client's UserDto might
     * "equal" a user in the room at the application level, they are not the same at
     * the database level (different primary keys). This method therefore returns the
     * correct user object that's equal at both the application and database levels.
     *
     * @param userToFind the desired user to find
     * @return the equivalent user in the database, or null if none exists
     */
    public User getEquivalentUser(User userToFind) {
        int index = users.indexOf(userToFind);
        if (index >= 0) {
            return users.get(index);
        }
        return null;
    }

    /**
     * Find and return a User object in the room based on userId.
     * @param userId
     * @return User if found,
     * null if no User with matching userId found.
     */
    public User getUserByUserId(String userId) {
        for (User roomUser: this.users) {
            if (roomUser.getUserId().equals(userId)) {
                return roomUser;
            }
        }
        return null;
    }

    /**
     * Determine whether a user with the given nickname already exists
     * in the room. Capitalization matters.
     * 
     * @param nickname The provided nickname we are searching for.
     * @return true if a user with the provided nickname exists in the room,
     * false if no user with that nickname is found.
     */
    public boolean containsUserWithNickname(String nickname) {
        for (User roomUser : this.users) {
            if (roomUser.getNickname().equals(nickname)) {
                return true;
            }
        }
        return false;
    }


    /**
     * Determine whether the room has already reached the maximum capacity.
     * @return true if the number of users in the room is equal to or greater
     * than the maximum size of the room
     */
    public boolean isFull() {
        return users.size() >= maxSize;
    }
}
