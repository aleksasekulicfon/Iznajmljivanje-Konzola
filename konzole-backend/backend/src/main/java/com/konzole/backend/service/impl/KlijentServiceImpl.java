package com.konzole.backend.service.impl;

import com.konzole.backend.dto.KlijentDto;
import com.konzole.backend.entity.Klijent;
import com.konzole.backend.exception.ResourceNotFoundException;
import com.konzole.backend.mapper.KlijentMapper;
import com.konzole.backend.repository.KlijentRepository;
import com.konzole.backend.service.KlijentService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class KlijentServiceImpl implements KlijentService {

    private final KlijentRepository klijentRepository;

    @Override
    public KlijentDto createKlijent(KlijentDto dto) {
        Klijent klijent = KlijentMapper.mapToEntity(dto);
        Klijent saved = klijentRepository.save(klijent);
        return KlijentMapper.mapToDto(saved);
    }

    @Override
    public KlijentDto getKlijentById(Long id) {
        Klijent klijent = klijentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Klijent sa ID " + id + " ne postoji."));
        return KlijentMapper.mapToDto(klijent);
    }

    @Override
    public List<KlijentDto> getAllKlijenti() {
        return klijentRepository.findAll()
                .stream()
                .map(KlijentMapper::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public KlijentDto updateKlijent(Long id, KlijentDto dto) {
        Klijent klijent = klijentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Klijent sa ID " + id + " ne postoji."));

        klijent.setIme(dto.getIme());
        klijent.setPrezime(dto.getPrezime());
        klijent.setKorisnickoIme(dto.getKorisnickoIme());
        klijent.setLozinka(dto.getLozinka());
        klijent.setEmail(dto.getEmail());
        klijent.setTelefon(dto.getTelefon());
        klijent.setKredit(dto.getKredit());

        Klijent updated = klijentRepository.save(klijent);
        return KlijentMapper.mapToDto(updated);
    }

    @Override
    public void deleteKlijent(Long id) {
        Klijent klijent = klijentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Klijent sa ID " + id + " ne postoji."));
        klijentRepository.deleteById(id);
    }

    @Override
    public KlijentDto getKlijentLogin(String korisnickoIme, String lozinka) {
        Klijent klijent = klijentRepository.findByKorisnickoImeAndLozinka(korisnickoIme, lozinka)
                .orElseThrow(() -> new ResourceNotFoundException("Pogrešno korisničko ime ili lozinka"));
        return KlijentMapper.mapToDto(klijent);
    }
}