package com.konzole.backend.controller;

import com.konzole.backend.dto.KlijentDto;
import com.konzole.backend.service.KlijentService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("*")
@AllArgsConstructor
@RestController
@RequestMapping("/api/klijenti")
public class KlijentController {

    private final KlijentService klijentService;

    @PostMapping
    public ResponseEntity<KlijentDto> createKlijent(@RequestBody KlijentDto dto) {
        return new ResponseEntity<>(klijentService.createKlijent(dto), HttpStatus.CREATED);
    }

    @GetMapping("{id}")
    public ResponseEntity<KlijentDto> getKlijentById(@PathVariable Long id) {
        return ResponseEntity.ok(klijentService.getKlijentById(id));
    }

    @GetMapping
    public ResponseEntity<List<KlijentDto>> getAllKlijenti() {
        return ResponseEntity.ok(klijentService.getAllKlijenti());
    }

    @PutMapping("{id}")
    public ResponseEntity<KlijentDto> updateKlijent(@PathVariable Long id, @RequestBody KlijentDto dto) {
        return ResponseEntity.ok(klijentService.updateKlijent(id, dto));
    }

    @DeleteMapping("{id}")
    public ResponseEntity<Void> deleteKlijent(@PathVariable Long id) {
        klijentService.deleteKlijent(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/login")
    public ResponseEntity<KlijentDto> login(@RequestParam String korisnickoIme,
                                           @RequestParam String lozinka) {
        KlijentDto klijent = klijentService.getKlijentLogin(korisnickoIme, lozinka);
        return ResponseEntity.ok(klijent);
    }
}