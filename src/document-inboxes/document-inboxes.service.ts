import { Injectable } from '@nestjs/common';
import { CreateDocumentInboxDto } from './dto/create-document-inbox.dto';
import { UpdateDocumentInboxDto } from './dto/update-document-inbox.dto';

@Injectable()
export class DocumentInboxesService {
  create(createDocumentInboxDto: CreateDocumentInboxDto) {
    return 'This action adds a new documentInbox';
  }

  findAll() {
    return `This action returns all documentInboxes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} documentInbox`;
  }

  update(id: number, updateDocumentInboxDto: UpdateDocumentInboxDto) {
    return `This action updates a #${id} documentInbox`;
  }

  remove(id: number) {
    return `This action removes a #${id} documentInbox`;
  }
}
