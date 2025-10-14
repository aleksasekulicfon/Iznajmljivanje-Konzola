package com.konzole.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Entity
@Table(name = "stavka_iznajmljivanja")
public class StavkaIznajmljivanja {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Integer rb;

    @Column(nullable = false)
    private Double cena;

    @Column(nullable = false)
    private Integer kolicina;

    @Column(name = "ukupno_vreme")
    private Double ukupnoVreme;

    @Column
    private Double iznos;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "oprema_id", nullable = false)
    private Oprema oprema;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "iznajmljivanje_id", nullable = false)
    private Iznajmljivanje iznajmljivanje;
}