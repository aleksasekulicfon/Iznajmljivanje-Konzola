package com.konzole.backend.controller;

import com.konzole.backend.dto.OpremaDto;
import com.konzole.backend.service.OpremaService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("*")
@AllArgsConstructor
@RestController
@RequestMapping("/api/oprema")
public class OpremaController {

    private final OpremaService opremaService;

    @PostMapping
    public ResponseEntity<OpremaDto> createOprema(@RequestBody OpremaDto dto) {
        return new ResponseEntity<>(opremaService.createOprema(dto), HttpStatus.CREATED);
    }

    @GetMapping("{id}")
    public ResponseEntity<OpremaDto> getOpremaById(@PathVariable Long id) {
        return ResponseEntity.ok(opremaService.getOpremaById(id));
    }

    @GetMapping
    public ResponseEntity<List<OpremaDto>> getAllOpreme() {
        return ResponseEntity.ok(opremaService.getAllOpreme());
    }

    @PutMapping("{id}")
    public ResponseEntity<OpremaDto> updateOprema(@PathVariable Long id, @RequestBody OpremaDto dto) {
        return ResponseEntity.ok(opremaService.updateOprema(id, dto));
    }

    @DeleteMapping("{id}")
    public ResponseEntity<Void> deleteOprema(@PathVariable Long id) {
        opremaService.deleteOprema(id);
        return ResponseEntity.noContent().build();
    }
}