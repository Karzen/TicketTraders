package ubb.tickettradersbackend.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.convert.ConversionService;
import org.springframework.stereotype.Service;
import ubb.tickettradersbackend.entities.User;
import ubb.tickettradersbackend.entities.dtos.UserDTO;
import ubb.tickettradersbackend.entities.validators.UserValidator;
import ubb.tickettradersbackend.repositories.UserRepository;

@Service
public class UserService {

    private static final Logger log = LoggerFactory.getLogger(UserService.class);
    private final UserRepository userRepository;
    private final ConversionService conversionService;
    private final UserValidator userValidator;


    public UserService(UserRepository userRepository, ConversionService conversionService, UserValidator userValidator) {
        this.userRepository = userRepository;
        this.conversionService = conversionService;
        this.userValidator = userValidator;
    }


    public UserDTO addUser(UserDTO userDTO) {
        log.info("Adding userDTO {}", userDTO);

        User user = conversionService.convert(userDTO, User.class);

        if (user == null) {
            return null;
        }

        userValidator.validateForSave(user);
        return conversionService.convert(userRepository.save(user),  UserDTO.class);
    }

    public void updateUser(Long userID, UserDTO userDTO) {
        log.info("Updating user {}", userID);

        User user = conversionService.convert(userDTO, User.class);

        if (user == null) {
            return;
        }

        userValidator.validateForModify(user);
        userRepository.save(user);
    }

    public void removeUser(Long userID) {
        log.info("Removing user {}", userID);
        userRepository.deleteById(userID);
    }

    public UserDTO findUser(Long userID) {
        log.info("Finding user {}", userID);
        User user = userRepository.findById(userID).orElseThrow();
        return conversionService.convert(user,  UserDTO.class);
    }

}
