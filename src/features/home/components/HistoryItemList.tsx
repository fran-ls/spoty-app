import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { THistoryItem } from "../../player/playHistory.types";
import SmartImage from "../../../shared/components/SmartImage";
import PlaylistCoverImgs from "../../playlist/components/PlaylistCoverImgs";
import playlistService from "../../playlist/services/playlist.service";
import Loader from "../../../shared/components/Loader";
import playHistoryService from "../../player/services/playHistory.service";
import { useInfiniteScroll } from "../../../shared/hooks/useInfiniteScroll";
import { paginationMeta } from "../../../shared/data/search.data";
import { routes } from "../../../shared/utils/routes";

interface HistoryItemListProps {
  expanded: boolean;
  userId: string;
  item: THistoryItem;
}

const HistoryItemList = ({ expanded, userId, item }: HistoryItemListProps) => {
  const { createdAt, items } = item;

  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [dayHistory, setDayHistory] = useState(items);
  const [meta, setMeta] = useState(item.meta ? item.meta : paginationMeta);

  const contentRef = useRef<any>(null);

  const navigate = useNavigate();

  const filters = {
    userId,
    createdAt,
    page,
    limit: meta.limit || 10
  }

  const { loaderRef } = useInfiniteScroll(async () => {
    if (page < meta.totalPages) {
      const nextPage = page + 1;
      await loadMoreHistory(nextPage);
      setPage(nextPage);
    }
  });

  async function loadMoreHistory(page = 1) {
    if (!userId || loading) return;
    setLoading(true);

    const { data } = await playHistoryService.searchHistory(userId, {
      pagination: meta ? false : page < 2,
      ...filters,
      page
    } as any);

    setLoading(false);
    if (!data) return;

    data.meta ? setMeta(data.meta) : setMeta({
      ...meta,
      page,
      hasNextPage: page < meta.totalPages
    });

    (page > 1) ? setDayHistory([...dayHistory, ...data.items]) : setDayHistory(data.items);
  }

  return (
    <div
      className="transition-all duration-300 overflow-hidden"
      style={{
        height: expanded ? contentRef.current?.offsetHeight : 0,
        minHeight: expanded ? 72 * dayHistory.length + (meta.hasNextPage ? 32 : 0) : 0
      }}
    >
      <ul
        className="ml-3"
        ref={contentRef}
      >
        {dayHistory.map((h) => {
          const playlist = h.playlist;
          const cover = playlist ? playlistService.playlistCover(playlist.id, playlist.cover) : null;
          const isCoverImgs = !cover && playlist?.coverImages && playlist.coverImages.length > 3;

          return (
            <li
              className="cursor-pointer hover:bg-[#262626] rounded-md p-3 w-full flex items-center justify-between gap-3"
              onClick={() => {
                if (h.playlistId) {
                  navigate(`${routes.playlists}/${h.playlistId}`);
                  return;
                }
                else if (h.songId) {
                  navigate(`${routes.tracks}/${h.songId}`);
                }
              }}
              key={h.id}
            >
              <div className="flex items-center gap-3">
                <div
                  className="min-w-12 w-12 h-12 rounded overflow-hidden relative"
                  style={{
                    boxShadow: '0 4px 60px rgba(0, 0, 0, .5)'
                  }}
                >
                  {h.song?.cover ?
                    <SmartImage
                      crossOrigin="anonymous"
                      referrerPolicy="no-referrer"
                      url={h.song.cover}
                      styles={{
                        imgWrap: 'w-full h-full',
                        icon: 'w-[40%] h-[40%]'
                      }}
                    />
                    :
                    <>
                      <SmartImage
                        url={cover}
                        styles={{
                          imgWrap: 'w-full h-full',
                          icon: 'w-[40%] h-[40%]'
                        }}
                      />

                      {isCoverImgs && (
                        <PlaylistCoverImgs images={playlist.coverImages || []} />
                      )}
                    </>
                  }
                </div>

                <div className="w-full">
                  <p className="text-white text-[15px] font-semibold">
                    {h.song?.title || h.playlist?.name}
                  </p>

                  {h.song?.artist && (
                    <span className="text-[13px]">
                      {h.song.artist.name}
                    </span>
                  )}

                  {h.playlist && (
                    <span className="text-sm">
                      Lista
                    </span>
                  )}
                </div>
              </div>
            </li>
          )
        })}

        {meta.hasNextPage && (
          <li className="py-1">
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
          </li>
        )}
      </ul>
    </div>
  )
}

export default HistoryItemList;