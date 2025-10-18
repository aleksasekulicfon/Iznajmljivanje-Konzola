package com.konzole.backend.mapper;

import com.konzole.backend.dto.KlijentDto;
import com.konzole.backend.entity.Klijent;
import com.konzole.backend.entity.Mesto;

public class KlijentMapper {
    public static KlijentDto mapToDto(Klijent entity) {
        KlijentDto dto = new KlijentDto();
        dto.setId(entity.getId());
        dto.setIme(entity.getIme());
        dto.setPrezime(entity.getPrezime());
        dto.setKorisnickoIme(entity.getKorisnickoIme());
        dto.setLozinka(entity.getLozinka());
        dto.setEmail(entity.getEmail());
        dto.setTelefon(entity.getTelefon());
        dto.setKredit(entity.getKredit());
        dto.setMestoId(entity.getMesto() != null ? entity.getMesto().getId() : null);
        return dto;
    }

    public static Klijent mapToEntity(KlijentDto dto) {
        Klijent entity = new Klijent();
        entity.setId(dto.getId());
        entity.setIme(dto.getIme());
        entity.setPrezime(dto.getPrezime());
        entity.setKorisnickoIme(dto.getKorisnickoIme());
        entity.setLozinka(dto.getLozinka());
        entity.setEmail(dto.getEmail());
        entity.setTelefon(dto.getTelefon());
        entity.setKredit(dto.getKredit());
        if (dto.getMestoId() != null) {
            Mesto mesto = new Mesto();
            mesto.setId(dto.getMestoId());
            entity.setMesto(mesto);
        }
        return entity;
    }
}