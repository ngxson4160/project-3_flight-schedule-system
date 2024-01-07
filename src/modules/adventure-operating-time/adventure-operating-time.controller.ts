import { Controller, Get } from '@nestjs/common';
import { AdventureOperatingTimeService } from './adventure-operating-time.service';

@Controller('helicopter')
export class AdventureOperatingTimeController {
  constructor(
    private readonly adventureOperatingTimeService: AdventureOperatingTimeService,
  ) {}
}
