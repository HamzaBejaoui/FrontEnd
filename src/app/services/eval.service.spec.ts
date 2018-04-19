import { TestBed, inject } from '@angular/core/testing';

import { EvalService } from './eval.service';

describe('EvalService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EvalService]
    });
  });

  it('should be created', inject([EvalService], (service: EvalService) => {
    expect(service).toBeTruthy();
  }));
});
