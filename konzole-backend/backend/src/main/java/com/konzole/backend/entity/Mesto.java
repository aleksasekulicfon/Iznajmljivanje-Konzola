package com.konzole.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "mesto")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Mesto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String naziv;

    @OneToMany(mappedBy = "mesto")
    private List<Klijent> klijenti = new ArrayList<>();;
}