package com.konzole.backend.mapper;

import com.konzole.backend.dto.KonzolaDto;
import com.konzole.backend.entity.Konzola;

public class KonzolaMapper {
    public static KonzolaDto mapToDto(Konzola k) {
        if (k == null) return null;

        KonzolaDto dto = new KonzolaDto();
        dto.setId(k.getId());
        dto.setNaziv(k.getNaziv());
        dto.setProizvodjac(k.getProizvodjac());
        dto.setCena(k.getCena());
        dto.setStanje(k.getStanje());
        dto.setZalihe(k.getZalihe());
        dto.setInventarskiBroj(k.getInventarskiBroj());
        return dto;
    }

    public static Konzola mapToEntity(KonzolaDto dto) {
        if (dto == null) return null;
        Konzola k = new Konzola();
        k.setId(dto.getId());
        k.setNaziv(dto.getNaziv());
        k.setProizvodjac(dto.getProizvodjac());
        k.setCena(dto.getCena());
        k.setStanje(dto.getStanje());
        k.setZalihe(dto.getZalihe());
        k.setInventarskiBroj(dto.getInventarskiBroj());
        return k;
    }
}