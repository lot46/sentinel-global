import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import CoffreLya from "./CoffreLya";

/**
 * Floating L-Y-A avatar — visible on every Sentinel screen.
 * Opens the Coffre or navigates to the L-Y-A chat.
 */
const LyaAvatar = () => {
  const [open, setOpen] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Don't show on the LYA chat page itself
  const isOnLyaPage = location.pathname.includes("/sentinel/lya");

  if (isOnLyaPage) return null;

  return (
    <>
      {/* Floating button */}
      <div className="fixed bottom-20 right-4 z-50 flex flex-col items-end gap-2">
        {/* Mini menu */}
        {showMenu && (
          <div className="bg-card border border-border rounded-xl shadow-lg p-2 space-y-1 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <button
              onClick={() => {
                setShowMenu(false);
                navigate("/sentinel/lya");
              }}
              className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-accent transition-colors w-full text-left"
            >
              <MessageCircle className="w-4 h-4 text-sentinel" />
              Parler à L-Y-A
            </button>
            <button
              onClick={() => {
                setShowMenu(false);
                setOpen(true);
              }}
              className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-accent transition-colors w-full text-left"
            >
              🔒 Mon Coffre
            </button>
          </div>
        )}

        {/* Avatar bubble */}
        <button
          onClick={() => setShowMenu(!showMenu)}
          className={cn(
            "w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300",
            "bg-gradient-to-br from-[hsl(185,70%,50%)] to-sentinel",
            "hover:scale-110 active:scale-95",
            showMenu && "ring-2 ring-sentinel/40"
          )}
          aria-label="L-Y-A"
        >
          {/* Simple friendly robot face */}
          <div className="flex flex-col items-center">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
              <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" style={{ animationDelay: "0.3s" }} />
            </div>
            <div className="w-4 h-1.5 rounded-full bg-white/80 mt-1" />
          </div>
        </button>

        {/* Speech bubble hint */}
        {!showMenu && (
          <div className="absolute -left-32 bottom-3 bg-card border border-border rounded-lg px-3 py-1.5 text-xs text-muted-foreground shadow-sm whitespace-nowrap animate-in fade-in duration-500" style={{ animationDelay: "2s" }}>
            Je suis là pour toi 💙
          </div>
        )}
      </div>

      {/* Coffre dialog */}
      <CoffreLya open={open} onOpenChange={setOpen} />
    </>
  );
};

export default LyaAvatar;
