package com.calendar.calendar_backend.service;

import com.calendar.calendar_backend.dto.requests.AppointmentRequest;
import com.calendar.calendar_backend.entity.Appointment;
import com.calendar.calendar_backend.entity.User;
import com.calendar.calendar_backend.repository.AppointmentRepository;
import com.calendar.calendar_backend.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;

    public List<Appointment> getAllAppointments() {
        log.info("Get all appointments from database");
        return appointmentRepository.findAll();
    }

    public List<Appointment> getAllAppointmentsByUser(UserDetails userDetails) {
        log.info("Get all appointments for user from database");
        User user = userRepository.findByUsername(userDetails.getUsername())
            .orElseThrow(() -> new UsernameNotFoundException("User with the given username can not be not found"));
        return appointmentRepository.findAllByUser(user);
    }

    public Appointment createAppointment(AppointmentRequest request) {
        log.info("Create appointment and save to database");
        Appointment appointment = Appointment.builder()
            .id(UUID.randomUUID().toString())
            .clientName(request.clientName())
            .serviceType(request.serviceType())
            .startTime(OffsetDateTime.parse(request.startTime()).toLocalDateTime())
            .endTime(OffsetDateTime.parse(request.endTime()).toLocalDateTime())
            .phoneNumber(request.phoneNumber())
            .notes(request.notes())
            .build();
        return appointmentRepository.saveAndFlush(appointment);
    }


    public Appointment updateAppointment(AppointmentRequest request) {
        log.info("Update appointment and save to database");
        Appointment appointment = appointmentRepository.findAppointmentById(request.id())
            .orElseThrow(() -> new EntityNotFoundException("Appointment with id " + request.id() + " not found"));

        appointment.setClientName(request.clientName());
        appointment.setServiceType(request.serviceType());
        appointment.setStartTime(LocalDateTime.parse(request.startTime()));
        appointment.setEndTime(LocalDateTime.parse(request.endTime()));
        appointment.setPhoneNumber(request.phoneNumber());
        appointment.setNotes(request.notes());
        return appointmentRepository.saveAndFlush(appointment);
    }
}
