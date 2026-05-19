package ubb.tickettradersbackend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import ubb.tickettradersbackend.entities.User;

public interface UserRepository extends JpaRepository<User, Long> {

}
