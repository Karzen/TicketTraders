package ubb.tickettradersbackend.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "tt_user")
public class User extends Base {
    private boolean isOrganizer;
    private String fullName;
    private String email;
    private String password;
    //    private ? image
    @ManyToMany
    private List<Event> favoriteEvents;
    @ManyToMany
    private List<User> friends;
    @OneToMany
    private List<Ticket> tickets;
}
