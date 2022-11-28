import { DOCUMENT_OUTBOXES_REPOSITORY } from './const';
import { DocumentBox } from './entities';

export const documentBoxesProvider = [
  {
    provide: DOCUMENT_OUTBOXES_REPOSITORY,
    useValue: DocumentBox,
  },
];
