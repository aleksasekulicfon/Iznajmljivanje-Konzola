package com.konzole.backend.service;

import com.konzole.backend.dto.IznajmljivanjeDto;

import java.util.List;

public interface IznajmljivanjeService {
    IznajmljivanjeDto create(IznajmljivanjeDto dto);
    IznajmljivanjeDto getById(Long id);
    List<IznajmljivanjeDto> getAll();
    IznajmljivanjeDto update(Long id, IznajmljivanjeDto dto);
    void delete(Long id);

    IznajmljivanjeDto zavrsi(Long id);

    IznajmljivanjeDto upsertStavke(Long iznajmljivanjeId, List<com.konzole.backend.dto.StavkaIznajmljivanjaDto> stavke);
}
