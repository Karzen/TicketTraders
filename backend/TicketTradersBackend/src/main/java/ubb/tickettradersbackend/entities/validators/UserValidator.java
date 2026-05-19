package ubb.tickettradersbackend.entities.validators;

import org.springframework.stereotype.Component;
import ubb.tickettradersbackend.entities.User;
import ubb.tickettradersbackend.entities.validators.exceptions.ValidationException;
import ubb.tickettradersbackend.repositories.UserRepository;

@Component
public class UserValidator implements Validator<User> {
    private final UserRepository userRepository;

    public UserValidator(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public void validateForAll(User obj) throws ValidationException {
        validateName(obj.getFullName());
        validateEmail(obj.getEmail());
        validatePassword(obj.getPassword());
    }

    @Override
    public void validateForModify(User obj) throws ValidationException {
        validateForAll(obj);
    }

    @Override
    public void validateForSave(User obj) throws ValidationException {
        validateForAll(obj);
        validateID(obj.getId());
    }

    private void validateID(Long id) throws ValidationException {
        if (id == null) {
            throw new ValidationException("User ID cannot be null!");
        }

        if (userRepository.existsById(id)) {
            throw new ValidationException("User with this id does not exist!");
        }
    }

    private void validateName(String name) throws ValidationException {
        if (name == null) {
            throw new ValidationException("User name cannot be null!");
        }

        if (name.matches("^[a-zA-Z-]+ [a-zA-Z-]+$")) {
            throw new ValidationException("User name can contain just letters and -!");
        }
    }

    private void validateEmail(String email) throws ValidationException {
        if (email == null) {
            throw new ValidationException("User email cannot be null!");
        }

        if (email.matches("^[a-zA-Z0-9-.]+@[a-zA-Z-.]+.[a-zA-Z]{2,3}$")) {
            throw new ValidationException("User email does not have a valid format!");
        }
    }

    private void validatePassword(String password) throws ValidationException {
        if (password == null) {
            throw new ValidationException("User password cannot be null!");
        }

        if (password.matches("^[a-zA-Z0-9-.?*&$!]{3,10}$")) {
            throw new ValidationException("User password does not have a valid format!");
        }
    }
}
