import { OutboxMetadata } from '../../document-box-metadata/entities';

export interface ReceivedDocumentBoxes {
  documentIds: string[];
  senderIds: string[];
  outboxMetadataId: string;
}

export interface ReceivedDocumentBox {
  discriminator: 'ReceivedDocumentBox';
  documentIds: string[];
  senderIds: string[];
  outboxMetadata: OutboxMetadata;
}

export function IsInstanceOfReceivedDocumentBoxes(
  arg: any,
): arg is ReceivedDocumentBoxes {
  return 'senderIds' in arg;
}
