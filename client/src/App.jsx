import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Header from "./component/Header";
import PostShowPage from "./pages/PostShowPage";
import CreatePostPage from "./component/CreatePost";
import FloatingButton from "./component/FloatingButton";
import { MdOutlineAddBox } from "react-icons/md";
import UserDashboard from "./pages/UserDashboard";
import EditPostPage from "./component/EditPost";

function App() {
  return (
    <BrowserRouter>
    <Header></Header>
      <Routes>
        <Route path="/" element={<Login />} />
        
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<PostShowPage />} />
        <Route path="/post" element={<CreatePostPage />} />
        <Route path="/profile" element={<UserDashboard />} />
        <Route path="/edit-post/:postId" element={<EditPostPage />} />
      </Routes>
      <FloatingButton to="/post" character={<MdOutlineAddBox />}/>
    </BrowserRouter>
  );
}

export default App;
