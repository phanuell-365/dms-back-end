import { DOCUMENT_OUTBOXES_REPOSITORY } from './const';
import { DocumentOutbox } from './entities';

export const documentOutboxesProvider = [
  {
    provide: DOCUMENT_OUTBOXES_REPOSITORY,
    useValue: DocumentOutbox,
  },
];
