interface BuilderIoResponse {
  status: number;
  message: string;
  url: string;
}

interface BuilderIoParams {
  name: string;
  altText: string;
  folder?: string;
  file: File;
}
