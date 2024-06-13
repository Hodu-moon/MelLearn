import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

const axiosApi = axios.create({
  baseURL: "http://localhost:8080", //"https://mel-learn.store/",
  withCredentials: true,
});

/* Spotify Scraper API 호출용 */
export const axiosSpotifyScraper = axios.create({
  baseURL: "https://spotify-scraper.p.rapidapi.com/v1",
  withCredentials: true,
  headers: {
    "X-RapidAPI-Key": process.env.REACT_APP_SPOTIFY_SCRAPER,
    "X-RapidAPI-Host": "spotify-scraper.p.rapidapi.com",
  },
});

const accessToken = localStorage.getItem("spotify_access_token");

export const axiosSpotify = axios.create({
  baseURL: "https://api.spotify.com/v1",
  headers: {
    Authorization: "Bearer " + accessToken,
    "Content-Type": "application/json",
  },
});

const handleRequestInterceptor = (
  config: InternalAxiosRequestConfig
): InternalAxiosRequestConfig => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

const handleResponseInterceptor = async (
  error: AxiosError
): Promise<AxiosResponse> => {
  if (error.response?.status === 401) {
    const errorData = error.response.data as { message: string };
    alert(errorData.message);
    window.location.href = "/";
    return new Promise(() => {}); // interceptor에서 에러 처리후 Promise chaining 끊기
  } else if (error.response?.status === 403) {
    const res = await axiosApi.get("/reIssueJwt"); //토큰 재발급
    const accessToken = res.data.accessToken;
    localStorage.setItem("accessToken", accessToken);
    return new Promise(() => {});
  } else if (error.response?.status === 404) {
    const errorData = error.response.data as { message: string };
    alert(errorData.message);
  } else if (error.response?.status === 409) {
    const errorData = error.response.data as { message: string };
    alert(errorData.message);
    //window.location.href = "/home/main5";
    window.history.back();
    return new Promise(() => {});
  } else {
    //const errorData = error.response?.data as { message: string };
    //alert(errorData.message);
    //window.history.back();
    return new Promise(() => {});
    // 다른 예외 상황 처리
  }

  return Promise.reject(error.toJSON());
};

const handleSpotifyRequestInterceptor = (
  config: InternalAxiosRequestConfig
): InternalAxiosRequestConfig => {
  const token = localStorage.getItem("spotify_access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
};
const handleSpotifyResponseInterceptor = async (
  error: AxiosError
): Promise<AxiosResponse> => {
  if (error.response?.status === 401) {
    window.location.href = "/"; //로그인 창으로 리다이렉션
    return new Promise(() => {});
  } else if (error.response?.status === 403) {
    alert("프리미엄 계정 유저가 아닙니다.");

    return new Promise(() => {});
  } else if (error.response?.status === 404) {
    //const deviceId = localStorage.getItem("deviceId");
    alert("연결된 장치가 존재하지 않습니다. 다시 로그인 해주세요");
    window.location.href = "/";
    return new Promise(() => {});
  }
  return Promise.reject(error.toJSON());
};

const handleSpotifyScrapperResponseInterceptor = async (
  error: AxiosError
): Promise<AxiosResponse> => {
  if (error.response?.status === 401) {
    window.location.href = "/"; //로그인 창으로 리다이렉션
    return new Promise(() => {});
  } else if (error.response?.status === 404) {
    alert("가사를 지원하지 않는 음악입니다.");
    return new Promise(() => {});
  } else if (error.response?.status === 429) {
    // alert("잠시후에 다시 시도해주세요");
    // return new Promise(() => {});
  }
  return Promise.reject(error.toJSON());
};
/* local Server */
axiosApi.interceptors.request.use(
  handleRequestInterceptor,
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);
axiosApi.interceptors.response.use(
  (response) => response,
  (error) => handleResponseInterceptor(error)
);
/* spotify */
axiosSpotify.interceptors.request.use(
  handleSpotifyRequestInterceptor,
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);
axiosSpotify.interceptors.response.use(
  (response) => response,
  handleSpotifyResponseInterceptor
);

/* SpotifySCrapper */
axiosSpotifyScraper.interceptors.response.use(
  (response) => response,
  handleSpotifyScrapperResponseInterceptor
);

export default axiosApi;
