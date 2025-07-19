import { Tag } from "./tag";

export interface Recording {
  id: string;
  title: string;
  description: string | null;
  fileUrl: string;
  fileKey: string;
  metadata: any;
  tags: Tag[];
  createdAt: Date;
  updatedAt: Date;
}
