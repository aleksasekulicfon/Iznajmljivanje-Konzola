package com.konzole.backend.service.impl;

import com.konzole.backend.dto.KlijentDto;
import com.konzole.backend.entity.Klijent;
import com.konzole.backend.entity.Mesto;
import com.konzole.backend.exception.ResourceNotFoundException;
import com.konzole.backend.mapper.KlijentMapper;
import com.konzole.backend.repository.KlijentRepository;
import com.konzole.backend.repository.MestoRepository;
import com.konzole.backend.service.KlijentService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class KlijentServiceImpl implements KlijentService {

    private final KlijentRepository klijentRepository;
    private final MestoRepository mestoRepository;

    @Override
    public KlijentDto createKlijent(KlijentDto dto) {
        if (klijentRepository.findByKorisnickoIme(dto.getKorisnickoIme()).isPresent()) {
            throw new IllegalArgumentException("Klijent sa tim korisničkim imenom već postoji!");
        }

        Klijent klijent = KlijentMapper.mapToEntity(dto);

        if (dto.getMestoId() != null) {
            Mesto mesto = mestoRepository.findById(dto.getMestoId())
                    .orElseThrow(() -> new ResourceNotFoundException("Mesto sa ID " + dto.getMestoId() + " ne postoji."));
            klijent.setMesto(mesto);
        }

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
        if (klijentRepository.findByKorisnickoIme(dto.getKorisnickoIme()).isPresent()) {
            throw new IllegalArgumentException("Klijent sa tim korisničkim imenom već postoji!");
        }

        Klijent existing = klijentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Klijent sa ID " + id + " ne postoji."));

        if (dto.getIme() != null) existing.setIme(dto.getIme());
        if (dto.getPrezime() != null) existing.setPrezime(dto.getPrezime());
        if (dto.getKorisnickoIme() != null) existing.setKorisnickoIme(dto.getKorisnickoIme());
        if (dto.getEmail() != null) existing.setEmail(dto.getEmail());
        if (dto.getTelefon() != null) existing.setTelefon(dto.getTelefon());
        if (dto.getKredit() != null) existing.setKredit(dto.getKredit());
        if (dto.getLozinka() != null && !dto.getLozinka().isBlank())
            existing.setLozinka(dto.getLozinka());

        if (dto.getMestoId() != null) {
            Mesto mesto = mestoRepository.findById(dto.getMestoId())
                    .orElseThrow(() -> new ResourceNotFoundException("Mesto sa ID " + dto.getMestoId() + " ne postoji."));
            existing.setMesto(mesto);
        }

        Klijent saved = klijentRepository.save(existing);
        return KlijentMapper.mapToDto(saved);
    }

    @Override
    public void deleteKlijent(Long id) {
        Klijent klijent = klijentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Klijent sa ID " + id + " ne postoji."));
        klijentRepository.delete(klijent);
    }

    @Override
    public KlijentDto getKlijentLogin(String korisnickoIme, String lozinka) {
        Klijent klijent = klijentRepository.findByKorisnickoImeAndLozinka(korisnickoIme, lozinka)
                .orElseThrow(() -> new ResourceNotFoundException("Pogrešno korisničko ime ili lozinka"));
        return KlijentMapper.mapToDto(klijent);
    }
}