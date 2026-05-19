package ubb.tickettradersbackend.entities.converters;

import org.springframework.core.convert.converter.Converter;
import ubb.tickettradersbackend.entities.User;
import ubb.tickettradersbackend.entities.dtos.UserDTO;

public class UserDTOConverter implements Converter<UserDTO, User> {
    @Override
    public User convert(UserDTO source) {
        User user = new User();
        user.setOrganizer(source.isOrganizer());
        user.setEmail(source.email());
        user.setFullName(source.fullName());
        user.setPassword(source.password());
        return user;
    }
}
