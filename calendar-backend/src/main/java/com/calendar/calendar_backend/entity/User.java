package com.calendar.calendar_backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import java.util.UUID;

@Data
@Entity
@Table(name = "users")
@RequiredArgsConstructor
public class User {

    @Id
    @Column(name = "user_id")
    private String id = UUID.randomUUID().toString();

    @Column(name = "username")
    @NotBlank(message = "Please provide a username")
    private String username;

    @Column(name = "password")
    @Size(min = 4, message = "Password must be at least 4 characters long")
    private String password;

    @Column(name = "role")
    private String role;
}
