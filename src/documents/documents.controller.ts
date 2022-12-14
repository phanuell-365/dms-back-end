import {
  Body,
  Controller,
  Delete,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto, UpdateDocumentDto } from './dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentsInterceptor } from './documents.interceptor';
import * as multer from 'multer';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { DOCUMENT_FILE_MAX_SIZE } from './const';
import { UpdateDocumentVersionDto } from '../document-versions/dto';
import { ParseDocumentVersionPipePipe } from '../document-versions/pipes/parse-document-version-pipe.pipe';
import { VersionStatus } from '../document-versions/enum/version-status';
import { UpdateDocumentMetadataDto } from '../document-metadata/dto';

@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('document', {
      storage: multer.diskStorage({
        destination: (req, file, cb) => {
          // construct the new file destination

          const newFileDestination = path.join(
            process.cwd(),
            'src/assets/uploads/',
          );
          cb(null, newFileDestination);
        },
        filename: (req, file, cb) => {
          // construct a new file name using the format

          const newFileName =
            uuidv4() + '.document.' + file.originalname.split('.').pop();

          cb(null, newFileName);
        },
      }),
    }),
    DocumentsInterceptor,
  )
  create(
    @Body() createDocumentDto: CreateDocumentDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: DOCUMENT_FILE_MAX_SIZE,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.documentsService.create(createDocumentDto, file);
  }

  @Get()
  findAll() {
    return this.documentsService.findAll();
  }

  // controller methods for document metadata
  @Get('metadata')
  findAllDocumentMetadata() {
    console.error('findAllDocumentMetadata');
    return this.documentsService.findAllDocumentMetadata();
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.documentsService.findOne(id);
  }

  @Get(':id/metadata')
  findDocumentMetadata(@Param('id', new ParseUUIDPipe()) id: string) {
    console.error('findAllDocumentMetadata');
    return this.documentsService.findDocumentMetadata(id);
  }

  @Patch(':id/metadata')
  updateDocumentMetadata(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateDocumentMetadataDto: UpdateDocumentMetadataDto,
  ) {
    return this.documentsService.updateDocumentMetadata(
      id,
      updateDocumentMetadataDto,
    );
  }

  // controllers for document versions

  @Get('versions/search')
  findAllCurrentVersions() {
    return this.documentsService.findAllCurrentVersions();
  }

  // Path: src/documents/documents.service.ts

  @Get(':id/versions')
  getDocumentVersions(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.documentsService.getDocumentVersions(id);
  }

  @Get(':id/versions/search')
  getCurrentDocumentVersion(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Query('status', new ParseDocumentVersionPipePipe()) status: string,
  ) {
    return this.documentsService.getCurrentDocumentVersion(
      id,
      status as VersionStatus,
    );
  }

  @Post(':id/versions')
  @UseInterceptors(
    FileInterceptor('document', {
      storage: multer.diskStorage({
        destination: (req, file, cb) => {
          // construct the new file destination

          const newFileDestination = path.join(
            process.cwd(),
            'src/assets/uploads/',
          );
          cb(null, newFileDestination);
        },
        filename: (req, file, cb) => {
          // construct a new file name using the format

          const newFileName =
            uuidv4() + '.document.' + file.originalname.split('.').pop();

          cb(null, newFileName);
        },
      }),
    }),
    DocumentsInterceptor,
  )
  uploadNewDocumentVersion(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateDocumentVersionDto: UpdateDocumentVersionDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: DOCUMENT_FILE_MAX_SIZE,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.documentsService.uploadNewDocumentVersion(
      id,
      updateDocumentVersionDto,
      file,
    );
  }

  // controllers for documents

  @Patch(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateDocumentDto: UpdateDocumentDto,
  ) {
    return this.documentsService.update(+id, updateDocumentDto);
  }

  @Delete(':id')
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.documentsService.remove(+id);
  }
}
