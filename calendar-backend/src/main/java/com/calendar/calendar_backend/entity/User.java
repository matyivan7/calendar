package com.calendar.calendar_backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import java.util.UUID;

@Data
@Entity
@Table(name = "users")
@RequiredArgsConstructor
public class User {

    @Id
    private String id = UUID.randomUUID().toString();

    private String username;

    private String password;

    private String role;
}
