import { Injectable } from '@nestjs/common';
import { CreateDocumentSentboxDto } from './dto/create-document-sentbox.dto';
import { UpdateDocumentSentboxDto } from './dto/update-document-sentbox.dto';

@Injectable()
export class DocumentSentboxesService {
  create(createDocumentSentboxDto: CreateDocumentSentboxDto) {
    return 'This action adds a new documentSentbox';
  }

  findAll() {
    return `This action returns all documentSentboxes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} documentSentbox`;
  }

  update(id: number, updateDocumentSentboxDto: UpdateDocumentSentboxDto) {
    return `This action updates a #${id} documentSentbox`;
  }

  remove(id: number) {
    return `This action removes a #${id} documentSentbox`;
  }
}
