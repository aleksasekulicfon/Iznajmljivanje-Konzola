package com.konzole.backend.entity;

import com.konzole.backend.entity.enums.Status;
import jakarta.persistence.*;
import lombok.*;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Entity
@Table(name = "iznajmljivanje")
public class Iznajmljivanje {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDateTime pocetak;

    @Column
    private LocalDateTime kraj;

    @Column(nullable = false)
    private Boolean placeno = false;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.U_TOKU;

    @Column(name = "ukupan_broj_sati")
    private Double ukupanBrojSati;

    @Column(name = "ukupan_iznos")
    private Double ukupanIznos;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "radnik_id", nullable = false)
    private Radnik radnik;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "klijent_id", nullable = false)
    private Klijent klijent;

    @OneToMany(mappedBy = "iznajmljivanje", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<StavkaIznajmljivanja> stavke = new ArrayList<>();

    public void addStavka(StavkaIznajmljivanja s) {
        s.setIznajmljivanje(this);
        this.stavke.add(s);
    }

    public void preracunajUkupno() {
        double sati = 0.0;
        if (pocetak != null && kraj != null) {
            sati = Duration.between(pocetak, kraj).toMinutes() / 60.0;
            this.ukupanBrojSati = sati;
        }

        double total = 0.0;
        for (StavkaIznajmljivanja s : stavke) {
            double vreme = s.getUkupnoVreme() != null ? s.getUkupnoVreme() : sati;
            double iznos = s.getCena() * s.getKolicina() * (vreme != 0.0 ? vreme : 0.0);
            s.setIznos(iznos);
            total += iznos;
        }
        this.ukupanIznos = total;
    }
}