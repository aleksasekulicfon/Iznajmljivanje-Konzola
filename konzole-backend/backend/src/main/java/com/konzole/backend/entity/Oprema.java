package com.konzole.backend.entity;

import com.konzole.backend.entity.enums.Stanje;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "oprema")
@Inheritance(strategy = InheritanceType.JOINED)
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public abstract class Oprema {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String naziv;
    private String proizvodjac;
    private Double cena;

    @Enumerated(EnumType.STRING)
    private Stanje stanje;

    @OneToMany(mappedBy = "oprema")
    private List<StavkaIznajmljivanja> stavke = new ArrayList<>();
}
