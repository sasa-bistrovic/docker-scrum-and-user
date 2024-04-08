package com.example.by.sasa.bistrovic.springbootuser;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@RestController
@CrossOrigin(origins = "http://localhost:4201")
@RequestMapping("/api/users")
public class UsersController {

    @Autowired
    private UsersRepository usersRepository;

    @GetMapping
    public List<Users> getAllUsers() {
        return usersRepository.findAll();
    }

    @GetMapping("/{id}")
    public Users getUserById(@PathVariable Long id) {
        return usersRepository.findById(id).orElse(null);
    }

    @GetMapping("/username/{username}")
    public Users getUserByUsername(@PathVariable String username) {
        return usersRepository.findByUsername(username);
    }

    @GetMapping("/email/{email}")
    public Users getUserByEmail(@PathVariable String email) {
        return usersRepository.findByEmail(email);
    }

    @PostMapping
    public Users createUser(@RequestBody Users user) {
        List<Users> users = usersRepository.findAll();
    
    for (Users existingTask : users) {
        if (existingTask.getEmail().equals(user.getEmail()) && existingTask.getUsername().equals(user.getUsername()) || user.getEmail().equals("") || user.getUsername().equals("") || user.getPassword().equals("")) {
            // Return a 400 Bad Request status if the task text already exists or is empty
            user.setEmail("");
            user.setUsername("");
            user.setPassword("");
            return user;
        }
    }
    
        return usersRepository.save(user);
    }

    @PutMapping("/{id}")
    public Users updateUser(@PathVariable Long id, @RequestBody Users user) {
    List<Users> users = usersRepository.findAll();
    
    for (Users existingTask : users) {
        if (existingTask.getEmail().equals(user.getEmail()) && !existingTask.getUsername().equals(user.getUsername()) || !existingTask.getEmail().equals(user.getEmail()) && existingTask.getUsername().equals(user.getUsername()) || user.getEmail().equals("") || user.getUsername().equals("") || user.getPassword().equals("")) {
            // Return a 400 Bad Request status if the task text already exists or is empty
            for (Users existingTask2 : users) {
                if (existingTask2.getId()==user.getId()) {
                    return existingTask2;
                }
            }            
        }
    }
        
        
        Users existingUser = usersRepository.findById(id).orElse(null);
        if (existingUser != null) {
            if (!user.getUsername().equals(existingUser.getUsername()) || !user.getEmail().equals(existingUser.getEmail())) {
                return existingUser;
            }
            existingUser.setUsername(user.getUsername());
            existingUser.setEmail(user.getEmail());
            existingUser.setPassword(user.getPassword());
            return usersRepository.save(existingUser);
        } else {
            return null; // Handle not found scenario
        }
    }

@DeleteMapping("/{id}")
public ResponseEntity<String> deleteUser(@PathVariable Long id) {
    try {
        usersRepository.deleteById(id);
        return ResponseEntity.ok("User deleted successfully");
    } catch (Exception e) {
        // Log the exception details
        e.printStackTrace();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting user");
    }
}
}