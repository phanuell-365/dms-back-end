import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { DocumentBoxesService } from './document-boxes.service';
import { CreateDocumentBoxDto, UpdateDocumentBoxDto } from './dto';
import { GetUser } from '../auth/decorator';
import { User } from '../users/entities';
import { JwtAuthGuard } from '../auth/guards';

@UseGuards(JwtAuthGuard)
@Controller('documents/outboxes')
export class DocumentBoxesController {
  constructor(private readonly documentOutboxesService: DocumentBoxesService) {}

  @Post()
  create(
    @Body() createDocumentOutboxDto: CreateDocumentBoxDto,
    @GetUser() user: User,
  ) {
    return this.documentOutboxesService.create(createDocumentOutboxDto, user);
  }

  @Get()
  findAll() {
    return this.documentOutboxesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.documentOutboxesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDocumentSentboxDto: UpdateDocumentBoxDto,
  ) {
    return this.documentOutboxesService.update(+id, updateDocumentSentboxDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.documentOutboxesService.remove(+id);
  }
}
