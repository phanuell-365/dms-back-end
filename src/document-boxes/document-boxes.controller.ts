import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { DocumentBoxesService } from './document-boxes.service';
import { CreateDocumentBoxDto, UpdateDocumentBoxDto } from './dto';
import { GetUser } from '../auth/decorator';
import { User } from '../users/entities';
import { JwtAuthGuard } from '../auth/guards';
import { ParseMarkStatusPipePipe } from './pipes';
import { MarkStatus } from '../document-box-metadata/enum';
import { MarkAsReadDto } from './dto/mark-as-read.dto';

@UseGuards(JwtAuthGuard)
@Controller('documents/boxes')
export class DocumentBoxesController {
  constructor(private readonly documentBoxesService: DocumentBoxesService) {}

  @Post('send')
  create(
    @Body() createDocumentOutboxDto: CreateDocumentBoxDto,
    @GetUser() user: User,
  ) {
    return this.documentBoxesService.create(createDocumentOutboxDto, user);
  }

  @Get('sent/:documentMetadataId')
  findOneSentDocument(
    @Param('documentMetadataId') id: string,
    // @Query('reference', new ParseDocumentReferencePipePipe())
    // documentReference: DocumentReferences,
    @GetUser()
    user: User,
  ) {
    return this.documentBoxesService.findOneSentDocumentBoxByUser(id, user);
  }

  @Get('sent')
  findAllSentDocuments(
    // @Query('reference', new ParseDocumentReferencePipePipe())
    // reference: DocumentReferences,
    @GetUser()
    user: User,
  ) {
    return this.documentBoxesService.findAllSentDocumentBoxesByUser(user);
  }

  @Get('received/search')
  findAllReceivedReadOrUnreadDocuments(
    @Query('markStatus', new ParseMarkStatusPipePipe()) markStatus: MarkStatus,
    @GetUser() user: User,
  ) {
    return this.documentBoxesService.findAllReceivedReadOrUnreadDocuments(
      markStatus,
      user,
    );
  }

  @Get('received/:documentMetadataId')
  findOneReceivedDocument(
    @Param('documentMetadataId') id: string,
    // @Query('reference', new ParseDocumentReferencePipePipe())
    // documentReference: DocumentReferences,
    @GetUser()
    user: User,
  ) {
    return this.documentBoxesService.findOneReceivedDocumentBoxByUser(id, user);
  }

  @Get('received')
  findAllReceivedDocuments(
    // @Query('reference', new ParseDocumentReferencePipePipe())
    // reference: DocumentReferences,
    @GetUser()
    user: User,
  ) {
    return this.documentBoxesService.findAllReceivedDocumentBoxesByUser(user);
  }

  @Patch('received')
  markAsRead(@Body() markAsReadDto: MarkAsReadDto, @GetUser() user: User) {
    console.error({ markAsReadDto });
    return this.documentBoxesService.markAsRead(markAsReadDto, user);
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
    @Body() updateDocumentBoxDto: UpdateDocumentBoxDto,
  ) {
    return this.documentBoxesService.update(+id, updateDocumentBoxDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.documentBoxesService.remove(+id);
  }
}
