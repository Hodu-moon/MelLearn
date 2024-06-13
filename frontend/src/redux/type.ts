/* 인기 가수  */
interface ArtistImg {
  avatar: {
    url: string;
    width: number | null;
    height: number | null;
  }[];
}

interface Artist {
  type: string;
  id: string;
  name: string;
  shareUrl: string;
  visuals: ArtistImg;
}
/* 인기 차트 */
interface Album {
  album_type: string;
  total_tracks: number;
  id: string;
  images: { url: string; height: number; width: number }[];
  name: string;
  type: string;
  uri: string;
  artists: Artist[];
}

interface Artist {
  id: string;
  images: { url: string; height: number; width: number }[];
  name: string;
  popularity: number;
  type: string;
  uri: string;
}

interface Track {
  album: Album;
  artists: Artist[];
  duration_ms: number;
  explicit: boolean;
  href: string;
  id: string;
  is_playable: boolean;
  name: string;
  popularity: number;
  preview_url: string;
  track_number: number;
  type: string;
  uri: string;
  is_local: boolean;
}
/* 사용자 추천 음악*/
interface RTrack {
  album: {
    images: {
      url: string;
    }[];
  };
  artists: {
    id: string;
    name: string;
  }[];
  name: string;
  id: string;
}
export interface RecommendData {
  recommends: RTrack[];
}

export interface ChartData {
  tracks: Track[];
}

export interface ArtistData {
  artists: Artist[];
}

/* 트랙 메타 데이터 */
export interface TrackMetaData {
  id: string;
  duration_ms: number;
}
export interface CurrentTimeData {
  progress_ms: number;
}
export interface LyricData {
  startMs: number;
  durMs: number;
  text: string;
}
