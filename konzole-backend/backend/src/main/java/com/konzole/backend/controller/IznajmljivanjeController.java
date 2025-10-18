package com.konzole.backend.controller;

import com.konzole.backend.dto.IznajmljivanjeDto;
import com.konzole.backend.dto.StavkaIznajmljivanjaDto;
import com.konzole.backend.service.IznajmljivanjeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/iznajmljivanja")
@RequiredArgsConstructor
public class IznajmljivanjeController {

    private final IznajmljivanjeService service;

    @PostMapping
    public ResponseEntity<IznajmljivanjeDto> create(@RequestBody IznajmljivanjeDto dto) {
        return ResponseEntity.ok(service.create(dto));
    }

    @GetMapping("{id}")
    public ResponseEntity<IznajmljivanjeDto> get(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @GetMapping
    public ResponseEntity<List<IznajmljivanjeDto>> list() {
        return ResponseEntity.ok(service.getAll());
    }

    @PutMapping("{id}")
    public ResponseEntity<IznajmljivanjeDto> update(@PathVariable Long id, @RequestBody IznajmljivanjeDto dto) {
        return ResponseEntity.ok(service.update(id, dto));
    }

    @DeleteMapping("{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.ok("Iznajmljivanje obrisano");
    }

    @PutMapping("{id}/zavrsi")
    public ResponseEntity<IznajmljivanjeDto> finish(@PathVariable Long id) {
        return ResponseEntity.ok(service.zavrsi(id));
    }

    @PutMapping("{id}/stavke")
    public ResponseEntity<IznajmljivanjeDto> upsertStavke(@PathVariable Long id,
                                                          @RequestBody List<StavkaIznajmljivanjaDto> stavke) {
        return ResponseEntity.ok(service.upsertStavke(id, stavke));
    }

    @PutMapping("{id}/plati")
    public ResponseEntity<IznajmljivanjeDto> plati(@PathVariable Long id) {
        return ResponseEntity.ok(service.plati(id));
    }

}