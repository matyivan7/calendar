package com.calendar.calendar_backend.service;

import com.calendar.calendar_backend.dto.requests.AppointmentRequest;
import com.calendar.calendar_backend.entity.Appointment;
import com.calendar.calendar_backend.entity.User;
import com.calendar.calendar_backend.repository.AppointmentRepository;
import com.calendar.calendar_backend.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
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

    public List<Appointment> getAllAppointmentsByUser() {
        log.info("Get all appointments for user from database");
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new UsernameNotFoundException("User with the given username can not be not found"));
        return appointmentRepository.findAllByUser(user);
    }

    public Appointment createAppointment(AppointmentRequest request) {
        log.info("Create appointment and save to database");

        OffsetDateTime start = OffsetDateTime.parse(request.startTime());
        OffsetDateTime end = OffsetDateTime.parse(request.endTime());

        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new UsernameNotFoundException("User with the given username can not be not found"));

        if (!end.isAfter(start)) {
            throw new IllegalArgumentException("A befejezés nem lehet korábbi vagy egyenlő a kezdésnél.");
        }

        Appointment appointment = Appointment.builder()
            .id(UUID.randomUUID().toString())
            .clientName(request.clientName())
            .serviceType(request.serviceType())
            .startTime(start)
            .endTime(end)
            .phoneNumber(request.phoneNumber())
            .notes(request.notes())
            .user(user)
            .build();
        return appointmentRepository.saveAndFlush(appointment);
    }


    public Appointment updateAppointment(AppointmentRequest request) {
        log.info("Update appointment and save to database");
        Appointment appointment = appointmentRepository.findAppointmentById(request.id())
            .orElseThrow(() -> new EntityNotFoundException("Appointment with id " + request.id() + " not found"));

        appointment.setClientName(request.clientName());
        appointment.setServiceType(request.serviceType());
        appointment.setStartTime(OffsetDateTime.parse(request.startTime()));
        appointment.setEndTime(OffsetDateTime.parse(request.endTime()));
        appointment.setPhoneNumber(request.phoneNumber());
        appointment.setNotes(request.notes());
        return appointmentRepository.saveAndFlush(appointment);
    }
}
