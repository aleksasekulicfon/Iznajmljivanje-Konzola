package com.konzole.backend.mapper;

import com.konzole.backend.dto.OpremaDto;
import com.konzole.backend.entity.Oprema;

public class OpremaMapper {
    public static OpremaDto mapToDto(Oprema o) {
        if (o == null) return null;
        return new OpremaDto(
                o.getId(),
                o.getNaziv(),
                o.getProizvodjac(),
                o.getCena(),
                o.getStanje(),
                o.getZalihe()
        );
    }

    public static Oprema mapToEntity(OpremaDto dto) {
        if (dto == null) return null;
        Oprema o = new Oprema() {}; // jer je Oprema apstraktna
        o.setId(dto.getId());
        o.setNaziv(dto.getNaziv());
        o.setProizvodjac(dto.getProizvodjac());
        o.setCena(dto.getCena());
        o.setStanje(dto.getStanje());
        o.setZalihe(dto.getZalihe());
        return o;
    }
}