package com.calendar.calendar_backend.repository;

import com.calendar.calendar_backend.entity.Appointment;
import com.calendar.calendar_backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, String> {
    List<Appointment> findAllByUser(User user);
}
