import React, { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axiosApi, { axiosSpotify } from "../api";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setSpotifyPlayer } from "../redux/player/playerSlice";
import { setPremium } from "../redux/premium/premiumSlice";

function Callback() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const error = queryParams.get("error");
  const code = queryParams.get("code");
  const nav = useNavigate();
  const dispatch = useDispatch();

  // spotify 내 로컬에 device 설치
  const transferDevice = async (devcieId: string, player: Spotify.Player) => {
    localStorage.setItem("deviceId", devcieId);
    const response = await axiosSpotify.put(`/me/player`, {
      device_ids: [devcieId],
      play: true,
    });
  };

  // access_token으로 유저 정보 조회
  const fetchProfile = async (token: string) => {
    const res = await axios.get("https://api.spotify.com/v1/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    /* 계정 연동 성공시 device Transfer */
    if (res.status === 200) {
      const script = document.createElement("script");
      script.src = "https:/sdk.scdn.co/spotify-player.js";
      script.async = true;
      document.body.appendChild(script);

      window.onSpotifyWebPlaybackSDKReady = () => {
        const player = new Spotify.Player({
          name: "MelLearn",
          getOAuthToken: (cb) => {
            cb(token);
          },

          volume: 0.5,
        });

        player.addListener("ready", ({ device_id }) => {
          dispatch(setSpotifyPlayer(player));
          transferDevice(device_id, player);
        });

        player.addListener("not_ready", ({ device_id }) => {
          console.log("Device ID has gone offline");
        });
        player.addListener("initialization_error", ({ message }) => {
          console.error("초기화 에러", message);
        });

        player.addListener("authentication_error", ({ message }) => {
          console.error("인증에러", message);
        });

        player.addListener("account_error", ({ message }) => {
          console.error("계정에러", message);
          dispatch(setPremium(false)); // spotify premium 유저가 아님
        });
        player.addListener("autoplay_failed", () => {
          console.error("ios환경 자동재생 불가능");
        });
        player.connect().then(async (success) => {
          /* 장치 연동 성공시 스포티파이 ID 값 보내줌 */

          if (success) {
            const response = await axiosApi.post(
              "/api/member/spotifyAccount",
              null,
              {
                params: {
                  accountId: id,
                },
              }
            );
            /* 성공시 홈 화면으로 이동*/
            if (response.status === 200) {
              nav("/home");
            }
          }
        });
      };
    }
    const { id } = res.data;
  };

  // 유저의 access_token 가져오기
  const getToken = async (code: string) => {
    const clientId: string = process.env.REACT_APP_SPOTIFY_CLIENTID || "";
    const codeVerifier = localStorage.getItem("code_verifier");
    const params = new URLSearchParams();

    params.set("client_id", clientId);
    params.set("grant_type", "authorization_code");
    params.set("code", code);
    params.set(
      "redirect_uri",
      "http://localhost:3000/callback" //"https://main.dx55diamovfwp.amplifyapp.com/callback"
    );
    // @ts-ignore
    params.set("code_verifier", codeVerifier);

    const payload = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params,
    };
    // member access token 가져오기
    const res = await fetch("https://accounts.spotify.com/api/token", payload);
    const { access_token } = await res.json();
    localStorage.setItem("spotify_access_token", access_token);
    // member access_token으로 spotify 프로필 조회
    fetchProfile(access_token);
  };

  useEffect(() => {
    if (error === "access_denied") {
      nav("/");
      return;
    }
    //code가 존재할 시
    // access 토큰 받고 , spotify userID 요청 한 후
    // access 토큰 받아오는 로직
    if (code) {
      getToken(code);
    }
  }, []);

  return <></>;
}

export default Callback;
