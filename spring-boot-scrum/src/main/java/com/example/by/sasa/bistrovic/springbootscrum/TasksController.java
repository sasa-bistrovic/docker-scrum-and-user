package com.example.by.sasa.bistrovic.springbootscrum;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/api/tasks")
public class TasksController {
    @Autowired
    private TasksService taskService;
    
    @GetMapping("/all")
    public List<Tasks> getAllTasks() {
        return taskService.getAllTasks();
    }

    @GetMapping("/{columnId}")
    public List<Tasks> getTasksByColumnId(@PathVariable String columnId) {
        return taskService.getTasksByColumnId(columnId);
    }

    @PostMapping("")
    public ResponseEntity<Tasks> createTask(@RequestBody Tasks task) {

    List<Tasks> tasks = taskService.getAllTasks();
    
    for (Tasks existingTask : tasks) {
        if (existingTask.getText().equals(task.getText()) || task.getText().equals("")) {
            // Return a 400 Bad Request status if the task text already exists or is empty
            task.setText("");
            return ResponseEntity.status(HttpStatus.CREATED).body(task);
        }
    }

    Tasks savedTask = taskService.saveTasks(task);
    // Return a 201 Created status along with the saved task
    return ResponseEntity.status(HttpStatus.CREATED).body(savedTask);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Tasks> updateTask(@PathVariable Long id, @RequestBody Tasks updatedTask) {
        Tasks updatedTaskResult = taskService.updateTask(id, updatedTask);
        return new ResponseEntity<>(updatedTaskResult, HttpStatus.OK);
    }

    @DeleteMapping("/{taskId}")
    public void deleteTasks(@PathVariable Long taskId) {
        taskService.deleteTasks(taskId);
    }
}