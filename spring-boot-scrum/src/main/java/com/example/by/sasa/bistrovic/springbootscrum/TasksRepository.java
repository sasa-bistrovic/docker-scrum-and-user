package com.example.by.sasa.bistrovic.springbootscrum;

// TaskRepository.java
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TasksRepository extends JpaRepository<Tasks, Long> {
    List<Tasks> findByColumnId(String columnId);
    
}

