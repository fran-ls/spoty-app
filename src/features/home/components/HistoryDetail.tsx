import { useState } from "react";
import Loader from "../../../shared/components/Loader";
import type { THistoryItem } from "../../player/playHistory.types";
import HistoryItem from "./HistoryItem";
import { paginationMeta } from "../../../shared/data/search.data";
import { useInfiniteScroll } from "../../../shared/hooks/useInfiniteScroll";
import playHistoryService from "../../player/services/playHistory.service";
import useAuth from "../../auth/hooks/useAuth";

interface HistoryDetailProps {
  item: THistoryItem | null;
  onSetItem?: (item: THistoryItem | null) => void;
}

const HistoryDetail = ({ item, onSetItem }: HistoryDetailProps) => {
  const { user } = useAuth();

  const [allItems, setAllItems] = useState(item?.items || []);
  const [meta, setMeta] = useState(paginationMeta);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);

  const { loaderRef } = useInfiniteScroll(async () => {
    if (page > meta.totalPages) return;
    const nextPage = page + 1;
    await getItems(nextPage);
    setPage(nextPage);
  });

  const getItems = async (page = 2) => {
    if (!user?.id || loading) return;

    setLoading(true);
    const { data } = await playHistoryService.searchHistory(user.id, { page });
    setLoading(false);
    if (!data) return;

    setMeta(data.meta);
    setAllItems([...allItems, ...data.items])
  }

  return (
    <div className={`text-[#adaaaa] bg-[#131313] w-full h-[calc(100vh-64px-88px)] overflow-hidden absolute left-0 z-5 ${item ? 'top-0' : '-top-full'}`}>
      <div className="w-full h-full overflow-auto relative">
        <div className={`mx-auto max-w-3xl md:px-8 px-2 py-8 space-y-8 transition-transform absolute top-0 left-1/2 -translate-x-1/2 w-full ${item ? 'translate-y-0' : 'translate-y-full'}`}>
          <HistoryItem
            item={item}
            isDetail={true}
            onSetItem={onSetItem}
          />

          {meta.hasNextPage && !loading &&
            <div
              className="flex items-center justify-center"
              ref={loaderRef}
            >
              <Loader size={24} stroke={2} />
            </div>
          }
        </div>
      </div>
    </div>
  )
}

export default HistoryDetail;