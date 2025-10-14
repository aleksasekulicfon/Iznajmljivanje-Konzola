package com.konzole.backend.controller;

import com.konzole.backend.dto.MestoDto;
import com.konzole.backend.service.MestoService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("*")
@AllArgsConstructor
@RestController
@RequestMapping("/api/mesta")
public class MestoController {

    private final MestoService mestoService;

    @PostMapping
    public ResponseEntity<MestoDto> createMesto(@RequestBody MestoDto dto) {
        return new ResponseEntity<>(mestoService.createMesto(dto), HttpStatus.CREATED);
    }

    @GetMapping("{id}")
    public ResponseEntity<MestoDto> getMestoById(@PathVariable Long id) {
        return ResponseEntity.ok(mestoService.getMestoById(id));
    }

    @GetMapping
    public ResponseEntity<List<MestoDto>> getAllMesta() {
        return ResponseEntity.ok(mestoService.getAllMesta());
    }

    @PutMapping("{id}")
    public ResponseEntity<MestoDto> updateMesto(@PathVariable Long id, @RequestBody MestoDto dto) {
        return ResponseEntity.ok(mestoService.updateMesto(id, dto));
    }

    @DeleteMapping("{id}")
    public ResponseEntity<Void> deleteMesto(@PathVariable Long id) {
        mestoService.deleteMesto(id);
        return ResponseEntity.noContent().build();
    }
}