export type UserListRow = {
  id: number;
  email: string;
  isActive: boolean;
  createdAt: string;
  role: { name: string };
};

export type UserDetail = {
  id: number;
  email: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  role: {
    id: number;
    name: string;
    description: string | null;
    createdAt: string;
    updatedAt: string;
  };
};
