import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DocumentSentboxesService } from './document-sentboxes.service';
import { CreateDocumentSentboxDto } from './dto/create-document-sentbox.dto';
import { UpdateDocumentSentboxDto } from './dto/update-document-sentbox.dto';

@Controller('document-sentboxes')
export class DocumentSentboxesController {
  constructor(private readonly documentSentboxesService: DocumentSentboxesService) {}

  @Post()
  create(@Body() createDocumentSentboxDto: CreateDocumentSentboxDto) {
    return this.documentSentboxesService.create(createDocumentSentboxDto);
  }

  @Get()
  findAll() {
    return this.documentSentboxesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.documentSentboxesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDocumentSentboxDto: UpdateDocumentSentboxDto) {
    return this.documentSentboxesService.update(+id, updateDocumentSentboxDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.documentSentboxesService.remove(+id);
  }
}
