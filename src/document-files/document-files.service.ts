import { Inject, Injectable } from '@nestjs/common';
// import { CreateDocumentFileDto } from './dto/create-document-file.dto';
import { CreateDocumentFileDto, UpdateDocumentFileDto } from './dto';
import { CreateDocumentDto } from '../documents/dto';
import { DOCUMENT_FILE_REPOSITORY } from './const';
import { DocumentFile } from './entities';

@Injectable()
export class DocumentFilesService {
  constructor(
    @Inject(DOCUMENT_FILE_REPOSITORY)
    public readonly documentFileRepository: typeof DocumentFile,
  ) {}

  async getDocument(options: { documentFileId?: string }) {
    let documentFile: DocumentFile;

    if (options.documentFileId) {
      documentFile = await this.documentFileRepository.findByPk(
        options.documentFileId,
      );

      if (!documentFile) {
        return false;
      }
    } else return false;

    return documentFile;
  }

  async uploadDocument(
    createDocumentDto: CreateDocumentDto,
    file: Express.Multer.File,
  ) {
    const createDocumentFileDto: CreateDocumentFileDto = {
      mimetype: file.mimetype,
      originalFilename: file.originalname,
      newFilename: file.filename,
      size: file.size,
    };

    return await this.documentFileRepository.create({
      ...createDocumentFileDto,
    });
  }

  findAll() {
    return `This action returns all documentFiles`;
  }

  findOne(id: number) {
    return `This action returns a #${id} documentFile`;
  }

  update(id: number, updateDocumentFileDto: UpdateDocumentFileDto) {
    return `This action updates a #${id} documentFile`;
  }

  remove(id: number) {
    return `This action removes a #${id} documentFile`;
  }
}
