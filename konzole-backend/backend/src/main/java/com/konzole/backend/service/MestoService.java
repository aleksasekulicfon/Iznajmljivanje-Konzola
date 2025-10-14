package com.konzole.backend.service;

import com.konzole.backend.dto.MestoDto;
import java.util.List;

public interface MestoService {
    MestoDto createMesto(MestoDto dto);
    MestoDto getMestoById(Long id);
    List<MestoDto> getAllMesta();
    MestoDto updateMesto(Long id, MestoDto dto);
    void deleteMesto(Long id);
}