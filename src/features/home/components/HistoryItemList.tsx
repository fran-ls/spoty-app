import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  data: THistoryItem;
}

const HistoryItemList = ({ expanded, userId, data }: HistoryItemListProps) => {
  const { createdAt, items } = data;

  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [dayHistory, setDayHistory] = useState(items);
  const [meta, setMeta] = useState(data.meta ? data.meta : paginationMeta);

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
        {dayHistory.map((h, i) => {
          const playlist = h.playlist;
          const coverImages = playlist?.coverImages || [];
          const cover = playlist ? playlistService.playlistCover(playlist.id, playlist.cover) : null;
          const redirectTo = h.playlistId ? `${routes.playlists}/${h.playlistId}` : `${routes.tracks}/${h.songId}`;
          const isCoverImgs = !cover && coverImages && coverImages.length > 3;

          return (
            <li
              className="cursor-pointer hover:bg-[#262626] rounded-md p-3 w-full flex items-center justify-between gap-3"
              onClick={() => navigate(redirectTo)}
              key={`${h.id}-${i}`}
            >
              <div className="overflow-hidden flex items-center gap-3">
                <div
                  className="min-w-12 w-12 h-12 rounded overflow-hidden relative"
                  style={{
                    boxShadow: '0 4px 60px rgba(0, 0, 0, .5)'
                  }}
                >
                  {h.song?.cover ? (
                    <SmartImage
                      url={h.song.cover}
                      styles={{
                        imgWrap: 'w-full h-full',
                        icon: 'w-[40%] h-[40%]'
                      }}
                    />
                  ) : (
                    <>
                      <SmartImage
                        url={cover || playlist?.coverImages?.[0]?.url || ''}
                        styles={{
                          imgWrap: 'w-full h-full',
                          icon: 'w-[40%] h-[40%]'
                        }}
                      />

                      {isCoverImgs && <PlaylistCoverImgs images={coverImages} />}
                    </>
                  )}
                </div>

                <div className="flex flex-col justify-center gap-1 overflow-hidden">
                  <Link
                    className="text-white hover:underline"
                    onClick={(e) => e.stopPropagation()}
                    to={redirectTo}
                  >
                    <p
                      className="text-sm font-medium line-clamp-2"
                      style={{
                        lineHeight: 1.25
                      }}
                    >
                      {h.song?.title || h.playlist?.name}
                    </p>
                  </Link>

                  {h.song?.artist && (
                    <Link
                      className="hover:underline overflow-hidden"
                      onClick={(e) => e.stopPropagation()}
                      to={`${routes.artists}/${h.song?.artistId || ''}`}
                    >
                      <span className="block text-xs truncate">
                        {h.song.artist.name}
                      </span>
                    </Link>
                  )}

                  {h.playlist && (
                    <span className="text-xs">
                      Lista
                    </span>
                  )}
                </div>
              </div>
            </li>
          )
        })}

        {(meta.hasNextPage && !loading) && (
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