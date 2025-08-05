package com.calendar.calendar_backend.dto.responses;

import com.calendar.calendar_backend.enums.ServiceType;

public record AppointmentResponse(
    String clientName,
    ServiceType serviceType,
    String startTime,
    String endTime,
    String notes,
    String createdBy
) {}
