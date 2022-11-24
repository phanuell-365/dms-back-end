import { Injectable } from '@nestjs/common';
import { CreateDocumentFileDto } from './dto/create-document-file.dto';
import { UpdateDocumentFileDto } from './dto/update-document-file.dto';

@Injectable()
export class DocumentFilesService {
  create(createDocumentFileDto: CreateDocumentFileDto) {
    return 'This action adds a new documentFile';
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
