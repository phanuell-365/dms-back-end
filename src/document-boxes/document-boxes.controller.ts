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
@Controller('documents/boxes')
export class DocumentBoxesController {
  constructor(private readonly documentBoxesService: DocumentBoxesService) {}

  @Post('/send')
  create(
    @Body() createDocumentOutboxDto: CreateDocumentBoxDto,
    @GetUser() user: User,
  ) {
    return this.documentBoxesService.create(createDocumentOutboxDto, user);
  }

  @Get('sent')
  findAllSentDocuments(@GetUser() user: User) {
    return this.documentBoxesService.findAllSentDocumentsByUser(user);
  }

  @Get()
  findAll() {
    return this.documentBoxesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.documentBoxesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDocumentSentboxDto: UpdateDocumentBoxDto,
  ) {
    return this.documentBoxesService.update(+id, updateDocumentSentboxDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.documentBoxesService.remove(+id);
  }
}
