export const enum UPLOAD_STATUS {
 UPLOADING = 'UPLOADING',
 DONE = 'DONE',
 ERROR = 'ERROR'
}

export interface UploadFile {
  id: number;
  name: string;
  size: number;
  file: File;
  status: UPLOAD_STATUS;
  progress: number;
}
