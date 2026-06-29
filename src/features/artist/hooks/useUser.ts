import { useState } from "react";
import type { User } from "../../auth/auth.types";
import type { SearchMeta, SearchResponse } from "../../../shared/types/common.types";
import { api, apiFetch } from "../../../shared/utils/api";
import { tokenService } from "../../auth/services/token.service";

const useUser = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [userMeta, setUserMeta] = useState<SearchMeta>({
    page: 0,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false
  });

  async function searchUsers(filters?: Record<string, any>) {
    const page = filters?.page ?? 0;

    const params: Record<string, any> = {}

    for (const f in filters) {
      const v = filters[f];
      if (v) params[f] = v;
    }

    const { data } = await apiFetch<SearchResponse<User[]>>(() => (
      api.get(`/users/search`, {
        params: filters ? params : undefined,
        headers: {
          'Authorization': `Bearer ${tokenService.getToken()}`
        }
      })
    ));
    if (!data) return;

    setUserMeta(data.meta);

    if (page > 1) {
      setUsers((prev) => [...prev, ...data.items]);
      return;
    }

    setUsers(data.items);
  }

  return {
    userMeta, setUserMeta,
    users, setUsers,
    searchUsers
  }
}

export default useUser;