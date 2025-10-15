package com.konzole.backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;
import lombok.*;

@Entity
@Table(name = "konzola")
@PrimaryKeyJoinColumn(name = "id")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Konzola extends Oprema {
    private String inventarskiBroj;
}