import { Module } from '@nestjs/common';
import { ChequeEntriesService } from './cheque-entries.service';
import { ChequeEntriesController } from './cheque-entries.controller';

@Module({
  controllers: [ChequeEntriesController],
  providers: [ChequeEntriesService],
})
export class ChequeEntriesModule {}
