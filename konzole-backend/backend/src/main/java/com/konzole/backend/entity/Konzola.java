package com.konzole.backend.entity;

import jakarta.persistence.Entity;
import lombok.*;

@Entity
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Konzola extends Oprema {
    private String inventarskiBroj;
}