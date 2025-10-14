package com.konzole.backend.dto;

import com.konzole.backend.entity.enums.Status;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class IznajmljivanjeDto {
    private Long id;
    private LocalDateTime pocetak;
    private LocalDateTime kraj;
    private Boolean placeno;
    private Status status;
    private Double ukupanBrojSati;
    private Double ukupanIznos;
    private Long radnikId;
    private Long klijentId;
    private List<StavkaIznajmljivanjaDto> stavke;
}