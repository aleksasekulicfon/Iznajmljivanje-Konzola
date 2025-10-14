package com.konzole.backend.dto;

import lombok.*;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class StavkaIznajmljivanjaDto {
    private Long id;
    private Integer rb;
    private Double cena;
    private Integer kolicina;
    private Double ukupnoVreme;
    private Double iznos;
    private Long opremaId;
    private String opremaNaziv;
}