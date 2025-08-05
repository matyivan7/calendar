package com.calendar.calendar_backend.service;

import com.calendar.calendar_backend.dto.requests.AppointmentRequest;
import com.calendar.calendar_backend.entity.Appointment;
import com.calendar.calendar_backend.entity.User;
import com.calendar.calendar_backend.repository.AppointmentRepository;
import com.calendar.calendar_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

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
            .clientName(request.clientName())
            .serviceType(request.serviceType())
            .startTime(LocalDateTime.parse(request.startTime()))
            .endTime(LocalDateTime.parse(request.endTime()))
            .phoneNumber(request.phoneNumber())
            .notes(request.notes())
            .build();
        return appointmentRepository.saveAndFlush(appointment);
    }


}
