package com.konzole.backend.service.impl;

import com.konzole.backend.dto.DodatnaOpremaDto;
import com.konzole.backend.entity.DodatnaOprema;
import com.konzole.backend.exception.ResourceNotFoundException;
import com.konzole.backend.mapper.DodatnaOpremaMapper;
import com.konzole.backend.repository.DodatnaOpremaRepository;
import com.konzole.backend.service.DodatnaOpremaService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class DodatnaOpremaServiceImpl implements DodatnaOpremaService {

    private final DodatnaOpremaRepository repo;

    @Override
    public DodatnaOpremaDto createDodatnaOprema(DodatnaOpremaDto dto) {
        return DodatnaOpremaMapper.mapToDto(repo.save(DodatnaOpremaMapper.mapToEntity(dto)));
    }

    @Override
    public DodatnaOpremaDto getDodatnaOpremaById(Long id) {
        DodatnaOprema d = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Dodatna oprema sa ID " + id + " ne postoji"));
        return DodatnaOpremaMapper.mapToDto(d);
    }

    @Override
    public List<DodatnaOpremaDto> getAllDodatnaOprema() {
        return repo.findAll().stream().map(DodatnaOpremaMapper::mapToDto).collect(Collectors.toList());
    }

    @Override
    public DodatnaOpremaDto updateDodatnaOprema(Long id, DodatnaOpremaDto dto) {
        DodatnaOprema d = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Dodatna oprema sa ID " + id + " ne postoji"));
        d.setNaziv(dto.getNaziv());
        d.setCena(dto.getCena());
        d.setZalihe(dto.getZalihe());
        d.setTip(dto.getTip());
        d.setProizvodjac(dto.getProizvodjac());
        d.setStanje(dto.getStanje());
        return DodatnaOpremaMapper.mapToDto(repo.save(d));
    }

    @Override
    public void deleteDodatnaOprema(Long id) {
        repo.deleteById(id);
    }
}