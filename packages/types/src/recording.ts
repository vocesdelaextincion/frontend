import { Tag } from "./tag";

export interface Recording {
  id: string;
  title: string;
  description: string | null;
  fileUrl: string;
  fileKey: string;
  metadata: any;
  isFree: boolean;
  tags: Tag[];
  createdAt: Date;
  updatedAt: Date;
}
