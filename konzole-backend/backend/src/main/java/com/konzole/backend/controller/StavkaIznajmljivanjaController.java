package com.konzole.backend.controller;

import com.konzole.backend.dto.StavkaIznajmljivanjaDto;
import com.konzole.backend.service.StavkaIznajmljivanjaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/iznajmljivanja/{iznajmljivanjeId}/stavke")
@RequiredArgsConstructor
public class StavkaIznajmljivanjaController {

    private final StavkaIznajmljivanjaService service;

    @PostMapping
    public ResponseEntity<StavkaIznajmljivanjaDto> create(@PathVariable Long iznajmljivanjeId,
                                                          @RequestBody StavkaIznajmljivanjaDto dto) {
        return ResponseEntity.ok(service.create(iznajmljivanjeId, dto));
    }

    @GetMapping
    public ResponseEntity<List<StavkaIznajmljivanjaDto>> list(@PathVariable Long iznajmljivanjeId) {
        return ResponseEntity.ok(service.list(iznajmljivanjeId));
    }

    @PutMapping("{stavkaId}")
    public ResponseEntity<StavkaIznajmljivanjaDto> update(@PathVariable Long iznajmljivanjeId,
                                                          @PathVariable Long stavkaId,
                                                          @RequestBody StavkaIznajmljivanjaDto dto) {
        return ResponseEntity.ok(service.update(iznajmljivanjeId, stavkaId, dto));
    }

    @DeleteMapping("{stavkaId}")
    public ResponseEntity<String> delete(@PathVariable Long iznajmljivanjeId,
                                         @PathVariable Long stavkaId) {
        service.delete(iznajmljivanjeId, stavkaId);
        return ResponseEntity.ok("Stavka obrisana");
    }
}