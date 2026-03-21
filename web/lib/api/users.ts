import api from '@/lib/api/axios';
import type { PaginationResponse } from '@/lib/types/pagination';
import type { UserDetail, UserListRow } from '@/lib/types/users';

export async function fetchUsersPage(
  page: number,
  limit: number,
): Promise<PaginationResponse<UserListRow>> {
  const { data } = await api.get<PaginationResponse<UserListRow>>('/users', {
    params: {
      page,
      limit,
      sortBy: 'createdAt',
      order: 'desc',
    },
  });
  return data;
}

export async function fetchUserById(id: number): Promise<UserDetail> {
  const { data } = await api.get<UserDetail>(`/users/${id}`);
  return data;
}
