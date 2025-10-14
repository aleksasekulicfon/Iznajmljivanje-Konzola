package com.konzole.backend.repository;

import com.konzole.backend.entity.Konzola;
import org.springframework.data.jpa.repository.JpaRepository;

public interface KonzolaRepository extends JpaRepository<Konzola, Long> {
}