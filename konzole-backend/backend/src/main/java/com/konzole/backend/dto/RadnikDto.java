package com.konzole.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RadnikDto {
    private Long id;
    private String ime;
    private String prezime;
    private String korisnickoIme;
    private String lozinka;
}