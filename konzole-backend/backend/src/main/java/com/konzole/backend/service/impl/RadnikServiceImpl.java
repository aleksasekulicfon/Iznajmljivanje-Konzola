package com.konzole.backend.service.impl;

import com.konzole.backend.dto.RadnikDto;
import com.konzole.backend.entity.Radnik;
import com.konzole.backend.exception.ResourceNotFoundException;
import com.konzole.backend.mapper.RadnikMapper;
import com.konzole.backend.repository.RadnikRepository;
import com.konzole.backend.service.RadnikService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class RadnikServiceImpl implements RadnikService {

    private final RadnikRepository radnikRepository;

    @Override
    public RadnikDto createRadnik(RadnikDto radnikDto) {
        Radnik radnik = RadnikMapper.mapToRadnik(radnikDto);
        Radnik savedRadnik = radnikRepository.save(radnik);
        return RadnikMapper.mapToRadnikDto(savedRadnik);
    }

    @Override
    public RadnikDto getRadnikById(Long radnikId) {
        Radnik radnik = radnikRepository.findById(radnikId)
                .orElseThrow(() -> new ResourceNotFoundException("Radnik sa ID " + radnikId + " ne postoji"));
        return RadnikMapper.mapToRadnikDto(radnik);
    }

    @Override
    public List<RadnikDto> getAllRadnici() {
        return radnikRepository.findAll()
                .stream()
                .map(RadnikMapper::mapToRadnikDto)
                .collect(Collectors.toList());
    }

    @Override
    public RadnikDto updateRadnik(Long radnikId, RadnikDto updatedRadnik) {
        Radnik radnik = radnikRepository.findById(radnikId)
                .orElseThrow(() -> new ResourceNotFoundException("Radnik sa ID " + radnikId + " ne postoji"));

        radnik.setIme(updatedRadnik.getIme());
        radnik.setPrezime(updatedRadnik.getPrezime());
        radnik.setKorisnickoIme(updatedRadnik.getKorisnickoIme());
        radnik.setLozinka(updatedRadnik.getLozinka());

        Radnik updated = radnikRepository.save(radnik);
        return RadnikMapper.mapToRadnikDto(updated);
    }

    @Override
    public void deleteRadnik(Long radnikId) {
        Radnik radnik = radnikRepository.findById(radnikId)
                .orElseThrow(() -> new ResourceNotFoundException("Radnik sa ID " + radnikId + " ne postoji"));
        radnikRepository.delete(radnik);
    }

    @Override
    public RadnikDto getRadnikLogin(String korisnickoIme, String lozinka) {
        Radnik radnik = radnikRepository.findByKorisnickoImeAndLozinka(korisnickoIme, lozinka)
                .orElseThrow(() -> new ResourceNotFoundException("Pogrešno korisničko ime ili lozinka"));
        return RadnikMapper.mapToRadnikDto(radnik);
    }
}