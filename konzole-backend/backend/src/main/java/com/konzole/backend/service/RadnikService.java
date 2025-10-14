package com.konzole.backend.service;

import com.konzole.backend.dto.RadnikDto;
import com.konzole.backend.entity.Radnik;

import java.util.List;

public interface RadnikService {
    RadnikDto createRadnik(RadnikDto radnikDto);
    RadnikDto getRadnikById(Long radnikId);
    List<RadnikDto> getAllRadnici();
    RadnikDto updateRadnik(Long radnikId, RadnikDto updatedRadnik);
    void deleteRadnik(Long radnikId);
    RadnikDto getRadnikLogin(String korisnickoIme, String lozinka);
}