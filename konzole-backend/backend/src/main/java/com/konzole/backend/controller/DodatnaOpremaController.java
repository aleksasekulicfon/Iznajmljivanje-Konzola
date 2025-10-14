package com.konzole.backend.controller;

import com.konzole.backend.dto.DodatnaOpremaDto;
import com.konzole.backend.service.DodatnaOpremaService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("*")
@AllArgsConstructor
@RestController
@RequestMapping("/api/dodatna-oprema")
public class DodatnaOpremaController {

    private final DodatnaOpremaService dodatnaOpremaService;

    @PostMapping
    public ResponseEntity<DodatnaOpremaDto> create(@RequestBody DodatnaOpremaDto dto) {
        return new ResponseEntity<>(dodatnaOpremaService.createDodatnaOprema(dto), HttpStatus.CREATED);
    }

    @GetMapping("{id}")
    public ResponseEntity<DodatnaOpremaDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(dodatnaOpremaService.getDodatnaOpremaById(id));
    }

    @GetMapping
    public ResponseEntity<List<DodatnaOpremaDto>> getAll() {
        return ResponseEntity.ok(dodatnaOpremaService.getAllDodatnaOprema());
    }

    @PutMapping("{id}")
    public ResponseEntity<DodatnaOpremaDto> update(@PathVariable Long id, @RequestBody DodatnaOpremaDto dto) {
        return ResponseEntity.ok(dodatnaOpremaService.updateDodatnaOprema(id, dto));
    }

    @DeleteMapping("{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        dodatnaOpremaService.deleteDodatnaOprema(id);
        return ResponseEntity.noContent().build();
    }
}