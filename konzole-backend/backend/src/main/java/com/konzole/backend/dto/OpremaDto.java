package com.konzole.backend.dto;

import com.konzole.backend.entity.enums.Stanje;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class OpremaDto {
    private Long id;
    private String naziv;
    private String proizvodjac;
    private Double cena;
    private Stanje stanje;
    private Integer zalihe;
}