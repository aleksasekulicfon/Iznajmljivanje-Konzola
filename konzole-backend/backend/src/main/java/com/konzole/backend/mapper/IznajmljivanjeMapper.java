package com.konzole.backend.mapper;

import com.konzole.backend.dto.IznajmljivanjeDto;
import com.konzole.backend.entity.Iznajmljivanje;
import com.konzole.backend.entity.Klijent;
import com.konzole.backend.entity.Radnik;

import java.util.Collections;
import java.util.stream.Collectors;

public class IznajmljivanjeMapper {

    public static IznajmljivanjeDto toDto(Iznajmljivanje e) {
        return new IznajmljivanjeDto(
                e.getId(),
                e.getPocetak(),
                e.getKraj(),
                e.getPlaceno(),
                e.getStatus(),
                e.getUkupanBrojSati(),
                e.getUkupanIznos(),
                e.getRadnik() != null ? e.getRadnik().getId() : null,
                e.getKlijent() != null ? e.getKlijent().getId() : null,
                e.getStavke() != null
                        ? e.getStavke().stream().map(StavkaIznajmljivanjaMapper::toDto).collect(Collectors.toList())
                        : Collections.emptyList()
        );
    }

    public static Iznajmljivanje toEntity(IznajmljivanjeDto dto, Radnik radnik, Klijent klijent) {
        Iznajmljivanje e = new Iznajmljivanje();
        e.setId(dto.getId());
        e.setPocetak(dto.getPocetak());
        e.setKraj(dto.getKraj());
        e.setPlaceno(Boolean.TRUE.equals(dto.getPlaceno()));
        e.setStatus(dto.getStatus());
        e.setUkupanBrojSati(dto.getUkupanBrojSati());
        e.setUkupanIznos(dto.getUkupanIznos());
        e.setRadnik(radnik);
        e.setKlijent(klijent);
        return e;
    }
}