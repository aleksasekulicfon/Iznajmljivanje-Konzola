package com.konzole.backend.entity;

import jakarta.persistence.Entity;
import lombok.*;

@Entity
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class DodatnaOprema extends Oprema {
    private String tip;
}