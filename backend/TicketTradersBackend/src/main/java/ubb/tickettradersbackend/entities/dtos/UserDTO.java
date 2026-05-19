package ubb.tickettradersbackend.entities.dtos;

public record UserDTO(Long id, boolean isOrganizer, String fullName, String email, String password) {
}
