import { TestBed } from '@angular/core/testing';

import { BotaoMenuService } from './botao-menu.service';

describe('BotaoMenuService', () => {
  let service: BotaoMenuService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BotaoMenuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
