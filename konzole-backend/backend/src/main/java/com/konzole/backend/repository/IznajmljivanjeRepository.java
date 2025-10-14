package com.konzole.backend.repository;

import com.konzole.backend.entity.Iznajmljivanje;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IznajmljivanjeRepository extends JpaRepository<Iznajmljivanje, Long> {
}