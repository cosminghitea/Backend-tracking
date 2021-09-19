export interface ITaskObject {
  name: string;
  description: string;
  dueDate: Date;
  tags: string[];
  status?: string;
  id?: number;
}

export interface ITaskGetObject {
  sortBy?: string;
  sortByOrder?: string;
  statusFilterBy?: string;
  page: number;
}

export interface ITaskOptionObject {
  where?: {
    status: string;
  };
  order?: string[][];
  limit: number;
  offset: number;
}
