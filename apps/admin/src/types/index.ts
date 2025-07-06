export interface Tag {
  id: string;
  name: string;
  createdAt: string;
}

export interface Recording {
  id: string;
  name: string;
  url: string;
  tags: Tag[];
  createdAt: string;
}
