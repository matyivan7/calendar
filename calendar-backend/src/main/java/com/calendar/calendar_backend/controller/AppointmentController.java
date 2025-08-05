package com.calendar.calendar_backend.controller;

import com.calendar.calendar_backend.dto.requests.AppointmentRequest;
import com.calendar.calendar_backend.entity.Appointment;
import com.calendar.calendar_backend.service.AppointmentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
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

    @GetMapping("/all")
    public ResponseEntity<List<Appointment>> getAllAppointments() {
        log.info("Get all appointments endpoint");
        return ResponseEntity.ok(appointmentService.getAllAppointments());
    }

    @GetMapping("/user")
    public ResponseEntity<List<Appointment>> getUserAppointments(@AuthenticationPrincipal UserDetails user) {
        log.info("Get user appointments endpoint");
        return ResponseEntity.ok(appointmentService.getAllAppointmentsByUser(user));
    }

    @PostMapping("/new")
    public ResponseEntity<Appointment> createAppointment(@RequestBody AppointmentRequest request) {
        log.info("Create appointment endpoint");
        return ResponseEntity.ok(appointmentService.createAppointment(request));
    }
}
