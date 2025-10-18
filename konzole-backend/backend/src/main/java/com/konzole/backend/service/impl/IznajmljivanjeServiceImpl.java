package com.konzole.backend.service.impl;

import com.konzole.backend.dto.IznajmljivanjeDto;
import com.konzole.backend.dto.StavkaIznajmljivanjaDto;
import com.konzole.backend.entity.*;
import com.konzole.backend.entity.enums.Stanje;
import com.konzole.backend.entity.enums.Status;
import com.konzole.backend.exception.ResourceNotFoundException;
import com.konzole.backend.mapper.IznajmljivanjeMapper;
import com.konzole.backend.mapper.StavkaIznajmljivanjaMapper;
import com.konzole.backend.repository.*;
import com.konzole.backend.service.IznajmljivanjeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class IznajmljivanjeServiceImpl implements IznajmljivanjeService {

    private final IznajmljivanjeRepository iznajmljivanjeRepository;
    private final RadnikRepository radnikRepository;
    private final KlijentRepository klijentRepository;
    private final OpremaRepository opremaRepository;

    @Override
    public IznajmljivanjeDto create(IznajmljivanjeDto dto) {
        Radnik radnik = radnikRepository.findById(dto.getRadnikId())
                .orElseThrow(() -> new ResourceNotFoundException("Radnik nije pronađen: " + dto.getRadnikId()));

        Klijent klijent = klijentRepository.findById(dto.getKlijentId())
                .orElseThrow(() -> new ResourceNotFoundException("Klijent nije pronađen: " + dto.getKlijentId()));

        if (dto.getPocetak() == null) dto.setPocetak(LocalDateTime.now());
        dto.setStatus(dto.getStatus() == null ? Status.U_TOKU : dto.getStatus());

        Iznajmljivanje entity = IznajmljivanjeMapper.toEntity(dto, radnik, klijent);

        if (dto.getStavke() != null && !dto.getStavke().isEmpty()) {
            for (StavkaIznajmljivanjaDto sDto : dto.getStavke()) {
                Oprema oprema = opremaRepository.findById(sDto.getOpremaId())
                        .orElseThrow(() -> new ResourceNotFoundException("Oprema nije pronađena: " + sDto.getOpremaId()));
                var stavka = StavkaIznajmljivanjaMapper.toEntity(sDto, oprema);
                entity.addStavka(stavka);
            }
        }

        entity.preracunajUkupno();
        rezervisiOpreme(entity);
        Iznajmljivanje saved = iznajmljivanjeRepository.save(entity);
        return IznajmljivanjeMapper.toDto(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public IznajmljivanjeDto getById(Long id) {
        Iznajmljivanje e = iznajmljivanjeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Iznajmljivanje nije pronađeno: " + id));
        return IznajmljivanjeMapper.toDto(e);
    }

    @Override
    @Transactional(readOnly = true)
    public List<IznajmljivanjeDto> getAll() {
        return iznajmljivanjeRepository.findAll().stream()
                .map(IznajmljivanjeMapper::toDto)
                .toList();
    }

    @Override
    public IznajmljivanjeDto update(Long id, IznajmljivanjeDto dto) {
        Iznajmljivanje e = iznajmljivanjeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Iznajmljivanje nije pronađeno: " + id));

        if (dto.getPocetak() != null) e.setPocetak(dto.getPocetak());
        if (dto.getKraj() != null) e.setKraj(dto.getKraj());
        if (dto.getPlaceno() != null) e.setPlaceno(dto.getPlaceno());
        if (dto.getStatus() != null) e.setStatus(dto.getStatus());

        oslobodiOpreme(e);

        e.getStavke().clear();
        if (dto.getStavke() != null) {
            for (StavkaIznajmljivanjaDto sDto : dto.getStavke()) {
                Oprema oprema = opremaRepository.findById(sDto.getOpremaId())
                        .orElseThrow(() -> new ResourceNotFoundException("Oprema nije pronađena: " + sDto.getOpremaId()));
                var s = StavkaIznajmljivanjaMapper.toEntity(sDto, oprema);
                e.addStavka(s);
            }
        }

        e.preracunajUkupno();
        rezervisiOpreme(e);

        return IznajmljivanjeMapper.toDto(iznajmljivanjeRepository.save(e));
    }

    @Override
    public void delete(Long id) {
        iznajmljivanjeRepository.deleteById(id);
    }

    @Override
    public IznajmljivanjeDto zavrsi(Long id) {
        Iznajmljivanje e = iznajmljivanjeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Iznajmljivanje nije pronađeno: " + id));

        e.setKraj(LocalDateTime.now());
        e.setStatus(Status.ZAVRSENO);
        e.preracunajUkupno();
        oslobodiOpreme(e);

        if (e.getStavke() != null) {
            for (StavkaIznajmljivanja s : e.getStavke()) {
                long minuti = Duration.between(e.getPocetak(), e.getKraj()).toMinutes();
                double sati = minuti / 60.0;
                s.setUkupnoVreme(Math.round(sati * 100.0) / 100.0);
            }
        }

        return IznajmljivanjeMapper.toDto(iznajmljivanjeRepository.save(e));
    }

    @Override
    public IznajmljivanjeDto upsertStavke(Long iznajmljivanjeId, List<StavkaIznajmljivanjaDto> stavke) {
        Iznajmljivanje e = iznajmljivanjeRepository.findById(iznajmljivanjeId)
                .orElseThrow(() -> new ResourceNotFoundException("Iznajmljivanje nije pronađeno: " + iznajmljivanjeId));

        e.getStavke().clear();

        if (stavke != null) {
            for (StavkaIznajmljivanjaDto sDto : stavke) {
                Oprema oprema = opremaRepository.findById(sDto.getOpremaId())
                        .orElseThrow(() -> new ResourceNotFoundException("Oprema nije pronađena: " + sDto.getOpremaId()));
                var s = StavkaIznajmljivanjaMapper.toEntity(sDto, oprema);
                e.addStavka(s);
            }
        }
        e.preracunajUkupno();
        return IznajmljivanjeMapper.toDto(iznajmljivanjeRepository.save(e));
    }

    private void rezervisiOpreme(Iznajmljivanje iznajmljivanje) {
        for (StavkaIznajmljivanja s : iznajmljivanje.getStavke()) {
            Oprema oprema = opremaRepository.findById(s.getOprema().getId()).orElseThrow();
            if (oprema.getZalihe() < s.getKolicina()) {
                throw new RuntimeException("Nema dovoljno zaliha za " + oprema.getNaziv());
            }
            oprema.setZalihe(oprema.getZalihe() - s.getKolicina());
            if (oprema.getZalihe() == 0) {
                oprema.setStanje(Stanje.ZAUZETA);
            }
            opremaRepository.save(oprema);
        }
    }

    private void oslobodiOpreme(Iznajmljivanje iznajmljivanje) {
        for (StavkaIznajmljivanja s : iznajmljivanje.getStavke()) {
            Oprema oprema = opremaRepository.findById(s.getOprema().getId()).orElseThrow();
            oprema.setZalihe(oprema.getZalihe() + s.getKolicina());
            if (oprema.getZalihe() > 0 && oprema.getStanje() != Stanje.SERVIS) {
                oprema.setStanje(Stanje.SLOBODNA);
            }
            opremaRepository.save(oprema);
        }
    }


    @Override
    public IznajmljivanjeDto plati(Long id) {
        Iznajmljivanje iz = iznajmljivanjeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Nije pronađeno iznajmljivanje."));

        iz.getStavke().size();

        iz.setPlaceno(true);

        Iznajmljivanje sacuvano = iznajmljivanjeRepository.save(iz);

        return IznajmljivanjeMapper.toDto(sacuvano);
    }


}