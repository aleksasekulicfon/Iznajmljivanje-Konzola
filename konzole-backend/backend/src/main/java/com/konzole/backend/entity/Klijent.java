package com.konzole.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "klijent")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Klijent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String ime;
    private String prezime;
    private String korisnickoIme;
    private String lozinka;
    private String email;
    private String telefon;
    private Double kredit;

    @ManyToOne
    @JoinColumn(name = "mesto_id")
    private Mesto mesto;

    @OneToMany(mappedBy = "klijent")
    private List<Iznajmljivanje> iznajmljivanja = new ArrayList<>();
}