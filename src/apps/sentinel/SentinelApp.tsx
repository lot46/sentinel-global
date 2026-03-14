import { Routes, Route } from "react-router-dom";
import SentinelDashboard from "./SentinelHome";
import SentinelCharte from "./SentinelCharte";

const SentinelApp = () => (
  <Routes>
    <Route index element={<SentinelDashboard />} />
    <Route path="charte" element={<SentinelCharte />} />
  </Routes>
);

export default SentinelApp;
