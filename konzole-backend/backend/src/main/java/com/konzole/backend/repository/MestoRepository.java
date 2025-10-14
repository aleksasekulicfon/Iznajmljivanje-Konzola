package com.konzole.backend.repository;

import com.konzole.backend.entity.Mesto;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MestoRepository extends JpaRepository<Mesto, Long> {
}