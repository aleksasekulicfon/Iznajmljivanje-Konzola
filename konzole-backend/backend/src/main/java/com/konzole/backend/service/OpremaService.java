package com.konzole.backend.service;

import com.konzole.backend.dto.OpremaDto;
import java.util.List;

public interface OpremaService {
    OpremaDto createOprema(OpremaDto dto);
    OpremaDto getOpremaById(Long id);
    List<OpremaDto> getAllOpreme();
    OpremaDto updateOprema(Long id, OpremaDto dto);
    void deleteOprema(Long id);
}