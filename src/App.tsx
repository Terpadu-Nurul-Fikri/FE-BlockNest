import { Routes, Route } from "react-router-dom";
import Home from "./component/pages/Home";
import CategoryPage from "./component/pages/CategoryPage";
import RegisterPage from "./component/pages/RegisterPage";
import LoginPage from "./component/pages/LoginPage";
import ProfilePage from "./component/pages/ProfilePage";

const NAV_SLUGS = [
  "living-room",
  "bedroom",
  "dining",
  "office",
  "outdoor",
  "sale",
];

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      {NAV_SLUGS.map((slug) => (
        <Route key={slug} path={`/${slug}`} element={<CategoryPage />} />
      ))}
      {/* Catch-all: redirect unknown paths to home */}
      <Route path="*" element={<Home />} />
    </Routes>
  );
}
