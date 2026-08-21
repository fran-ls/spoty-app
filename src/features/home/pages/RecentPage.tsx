import { useEffect, useMemo, useState } from "react";
import type { THistory, THistoryItem } from "../../player/playHistory.types";
import useAuth from "../../auth/hooks/useAuth";
import playHistoryService from "../../player/services/playHistory.service";
import { useInfiniteScroll } from "../../../shared/hooks/useInfiniteScroll";
import { paginationMeta } from "../../../shared/data/search.data";
import Loader from "../../../shared/components/Loader";
import HistoryItem from "../components/HistoryItem";
import HistoryDetail from "../components/HistoryDetail";

const RecentPage = () => {
  const { user } = useAuth();

  const [playHistory, setPlayHistory] = useState<THistory>({});

  const [meta, setMeta] = useState(paginationMeta);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);

  const [activeItem, setActiveItem] = useState<THistoryItem | null>(null);

  const historyList = useMemo(() => (Object.values(playHistory)), [playHistory]);

  const { loaderRef } = useInfiniteScroll(async () => {
    if (page > meta.totalPages) return;
    const nextPage = page + 1;
    await getPlayHistory(nextPage);
    setPage(nextPage);
  });

  async function getPlayHistory(page = 1) {
    if (!user?.id || loading) return;

    setLoading(true);
    const { data } = await playHistoryService.getHistory(user.id, { page });
    setLoading(false);
    if (!data) return;

    setMeta(data.meta);

    (page < 2) ? setPlayHistory(data.items) : setPlayHistory((prev) => ({
      ...prev,
      ...data.items
    }));
  }

  useEffect(() => { getPlayHistory() }, []);

  return (
    <div className="overflow-hidden w-full h-full text-[#adaaaa] relative">
      <div className="overflow-auto max-h-[calc(100vh-64px-88px)] md:px-8 px-2 py-8">
        <h1 className="pl-2 mx-auto max-w-3xl md:text-3xl text-2xl font-bold text-white">
          Recientes
        </h1>

        <div className="max-w-3xl mx-auto mt-8 space-y-8">
          {historyList.map((item) => (
            <HistoryItem
              onSetItem={(it) => setActiveItem(it)}
              item={item}
              key={item.date}
            />
          ))}

          {meta.hasNextPage && !loading &&
            <div
              className="flex items-center justify-center"
              ref={loaderRef}
            >
              <Loader size={24} stroke={2} />
            </div>
          }
        </div>

        <HistoryDetail
          item={activeItem}
          onSetItem={() => setActiveItem(null)}
        />
      </div>
    </div>
  )
}

export default RecentPage;