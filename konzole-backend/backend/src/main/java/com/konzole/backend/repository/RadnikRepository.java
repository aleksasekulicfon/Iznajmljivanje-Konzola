package com.konzole.backend.repository;

import com.konzole.backend.entity.Radnik;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RadnikRepository extends JpaRepository<Radnik, Long> {
    Optional<Radnik> findByKorisnickoImeAndLozinka(String korisnickoIme, String lozinka);
}