package com.konzole.backend.service.impl;

import com.konzole.backend.dto.KonzolaDto;
import com.konzole.backend.entity.Konzola;
import com.konzole.backend.exception.ResourceNotFoundException;
import com.konzole.backend.mapper.KonzolaMapper;
import com.konzole.backend.repository.KonzolaRepository;
import com.konzole.backend.service.KonzolaService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class KonzolaServiceImpl implements KonzolaService {

    private final KonzolaRepository repo;

    @Override
    public KonzolaDto createKonzola(KonzolaDto dto) {
        return KonzolaMapper.mapToDto(repo.save(KonzolaMapper.mapToEntity(dto)));
    }

    @Override
    public KonzolaDto getKonzolaById(Long id) {
        Konzola k = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Konzola sa ID " + id + " ne postoji"));
        return KonzolaMapper.mapToDto(k);
    }

    @Override
    public List<KonzolaDto> getAllKonzole() {
        return repo.findAll().stream().map(KonzolaMapper::mapToDto).collect(Collectors.toList());
    }

    @Override
    public KonzolaDto updateKonzola(Long id, KonzolaDto dto) {
        Konzola k = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Konzola sa ID " + id + " ne postoji"));
        k.setNaziv(dto.getNaziv());
        k.setCena(dto.getCena());
        k.setZalihe(dto.getZalihe());
        k.setProizvodjac(dto.getProizvodjac());
        k.setInventarskiBroj(dto.getInventarskiBroj());
        k.setStanje(dto.getStanje());
        return KonzolaMapper.mapToDto(repo.save(k));
    }

    @Override
    public void deleteKonzola(Long id) {
        repo.deleteById(id);
    }
}