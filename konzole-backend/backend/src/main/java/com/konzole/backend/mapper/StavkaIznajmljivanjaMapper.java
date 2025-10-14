package com.konzole.backend.mapper;

import com.konzole.backend.dto.StavkaIznajmljivanjaDto;
import com.konzole.backend.entity.Oprema;
import com.konzole.backend.entity.StavkaIznajmljivanja;

public class StavkaIznajmljivanjaMapper {

    public static StavkaIznajmljivanjaDto toDto(StavkaIznajmljivanja e) {
        return new StavkaIznajmljivanjaDto(
                e.getId(),
                e.getRb(),
                e.getCena(),
                e.getKolicina(),
                e.getUkupnoVreme(),
                e.getIznos(),
                e.getOprema() != null ? e.getOprema().getId() : null,
                e.getOprema() != null ? e.getOprema().getNaziv() : null
        );
    }

    public static StavkaIznajmljivanja toEntity(StavkaIznajmljivanjaDto dto, Oprema oprema) {
        StavkaIznajmljivanja s = new StavkaIznajmljivanja();
        s.setId(dto.getId());
        s.setRb(dto.getRb());
        s.setCena(dto.getCena());
        s.setKolicina(dto.getKolicina());
        s.setUkupnoVreme(dto.getUkupnoVreme());
        s.setIznos(dto.getIznos());
        s.setOprema(oprema);
        return s;
    }
}