import { DOCUMENT_OUTBOXES_REPOSITORY } from './const';
import { DocumentOutbox } from './entities';

export const documentBoxesProvider = [
  {
    provide: DOCUMENT_OUTBOXES_REPOSITORY,
    useValue: DocumentOutbox,
  },
];
