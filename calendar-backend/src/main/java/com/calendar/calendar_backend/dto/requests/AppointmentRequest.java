package com.calendar.calendar_backend.dto.requests;

import com.calendar.calendar_backend.enums.ServiceType;

public record AppointmentRequest(
   String clientName,
   ServiceType serviceType,
   String startTime,
   String endTime,
   String phoneNumber,
   String notes
) {}
