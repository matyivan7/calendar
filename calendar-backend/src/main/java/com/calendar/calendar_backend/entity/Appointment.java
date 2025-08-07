package com.calendar.calendar_backend.entity;

import com.calendar.calendar_backend.enums.ServiceType;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import java.time.OffsetDateTime;

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
    @NotBlank(message = "Please provide a name")
    private String clientName;

    @Enumerated(EnumType.STRING)
    @Column(name = "service_type")
    private ServiceType serviceType;

    @Column(name = "start_time")
    private OffsetDateTime startTime;

    @Column(name = "end_time")
    private OffsetDateTime endTime;

    @Column(name = "phone_number")
    @Pattern(regexp = "\\d{7,15}", message = "A telefonszám csak számokat tartalmazhat (min 7 számjegy).")
    private String phoneNumber;

    @Column(length = 500, name = "notes")
    private String notes;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}
