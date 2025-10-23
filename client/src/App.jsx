import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Header from "./component/Header";
import PostShowPage from "./pages/PostShowPage";
import CreatePostPage from "./component/CreatePost";
import FloatingButton from "./component/FloatingButton";
import { MdOutlineAddBox } from "react-icons/md";

function App() {
  return (
    <BrowserRouter>
    <Header></Header>
      <Routes>
        <Route path="/" element={<Login />} />
        {/* You can add more routes later like this */}
        {/* <Route path="/" element={<Home />} /> */}
        {/* <Route path="/register" element={<Register />} /> */}
        
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<PostShowPage />} />
        <Route path="/post" element={<CreatePostPage />} />
      </Routes>
      <FloatingButton to="/post" character={<MdOutlineAddBox />}/>
    </BrowserRouter>
  );
}

export default App;
