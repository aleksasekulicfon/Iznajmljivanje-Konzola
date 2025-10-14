package com.konzole.backend.service;

import com.konzole.backend.dto.KonzolaDto;
import java.util.List;

public interface KonzolaService {
    KonzolaDto createKonzola(KonzolaDto dto);
    KonzolaDto getKonzolaById(Long id);
    List<KonzolaDto> getAllKonzole();
    KonzolaDto updateKonzola(Long id, KonzolaDto dto);
    void deleteKonzola(Long id);
}