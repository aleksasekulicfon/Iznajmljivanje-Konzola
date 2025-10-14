package com.konzole.backend.service;

import com.konzole.backend.dto.StavkaIznajmljivanjaDto;

import java.util.List;

public interface StavkaIznajmljivanjaService {
    StavkaIznajmljivanjaDto create(Long iznajmljivanjeId, StavkaIznajmljivanjaDto dto);
    StavkaIznajmljivanjaDto update(Long iznajmljivanjeId, Long stavkaId, StavkaIznajmljivanjaDto dto);
    void delete(Long iznajmljivanjeId, Long stavkaId);
    List<StavkaIznajmljivanjaDto> list(Long iznajmljivanjeId);
}