package com.example.by.sasa.bistrovic.springbootscrum;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import jakarta.persistence.EntityNotFoundException;

@Service
public class TasksService {
    @Autowired
    private TasksRepository tasksRepository;
    
    public List<Tasks> getAllTasks() {
        // Assuming tasksRepository is a repository or a data access object that handles task data
        return tasksRepository.findAll();
    }

    public List<Tasks> getTasksByColumnId(String columnId) {
        return tasksRepository.findByColumnId(columnId);
    }

    public Tasks saveTasks(Tasks task) {
        return tasksRepository.save(task);
    }

    public void deleteTasks(Long taskId) {
        tasksRepository.deleteById(taskId);
    }
    
    public Tasks updateTask(Long id, Tasks updatedTask) {
        Optional<Tasks> optionalTask = tasksRepository.findById(id);

        if (optionalTask.isPresent()) {
            Tasks task = optionalTask.get();

            // Update task properties as needed
            task.setText(updatedTask.getText());
            task.setColumnId(updatedTask.getColumnId());

            return tasksRepository.save(task);
        } else {
            throw new EntityNotFoundException("Task not found with id: " + id);
        }
    }

}
