package com.konzole.backend.controller;

import com.konzole.backend.dto.RadnikDto;
import com.konzole.backend.service.RadnikService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("*")
@AllArgsConstructor
@RestController
@RequestMapping("/api/radnici")
public class RadnikController {

    private final RadnikService radnikService;

    // Add Radnik
    @PostMapping
    public ResponseEntity<RadnikDto> createRadnik(@RequestBody RadnikDto radnikDto) {
        RadnikDto savedRadnik = radnikService.createRadnik(radnikDto);
        return new ResponseEntity<>(savedRadnik, HttpStatus.CREATED);
    }

    // Get Radnik by ID
    @GetMapping("{id}")
    public ResponseEntity<RadnikDto> getRadnikById(@PathVariable("id") Long radnikId) {
        return ResponseEntity.ok(radnikService.getRadnikById(radnikId));
    }

    // Get all Radnici
    @GetMapping
    public ResponseEntity<List<RadnikDto>> getAllRadnici() {
        return ResponseEntity.ok(radnikService.getAllRadnici());
    }

    // Update Radnik
    @PutMapping("{id}")
    public ResponseEntity<RadnikDto> updateRadnik(@PathVariable("id") Long radnikId,
                                                  @RequestBody RadnikDto updatedRadnik) {
        return ResponseEntity.ok(radnikService.updateRadnik(radnikId, updatedRadnik));
    }

    // Delete Radnik
    @DeleteMapping("{id}")
    public ResponseEntity<Void> deleteRadnik(@PathVariable("id") Long radnikId){
        radnikService.deleteRadnik(radnikId);
        return ResponseEntity.noContent().build(); // status 204
    }

    // Login Radnik
    @PostMapping("/login")
    public ResponseEntity<RadnikDto> login(@RequestParam String korisnickoIme,
                                           @RequestParam String lozinka) {
        RadnikDto radnik = radnikService.getRadnikLogin(korisnickoIme, lozinka);
        return ResponseEntity.ok(radnik);
    }
}