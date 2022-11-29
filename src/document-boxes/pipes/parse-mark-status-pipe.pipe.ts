import {
  ArgumentMetadata,
  Injectable,
  NotFoundException,
  PipeTransform,
} from '@nestjs/common';
import { MarkStatus } from '../../document-box-metadata/enum';

@Injectable()
export class ParseMarkStatusPipePipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    return this.transformMarkStatus(value);
  }

  async transformMarkStatus(markStatus: string) {
    const markStat = MarkStatus[markStatus.toUpperCase()];
    if (markStat) {
      return markStat;
    }
    throw new NotFoundException(
      `The mark status "${markStatus}" is not valid.`,
    );
  }
}
