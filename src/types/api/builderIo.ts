// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface BuilderIoResponse {
  status: number;
  message: string;
  url: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface BuilderIoParams {
  name: string;
  altText: string;
  folder?: string;
  file: File;
}
