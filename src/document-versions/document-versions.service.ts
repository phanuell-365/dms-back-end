import { Inject, Injectable } from '@nestjs/common';
import { CreateDocumentVersionDto, UpdateDocumentVersionDto } from './dto';
import { CreateDocumentDto } from '../documents/dto';
import { DocumentFilesService } from '../document-files/document-files.service';
import { DOCUMENT_VERSIONS_REPOSITORY } from './const';
import { DocumentVersion } from './entities';

@Injectable()
export class DocumentVersionsService {
  constructor(
    public readonly documentFileService: DocumentFilesService,
    @Inject(DOCUMENT_VERSIONS_REPOSITORY)
    private readonly documentVersionRepository: typeof DocumentVersion,
  ) {}

  async createNewVersion(
    createDocumentDto: CreateDocumentDto,
    file: Express.Multer.File,
  ) {
    const documentFile = await this.documentFileService.uploadDocument(
      createDocumentDto,
      file,
    );

    const createDocumentVersionDto: CreateDocumentVersionDto = {
      purposeChange: createDocumentDto.purposeChange,
      versionNumber: createDocumentDto.versionNumber,
      DocumentFileId: documentFile.id,
      versioningDate: new Date(),
    };

    return await this.documentVersionRepository.create({
      ...createDocumentVersionDto,
    });
  }

  findAll() {
    return `This action returns all documentVersions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} documentVersion`;
  }

  update(id: number, updateDocumentVersionDto: UpdateDocumentVersionDto) {
    return `This action updates a #${id} documentVersion`;
  }

  remove(id: number) {
    return `This action removes a #${id} documentVersion`;
  }
}
