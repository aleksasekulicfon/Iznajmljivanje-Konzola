package com.konzole.backend.mapper;

import com.konzole.backend.dto.MestoDto;
import com.konzole.backend.entity.Mesto;

public class MestoMapper {
    public static MestoDto mapToDto(Mesto m) {
        if (m == null) return null;
        return new MestoDto(m.getId(), m.getNaziv());
    }

    public static Mesto mapToEntity(MestoDto dto) {
        if (dto == null) return null;
        Mesto m = new Mesto();
        m.setId(dto.getId());
        m.setNaziv(dto.getNaziv());
        return m;
    }
}