import { Routes, Route } from "react-router-dom";
import Home from "./component/pages/Home";
import CategoryPage from "./component/pages/CategoryPage";

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
      {NAV_SLUGS.map((slug) => (
        <Route key={slug} path={`/${slug}`} element={<CategoryPage />} />
      ))}
      {/* Catch-all: redirect unknown paths to home */}
      <Route path="*" element={<Home />} />
    </Routes>
  );
}
