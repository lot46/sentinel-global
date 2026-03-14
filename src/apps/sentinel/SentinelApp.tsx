import { Routes, Route } from "react-router-dom";
import SentinelDashboard from "./SentinelHome";
import SentinelCharte from "./SentinelCharte";
import SentinelSOS from "./SentinelSOS";
import SentinelLYA from "./SentinelLYA";
import SentinelTransparence from "./SentinelTransparence";

const SentinelApp = () => (
  <Routes>
    <Route index element={<SentinelDashboard />} />
    <Route path="charte" element={<SentinelCharte />} />
    <Route path="sos" element={<SentinelSOS />} />
    <Route path="lya" element={<SentinelLYA />} />
    <Route path="transparence" element={<SentinelTransparence />} />
  </Routes>
);

export default SentinelApp;
