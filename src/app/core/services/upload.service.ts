import { Injectable } from '@angular/core';
import { environment } from "../../../../environments/environment";
import * as tus from 'tus-js-client';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
   uploadFile(file: File, onProgress?: (bytesUploaded: number, bytesTotal: number) => void) {
    return new Promise<string>((resolve, reject) => {
      const upload = new tus.Upload(file, {
        endpoint: `${environment.apiUrl}/files`,
        retryDelays: [0, 1000, 3000, 5000],
        metadata: {
          filename: file.name,
          filetype: file.type,
        },
        onError(error) {
          console.error('Upload failed:', error);
          reject(error);
        },
        onProgress(bytesUploaded, bytesTotal) {
          const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
          console.log(`Uploaded ${bytesUploaded} of ${bytesTotal} bytes (${percentage}%)`);
          if (onProgress) onProgress(bytesUploaded, bytesTotal);
        },
        onSuccess() {
          console.log('Upload finished:', upload.url);
          resolve(upload.url ?? ''); // The upload URL acts as file identifier
        },
      });

      upload.start();
    });
  }
} 