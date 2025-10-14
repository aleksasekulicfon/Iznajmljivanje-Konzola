package com.konzole.backend.mapper;

import com.konzole.backend.dto.RadnikDto;
import com.konzole.backend.entity.Radnik;


public class RadnikMapper {

    public static RadnikDto mapToRadnikDto(Radnik radnik) {
        return new RadnikDto(
                radnik.getId(),
                radnik.getIme(),
                radnik.getPrezime(),
                radnik.getKorisnickoIme(),
                radnik.getLozinka()
        );
    }

    public static Radnik mapToRadnik(RadnikDto dto) {
        Radnik radnik = new Radnik();
        radnik.setId(dto.getId());
        radnik.setIme(dto.getIme());
        radnik.setPrezime(dto.getPrezime());
        radnik.setKorisnickoIme(dto.getKorisnickoIme());
        radnik.setLozinka(dto.getLozinka());
        return radnik;
    }
}