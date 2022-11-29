import { OutboxMetadata } from '../../document-box-metadata/entities';

export interface SentDocumentBoxes {
  documentIds: string[];
  recipientIds: string[];
  outboxMetadataId: string;
}

export interface SentDocumentBox {
  discriminator: 'SentDocumentBox';
  documentIds: string[];
  recipientIds: string[];
  outboxMetadata: OutboxMetadata;
}

export function IsInstanceOfSentDocumentBoxes(
  arg: any,
): arg is SentDocumentBoxes {
  return 'recipientIds' in arg;
}
