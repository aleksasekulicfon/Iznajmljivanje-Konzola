package com.konzole.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name="radnik")
public class Radnik {

    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long id;

    @Column(name="ime", nullable = false)
    private String ime;

    @Column(name="prezime", nullable = false)
    private String prezime;

    @Column(name="korisnicko_ime", nullable = false, unique = true)
    private String korisnickoIme;

    @Column(name="lozinka", nullable = false)
    private String lozinka;

    @OneToMany(mappedBy = "radnik")
    private List<Iznajmljivanje> iznajmljivanja = new ArrayList<>();
}