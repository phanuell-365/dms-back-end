import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DocumentFilesService } from './document-files.service';
import { CreateDocumentFileDto } from './dto/create-document-file.dto';
import { UpdateDocumentFileDto } from './dto/update-document-file.dto';

@Controller('document-files')
export class DocumentFilesController {
  constructor(private readonly documentFilesService: DocumentFilesService) {}

  @Post()
  create(@Body() createDocumentFileDto: CreateDocumentFileDto) {
    return this.documentFilesService.create(createDocumentFileDto);
  }

  @Get()
  findAll() {
    return this.documentFilesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.documentFilesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDocumentFileDto: UpdateDocumentFileDto) {
    return this.documentFilesService.update(+id, updateDocumentFileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.documentFilesService.remove(+id);
  }
}
