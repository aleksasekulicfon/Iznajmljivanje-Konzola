package com.konzole.backend.service.impl;

import com.konzole.backend.dto.MestoDto;
import com.konzole.backend.entity.Mesto;
import com.konzole.backend.exception.ResourceNotFoundException;
import com.konzole.backend.mapper.MestoMapper;
import com.konzole.backend.repository.MestoRepository;
import com.konzole.backend.service.MestoService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class MestoServiceImpl implements MestoService {

    private final MestoRepository repo;

    @Override
    public MestoDto createMesto(MestoDto dto) {
        return MestoMapper.mapToDto(repo.save(MestoMapper.mapToEntity(dto)));
    }

    @Override
    public MestoDto getMestoById(Long id) {
        Mesto mesto = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Mesto sa ID " + id + " ne postoji"));
        return MestoMapper.mapToDto(mesto);
    }

    @Override
    public List<MestoDto> getAllMesta() {
        return repo.findAll().stream().map(MestoMapper::mapToDto).collect(Collectors.toList());
    }

    @Override
    public MestoDto updateMesto(Long id, MestoDto dto) {
        Mesto m = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Mesto sa ID " + id + " ne postoji"));
        m.setNaziv(dto.getNaziv());
        return MestoMapper.mapToDto(repo.save(m));
    }

    @Override
    public void deleteMesto(Long id) {
        repo.deleteById(id);
    }
}