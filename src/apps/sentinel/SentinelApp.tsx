import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

const SentinelHome = lazy(() => import("./SentinelHome"));
const SentinelCharte = lazy(() => import("./SentinelCharte"));
const SentinelSOS = lazy(() => import("./SentinelSOS"));
const SentinelLYA = lazy(() => import("./SentinelLYA"));
const SentinelTransparence = lazy(() => import("./SentinelTransparence"));

const Loading = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="w-6 h-6 border-2 border-muted-foreground/30 border-t-foreground rounded-full animate-spin" />
  </div>
);

const SentinelApp = () => (
  <Suspense fallback={<Loading />}>
    <Routes>
      <Route index element={<SentinelHome />} />
      <Route path="charte" element={<SentinelCharte />} />
      <Route path="sos" element={<SentinelSOS />} />
      <Route path="lya" element={<SentinelLYA />} />
      <Route path="transparence" element={<SentinelTransparence />} />
    </Routes>
  </Suspense>
);

export default SentinelApp;
