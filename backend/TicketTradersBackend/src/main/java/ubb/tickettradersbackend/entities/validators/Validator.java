package ubb.tickettradersbackend.entities.validators;

import org.springframework.stereotype.Component;
import ubb.tickettradersbackend.entities.Base;
import ubb.tickettradersbackend.entities.validators.exceptions.ValidationException;

@Component
public interface Validator <T extends Base> {
    void validateForModify(T obj) throws ValidationException;

    void validateForSave(T obj) throws ValidationException;

    void validateForAll(T obj) throws ValidationException;
}
