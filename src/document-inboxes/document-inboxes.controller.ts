import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DocumentInboxesService } from './document-inboxes.service';
import { CreateDocumentInboxDto } from './dto/create-document-inbox.dto';
import { UpdateDocumentInboxDto } from './dto/update-document-inbox.dto';

@Controller('document-inboxes')
export class DocumentInboxesController {
  constructor(private readonly documentInboxesService: DocumentInboxesService) {}

  @Post()
  create(@Body() createDocumentInboxDto: CreateDocumentInboxDto) {
    return this.documentInboxesService.create(createDocumentInboxDto);
  }

  @Get()
  findAll() {
    return this.documentInboxesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.documentInboxesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDocumentInboxDto: UpdateDocumentInboxDto) {
    return this.documentInboxesService.update(+id, updateDocumentInboxDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.documentInboxesService.remove(+id);
  }
}
