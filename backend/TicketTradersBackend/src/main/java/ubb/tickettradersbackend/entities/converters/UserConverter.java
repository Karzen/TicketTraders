package ubb.tickettradersbackend.entities.converters;

import org.jspecify.annotations.NonNull;
import org.springframework.core.convert.converter.Converter;
import ubb.tickettradersbackend.entities.User;
import ubb.tickettradersbackend.entities.dtos.UserDTO;

public class UserConverter implements Converter<User, UserDTO> {
    @Override
    public UserDTO convert(@NonNull User source) {
        return new UserDTO(source.getId(), source.isOrganizer(), source.getFullName(), source.getEmail(), null);
    }
}
