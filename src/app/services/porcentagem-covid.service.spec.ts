import { TestBed } from '@angular/core/testing';

import { PorcentagemCovidService } from './porcentagem-covid.service';

describe('PorcentagemCovidService', () => {
  let service: PorcentagemCovidService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PorcentagemCovidService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
