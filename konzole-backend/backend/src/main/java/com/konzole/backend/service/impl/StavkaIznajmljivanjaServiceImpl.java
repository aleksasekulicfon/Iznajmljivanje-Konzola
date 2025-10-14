package com.konzole.backend.service.impl;

import com.konzole.backend.dto.StavkaIznajmljivanjaDto;
import com.konzole.backend.entity.Iznajmljivanje;
import com.konzole.backend.entity.Oprema;
import com.konzole.backend.entity.StavkaIznajmljivanja;
import com.konzole.backend.exception.ResourceNotFoundException;
import com.konzole.backend.mapper.StavkaIznajmljivanjaMapper;
import com.konzole.backend.repository.IznajmljivanjeRepository;
import com.konzole.backend.repository.OpremaRepository;
import com.konzole.backend.repository.StavkaIznajmljivanjaRepository;
import com.konzole.backend.service.StavkaIznajmljivanjaService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class StavkaIznajmljivanjaServiceImpl implements StavkaIznajmljivanjaService {

    private final StavkaIznajmljivanjaRepository stavkaRepo;
    private final IznajmljivanjeRepository iznajmljivanjeRepo;
    private final OpremaRepository opremaRepo;

    @Override
    public StavkaIznajmljivanjaDto create(Long iznajmljivanjeId, StavkaIznajmljivanjaDto dto) {
        Iznajmljivanje iznajmljivanje = iznajmljivanjeRepo.findById(iznajmljivanjeId)
                .orElseThrow(() -> new ResourceNotFoundException("Iznajmljivanje nije pronađeno: " + iznajmljivanjeId));
        Oprema oprema = opremaRepo.findById(dto.getOpremaId())
                .orElseThrow(() -> new ResourceNotFoundException("Oprema nije pronađena: " + dto.getOpremaId()));

        StavkaIznajmljivanja s = StavkaIznajmljivanjaMapper.toEntity(dto, oprema);
        s.setIznajmljivanje(iznajmljivanje);

        StavkaIznajmljivanja saved = stavkaRepo.save(s);

        // osveži total iznajmljivanja
        iznajmljivanje.getStavke().add(saved);
        iznajmljivanje.preracunajUkupno();

        return StavkaIznajmljivanjaMapper.toDto(saved);
    }

    @Override
    public StavkaIznajmljivanjaDto update(Long iznajmljivanjeId, Long stavkaId, StavkaIznajmljivanjaDto dto) {
        Iznajmljivanje iznajmljivanje = iznajmljivanjeRepo.findById(iznajmljivanjeId)
                .orElseThrow(() -> new ResourceNotFoundException("Iznajmljivanje nije pronađeno: " + iznajmljivanjeId));

        StavkaIznajmljivanja s = stavkaRepo.findById(stavkaId)
                .orElseThrow(() -> new ResourceNotFoundException("Stavka nije pronađena: " + stavkaId));

        if (!s.getIznajmljivanje().getId().equals(iznajmljivanjeId)) {
            throw new ResourceNotFoundException("Stavka ne pripada datom iznajmljivanju");
        }

        s.setRb(dto.getRb());
        s.setCena(dto.getCena());
        s.setKolicina(dto.getKolicina());
        s.setUkupnoVreme(dto.getUkupnoVreme());

        if (dto.getOpremaId() != null && (s.getOprema() == null || !s.getOprema().getId().equals(dto.getOpremaId()))) {
            Oprema oprema = opremaRepo.findById(dto.getOpremaId())
                    .orElseThrow(() -> new ResourceNotFoundException("Oprema nije pronađena: " + dto.getOpremaId()));
            s.setOprema(oprema);
        }

        StavkaIznajmljivanja saved = stavkaRepo.save(s);

        iznajmljivanje.preracunajUkupno(); // preracunaj ukupno

        return StavkaIznajmljivanjaMapper.toDto(saved);
    }

    @Override
    public void delete(Long iznajmljivanjeId, Long stavkaId) {
        Iznajmljivanje iznajmljivanje = iznajmljivanjeRepo.findById(iznajmljivanjeId)
                .orElseThrow(() -> new ResourceNotFoundException("Iznajmljivanje nije pronađeno: " + iznajmljivanjeId));

        StavkaIznajmljivanja s = stavkaRepo.findById(stavkaId)
                .orElseThrow(() -> new ResourceNotFoundException("Stavka nije pronađena: " + stavkaId));

        if (!s.getIznajmljivanje().getId().equals(iznajmljivanjeId)) {
            throw new ResourceNotFoundException("Stavka ne pripada datom iznajmljivanju");
        }

        stavkaRepo.delete(s);
        iznajmljivanje.getStavke().removeIf(x -> x.getId().equals(stavkaId));
        iznajmljivanje.preracunajUkupno();
    }

    @Override
    @Transactional(readOnly = true)
    public List<StavkaIznajmljivanjaDto> list(Long iznajmljivanjeId) {
        return stavkaRepo.findByIznajmljivanjeId(iznajmljivanjeId).stream()
                .map(StavkaIznajmljivanjaMapper::toDto)
                .toList();
    }
}