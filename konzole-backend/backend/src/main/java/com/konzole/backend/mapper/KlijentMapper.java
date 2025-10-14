package com.konzole.backend.mapper;

import com.konzole.backend.dto.KlijentDto;
import com.konzole.backend.entity.Klijent;
import com.konzole.backend.entity.Mesto;

public class KlijentMapper {
    public static KlijentDto mapToDto(Klijent k) {
        if (k == null) return null;
        return new KlijentDto(
                k.getId(),
                k.getIme(),
                k.getPrezime(),
                k.getKorisnickoIme(),
                k.getLozinka(),
                k.getEmail(),
                k.getTelefon(),
                k.getKredit(),
                k.getMesto() != null ? k.getMesto().getId() : null
        );
    }

    public static Klijent mapToEntity(KlijentDto dto) {
        if (dto == null) return null;
        Klijent k = new Klijent();
        k.setId(dto.getId());
        k.setIme(dto.getIme());
        k.setPrezime(dto.getPrezime());
        k.setKorisnickoIme(dto.getKorisnickoIme());
        k.setLozinka(dto.getLozinka());
        k.setEmail(dto.getEmail());
        k.setTelefon(dto.getTelefon());
        k.setKredit(dto.getKredit());

        if (dto.getMestoId() != null) {
            Mesto m = new Mesto();
            m.setId(dto.getMestoId());
            k.setMesto(m);
        }
        return k;
    }
}