package com.calendar.calendar_backend.controller;

import com.calendar.calendar_backend.dto.requests.AppointmentRequest;
import com.calendar.calendar_backend.entity.Appointment;
import com.calendar.calendar_backend.service.AppointmentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentService appointmentService;

    @PreAuthorize("hasRole('USER')")
    @GetMapping("/all")
    public ResponseEntity<List<Appointment>> getAllAppointments() {
        log.info("Get all appointments endpoint");
        return ResponseEntity.ok(appointmentService.getAllAppointments());
    }

    @PreAuthorize("hasRole('USER')")
    @GetMapping("/user")
    public ResponseEntity<List<Appointment>> getUserAppointments(@AuthenticationPrincipal UserDetails user) {
        log.info("Get appointments for user: {}", user.getUsername());
        return ResponseEntity.ok(appointmentService.getAllAppointmentsByUser(user));
    }

    @PreAuthorize("hasRole('USER')")
    @PostMapping("/new")
    public ResponseEntity<Appointment> createAppointment(@RequestBody AppointmentRequest request) {
        log.info("Create appointment request: {}", request);
        return ResponseEntity.ok(appointmentService.createAppointment(request));
    }

    @PreAuthorize("hasRole('USER')")
    @PostMapping("/update")
    public ResponseEntity<Appointment> updateAppointment(@RequestBody AppointmentRequest request) {
        log.info("Update appointment with id: {}", request.id());
        Appointment updated = appointmentService.updateAppointment(request);
        return ResponseEntity.ok(updated);
    }
}
