import { Controller, Get, Post, Body, Param, Query, Put, Delete } from '@nestjs/common';
import { ChequeEntriesService } from './cheque-entries.service';
import { CreateChequeEntryDto } from './dto/create-cheque-entry.dto';

@Controller('cheque-entries')
export class ChequeEntriesController {
  constructor(private readonly chequeEntriesService: ChequeEntriesService) {}

  @Post()
  create(@Body() createChequeEntryDto: CreateChequeEntryDto) {
    return this.chequeEntriesService.create(createChequeEntryDto);
  }

  @Get()
  findAll(@Query() query: any) {
    return this.chequeEntriesService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.chequeEntriesService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateData: any) {
    return this.chequeEntriesService.update(+id, updateData);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chequeEntriesService.remove(+id);
  }
}
