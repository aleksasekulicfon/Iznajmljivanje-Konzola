package com.konzole.backend.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class KlijentDto {
    private Long id;
    private String ime;
    private String prezime;
    private String korisnickoIme;
    private String lozinka;
    private String email;
    private String telefon;
    private Double kredit;
    private Long mestoId;
}