package ubb.tickettradersbackend.controllers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ubb.tickettradersbackend.entities.dtos.UserDTO;
import ubb.tickettradersbackend.services.UserService;

@RestController
@RequestMapping("/users")
public class UserController {

    private static final Logger log = LoggerFactory.getLogger(UserController.class);
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<UserDTO> addUser(@RequestBody UserDTO userDTO) {
        log.info("Adding user {}", userDTO);
        return ResponseEntity.ok(userService.addUser(userDTO));
    }

    @PatchMapping("/{userID}")
    public ResponseEntity<?> updateUser(@PathVariable Long userID, @RequestBody UserDTO userDTO) {
        log.info("Updating user {}", userID);
        userService.updateUser(userID, userDTO);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{userID}")
    public ResponseEntity<?> deleteUser(@PathVariable Long userID) {
        log.info("Deleting user {}", userID);
        userService.removeUser(userID);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{userID}")
    public ResponseEntity<UserDTO> getUser(@PathVariable Long userID) {
        log.info("Getting user {}", userID);
        return ResponseEntity.ok(userService.findUser(userID));
    }
}
