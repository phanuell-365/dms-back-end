import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import * as path from 'path';
import * as fs from 'fs';
import { DOCUMENT_FILE_MAX_SIZE } from './const';

@Injectable()
export class DocumentsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    const uploadedFile = request.file as Express.Multer.File;

    if (uploadedFile) {
      if (uploadedFile.size > DOCUMENT_FILE_MAX_SIZE) {
        console.error(
          `Deleting mis-uploaded file ${uploadedFile.originalname} ...`,
        );

        fs.unlinkSync(
          path.join(
            process.cwd(),
            'src/assets/uploads/',
            uploadedFile.filename,
          ),
        );
      }
      return next.handle();
    }
    return next.handle();
  }
}
