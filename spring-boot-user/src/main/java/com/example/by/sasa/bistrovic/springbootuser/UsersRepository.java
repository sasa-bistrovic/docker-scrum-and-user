package com.example.by.sasa.bistrovic.springbootuser;

import org.springframework.data.jpa.repository.JpaRepository;

public interface UsersRepository extends JpaRepository<Users, Long> {
    Users findByUsername(String username);
    Users findByEmail(String email);
    Users findByPassword(String password);
}