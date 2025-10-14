package com.konzole.backend.service;

import com.konzole.backend.dto.KlijentDto;
import java.util.List;

public interface KlijentService {
    KlijentDto createKlijent(KlijentDto dto);
    KlijentDto getKlijentById(Long id);
    List<KlijentDto> getAllKlijenti();
    KlijentDto updateKlijent(Long id, KlijentDto dto);
    void deleteKlijent(Long id);
    KlijentDto getKlijentLogin(String korisnickoIme, String lozinka);
}