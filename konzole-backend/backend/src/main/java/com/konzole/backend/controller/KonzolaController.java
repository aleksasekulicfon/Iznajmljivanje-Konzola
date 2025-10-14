package com.konzole.backend.controller;

import com.konzole.backend.dto.KonzolaDto;
import com.konzole.backend.service.KonzolaService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("*")
@AllArgsConstructor
@RestController
@RequestMapping("/api/konzole")
public class KonzolaController {

    private final KonzolaService konzolaService;

    @PostMapping
    public ResponseEntity<KonzolaDto> createKonzola(@RequestBody KonzolaDto dto) {
        return new ResponseEntity<>(konzolaService.createKonzola(dto), HttpStatus.CREATED);
    }

    @GetMapping("{id}")
    public ResponseEntity<KonzolaDto> getKonzolaById(@PathVariable Long id) {
        return ResponseEntity.ok(konzolaService.getKonzolaById(id));
    }

    @GetMapping
    public ResponseEntity<List<KonzolaDto>> getAllKonzole() {
        return ResponseEntity.ok(konzolaService.getAllKonzole());
    }

    @PutMapping("{id}")
    public ResponseEntity<KonzolaDto> updateKonzola(@PathVariable Long id, @RequestBody KonzolaDto dto) {
        return ResponseEntity.ok(konzolaService.updateKonzola(id, dto));
    }

    @DeleteMapping("{id}")
    public ResponseEntity<Void> deleteKonzola(@PathVariable Long id) {
        konzolaService.deleteKonzola(id);
        return ResponseEntity.noContent().build();
    }
}