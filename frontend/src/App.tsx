import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./login/Login";
import Join from "./login/Join";
import Setting from "./settingview/Setting";
import { SpotifyLogo } from "./settingview/SpotifyLogo";
import Callback from "./callback/Callback";
import MusicHome from "./musichome/MusicHome";
import { PopularMusicList } from "./musichome/PopularMusicList";
import { PoplularArtistList } from "./musichome/PopularArtistList";
import { ArtistDetial } from "./musichome/ArtistDetail";
import { SearchMusic } from "./musichome/SearchMusic";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import PlayMusic from "./musichome/PlayMusic";
import Speaking from "./learning/Speaking";
import { QuestionBoard } from "./learning/QuestionBoard";
import { Score } from "./learning/Score";
import Commentary from "./learning/Commentary";
import { Rank } from "./learning/Rank";
import Listening from "./learning/Listening";
import SelectCategory from "./learning/SelectCategory";
import SpeakingScore from "./learning/SpeakingScore";
import ListeningScore from "./learning/ListeningScore";
import { RecommendMusicList } from "./musichome/RecommendMusicList";
import MockExam from "./mockExams/MockExam";
import SearchExam from "./mockExams/SearchExam";
import MockComment from "./mockExams/MockComment";
import History from "./problemHistory/History";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          {/* 로그인 관련 페이지 */}
          <Route path="/" element={<Login />}></Route>
          <Route path="/join" element={<Join />}></Route>
          <Route path="/callback" element={<Callback />}></Route>

          {/* 설정 관련 페이지 */}
          <Route path="/setting" element={<Setting />}></Route>
          <Route path="/spotify" element={<SpotifyLogo />}></Route>

          {/* 메인 화면 */}
          <Route path="/home" element={<MusicHome />}></Route>
          <Route
            path="/recommendCharts"
            element={<RecommendMusicList />}
          ></Route>
          <Route path="/charts" element={<PopularMusicList />}></Route>
          <Route path="/artists" element={<PoplularArtistList />}></Route>
          <Route path="/searchMusic" element={<SearchMusic />}></Route>

          <Route path="/artistDetail" element={<ArtistDetial />}></Route>
          <Route path="/playMusic" element={<PlayMusic />}></Route>

          {/* 학습 관련 페이지 */}
          <Route path="/category" element={<SelectCategory />}></Route>
          <Route path="/speaking" element={<Speaking />}></Route>
          <Route path="/question" element={<QuestionBoard />}></Route>
          <Route path="/score" element={<Score />}></Route>
          <Route path="/comment" element={<Commentary />}></Route>
          <Route path="/rank" element={<Rank />}></Route>
          <Route path="/listening" element={<Listening />}></Route>
          <Route path="/lsScore" element={<ListeningScore />}></Route>
          <Route path="/speakingScore" element={<SpeakingScore />}></Route>

          {/* 모의고사 관련 페이지 */}
          <Route path="/compQuiz" element={<SearchExam />}></Route>
          <Route path="/mockExam" element={<MockExam />}></Route>
          <Route path="/mockComment" element={<MockComment />}></Route>

          {/* 히스토리 페이지 */}
          <Route path="/history" element={<History />}></Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
