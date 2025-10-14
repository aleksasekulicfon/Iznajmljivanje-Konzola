package com.konzole.backend.service;

import com.konzole.backend.dto.DodatnaOpremaDto;
import java.util.List;

public interface DodatnaOpremaService {
    DodatnaOpremaDto createDodatnaOprema(DodatnaOpremaDto dto);
    DodatnaOpremaDto getDodatnaOpremaById(Long id);
    List<DodatnaOpremaDto> getAllDodatnaOprema();
    DodatnaOpremaDto updateDodatnaOprema(Long id, DodatnaOpremaDto dto);
    void deleteDodatnaOprema(Long id);
}