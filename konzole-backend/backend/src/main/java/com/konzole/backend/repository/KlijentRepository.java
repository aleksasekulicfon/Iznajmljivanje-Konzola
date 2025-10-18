package com.konzole.backend.repository;

import com.konzole.backend.entity.Klijent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface KlijentRepository extends JpaRepository<Klijent, Long> {
    Optional<Klijent> findByKorisnickoImeAndLozinka(String korisnickoIme, String lozinka);
    Optional<Klijent> findByKorisnickoIme(String korisnickoIme);
}