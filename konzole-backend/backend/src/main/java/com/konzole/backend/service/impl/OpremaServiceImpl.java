package com.konzole.backend.service.impl;

import com.konzole.backend.dto.OpremaDto;
import com.konzole.backend.entity.Oprema;
import com.konzole.backend.exception.ResourceNotFoundException;
import com.konzole.backend.mapper.OpremaMapper;
import com.konzole.backend.repository.OpremaRepository;
import com.konzole.backend.service.OpremaService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class OpremaServiceImpl implements OpremaService {

    private final OpremaRepository repo;

    @Override
    public OpremaDto createOprema(OpremaDto dto) {
        return OpremaMapper.mapToDto(repo.save(OpremaMapper.mapToEntity(dto)));
    }

    @Override
    public OpremaDto getOpremaById(Long id) {
        Oprema oprema = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Oprema sa ID " + id + " ne postoji"));
        return OpremaMapper.mapToDto(oprema);
    }

    @Override
    public List<OpremaDto> getAllOpreme() {
        return repo.findAll().stream().map(OpremaMapper::mapToDto).collect(Collectors.toList());
    }

    @Override
    public OpremaDto updateOprema(Long id, OpremaDto dto) {
        Oprema o = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Oprema sa ID " + id + " ne postoji"));
        o.setNaziv(dto.getNaziv());
        o.setCena(dto.getCena());
        return OpremaMapper.mapToDto(repo.save(o));
    }

    @Override
    public void deleteOprema(Long id) {
        repo.deleteById(id);
    }
}