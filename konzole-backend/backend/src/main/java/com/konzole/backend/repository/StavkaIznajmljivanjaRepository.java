package com.konzole.backend.repository;

import com.konzole.backend.entity.StavkaIznajmljivanja;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StavkaIznajmljivanjaRepository extends JpaRepository<StavkaIznajmljivanja, Long> {
    List<StavkaIznajmljivanja> findByIznajmljivanjeId(Long iznajmljivanjeId);
}