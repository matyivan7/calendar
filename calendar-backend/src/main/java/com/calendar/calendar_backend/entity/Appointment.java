package com.calendar.calendar_backend.entity;

import com.calendar.calendar_backend.enums.ServiceType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import java.time.LocalDateTime;

@Data
@Entity
@Builder
@RequiredArgsConstructor
@Table(name = "appointments")
@AllArgsConstructor
public class Appointment {

    @Id
    private String id;

    @Column(name = "client_name")
    private String clientName;

    @Enumerated(EnumType.STRING)
    @Column(name = "service_type")
    private ServiceType serviceType;

    @Column(name = "start_time")
    private LocalDateTime startTime;

    @Column(name = "end_time")
    private LocalDateTime endTime;

    @Column(name = "phone_number")
    private String phoneNumber;

    @Column(length = 500, name = "notes")
    private String notes;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}
