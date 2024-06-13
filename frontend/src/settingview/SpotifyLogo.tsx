import React, { useEffect } from "react";

/**
 * Code Challenge(from code verifier) -> RequestAuthorization
 * -> AccessToken
 *
 */

export const SpotifyLogo = () => {
  useEffect(() => {
    const generateRandomString = (length: any) => {
      const possible =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      const values = crypto.getRandomValues(new Uint8Array(length));
      return values.reduce((acc, x) => acc + possible[x % possible.length], "");
    };

    let codeVerifier = localStorage.getItem("code_verifier");

    if (!codeVerifier) {
      codeVerifier = generateRandomString(128);
      localStorage.setItem("code_verifier", codeVerifier);
    }

    // 2. Code Challenge
    // SHA256
    const sha256 = async (plain: any) => {
      const encoder = new TextEncoder();
      const data = encoder.encode(plain);
      return await window.crypto.subtle.digest("SHA-256", data);
    };

    const base64encode = (input: any) => {
      // @ts-ignore
      return btoa(String.fromCharCode(...new Uint8Array(input)))
        .replace(/=/g, "")
        .replace(/\+/g, "-")
        .replace(/\//g, "_");
    };

    const hashed = sha256(codeVerifier);
    const codeChallenge = base64encode(hashed);

    const createCodeChallenge = async () => {
      const hashed = await sha256(codeVerifier);
      const codeChallenge = base64encode(hashed);

      const clientId = process.env.REACT_APP_SPOTIFY_CLIENTID || ""; //환경 변수로 설정해놓기
      const redirectUri = "http://localhost:3000/callback"; //"https://main.dx55diamovfwp.amplifyapp.com/callback";

      const scope =
        "user-read-private" +
        " user-read-email" +
        " user-read-playback-state" +
        " user-modify-playback-state " +
        "streaming";
      const authUrl = new URL("https://accounts.spotify.com/authorize");

      const params = {
        response_type: "code",
        client_id: clientId,
        scope: scope,
        code_challenge_method: "S256",
        code_challenge: codeChallenge,
        redirect_uri: redirectUri,
      };

      authUrl.search = new URLSearchParams(params).toString();
      window.location.href = authUrl.toString();
    };

    createCodeChallenge();
  }, []);

  return <></>;
};
