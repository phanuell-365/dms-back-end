import { DOCUMENT_REPOSITORY } from './const';
import { Document } from './entities';

export const documentProvider = [
  {
    provide: DOCUMENT_REPOSITORY,
    useValue: Document,
  },
];
