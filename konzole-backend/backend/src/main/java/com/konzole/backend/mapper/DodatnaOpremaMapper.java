package com.konzole.backend.mapper;

import com.konzole.backend.dto.DodatnaOpremaDto;
import com.konzole.backend.entity.DodatnaOprema;

public class DodatnaOpremaMapper {
    public static DodatnaOpremaDto mapToDto(DodatnaOprema d) {
        if (d == null) return null;

        DodatnaOpremaDto dto = new DodatnaOpremaDto();
        dto.setId(d.getId());
        dto.setNaziv(d.getNaziv());
        dto.setProizvodjac(d.getProizvodjac());
        dto.setCena(d.getCena());
        dto.setStanje(d.getStanje());
        dto.setTip(d.getTip());
        return dto;
    }

    public static DodatnaOprema mapToEntity(DodatnaOpremaDto dto) {
        if (dto == null) return null;
        DodatnaOprema d = new DodatnaOprema();
        d.setId(dto.getId());
        d.setNaziv(dto.getNaziv());
        d.setProizvodjac(dto.getProizvodjac());
        d.setCena(dto.getCena());
        d.setStanje(dto.getStanje());
        d.setTip(dto.getTip());
        return d;
    }
}