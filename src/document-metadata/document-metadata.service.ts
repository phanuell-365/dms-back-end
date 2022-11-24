import { Injectable } from '@nestjs/common';
import { CreateDocumentMetadatumDto } from './dto/create-document-metadatum.dto';
import { UpdateDocumentMetadatumDto } from './dto/update-document-metadatum.dto';

@Injectable()
export class DocumentMetadataService {
  create(createDocumentMetadatumDto: CreateDocumentMetadatumDto) {
    return 'This action adds a new documentMetadatum';
  }

  findAll() {
    return `This action returns all documentMetadata`;
  }

  findOne(id: number) {
    return `This action returns a #${id} documentMetadatum`;
  }

  update(id: number, updateDocumentMetadatumDto: UpdateDocumentMetadatumDto) {
    return `This action updates a #${id} documentMetadatum`;
  }

  remove(id: number) {
    return `This action removes a #${id} documentMetadatum`;
  }
}
