import { useEffect, useState } from "react";
import type { PlayHistory, THistoryItem } from "../../player/playHistory.types";
import useAuth from "../../auth/hooks/useAuth";
import playHistoryService from "../../player/services/playHistory.service";
import { useInfiniteScroll } from "../../../shared/hooks/useInfiniteScroll";
import { paginationMeta } from "../../../shared/data/search.data";
import Loader from "../../../shared/components/Loader";
import HistoryItem from "../components/HistoryItem";
import { CustomScrollbar } from "../../../shared/components/CustomScrollbar";
import { getDeviceType } from "../../../shared/utils/getDeviceType";

const RecentPage = () => {
  const { user } = useAuth();

  const [firstHistoryItem, setFirstHistoryItem] = useState<PlayHistory | null>(null);
  const [playHistory, setPlayHistory] = useState<THistoryItem[]>([]);
  const [meta, setMeta] = useState(paginationMeta);

  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const lastIndex = playHistory.length - 1;
  const hasMore = firstHistoryItem && lastIndex > 0 ? firstHistoryItem.createdAt !== playHistory[lastIndex]?.createdAt : false;
  const isDesktop = getDeviceType() === 'desktop';

  const { loaderRef } = useInfiniteScroll(async () => {
    if (!hasMore) return;
    await getPlayHistory(page);
    setPage(page + 1);
  });

  async function getPlayHistory(page = 1) {
    if (!user?.id || loading) return;

    setLoading(true);
    const { data } = await playHistoryService.getHistory(user.id, {
      page,
      pagination: false
    } as any);

    setLoading(false);
    if (!data) return;

    if (!meta && data.meta) setMeta(data.meta);

    (page < 2) ? setPlayHistory(data.items) : setPlayHistory([...playHistory, ...data.items]);

    if (firstHistoryItem) return;

    const r = await playHistoryService.searchHistory(user.id, {
      page: 1,
      limit: 1,
      order: 'asc',
      orderBy: 'playedAt',
      pagination: false
    } as any);

    setFirstHistoryItem(r.data?.items[0] || null);
  }

  useEffect(() => { getPlayHistory() }, []);

  return (
    <div className="overflow-hidden w-full h-full text-[#adaaaa] relative">
      <CustomScrollbar
        scrollbarMode="vertical"
        viewport={{
          className: "md:px-8 px-2 py-8 relative",
          style: {
            maxHeight: `calc(100dvh - 64px - 88px${!isDesktop ? ' - 20px' : ''})`
          }
        }}
      >
        <h1 className="pl-2 mx-auto max-w-3xl md:text-3xl text-2xl font-bold text-white">
          Recientes
        </h1>

        <div className="max-w-3xl mx-auto mt-12 space-y-8">
          {playHistory?.map((item) => (
            <HistoryItem
              data={item}
              userId={user?.id || ''}
              key={item.createdAt}
            />
          ))}

          {(hasMore && !loading) && (
            <div
              className="flex items-center justify-center"
              ref={loaderRef}
            >
              <Loader
                className="border-[#adaaaa5d] border-t-white"
                size={20}
                stroke={1}
              />
            </div>
          )}
        </div>
      </CustomScrollbar>
    </div>
  )
}

export default RecentPage;