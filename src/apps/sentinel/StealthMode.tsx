import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calculator, Clock, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Stealth Mode — Mode discret Sentinel
 * 
 * Quand activé :
 * - L'interface se transforme en calculatrice factice
 * - Le SOS peut être déclenché par un geste invisible (taper 911 + =)
 * - L'historique visible est masqué
 * - Le titre de l'onglet change
 */

interface StealthModeProps {
  enabled: boolean;
  onSOSTriggered: () => void;
  onExit: () => void;
}

const STEALTH_CODE = "911";

/** Secure math evaluator — replaces Function()/eval to prevent XSS */
function safeEvaluate(expr: string): number {
  const sanitized = expr.replace(/[^0-9+\-*/().]/g, "");
  if (!sanitized || sanitized.length > 50) throw new Error("Invalid");
  // Tokenize and validate: only digits, operators, parens, dots
  const tokens = sanitized.match(/(\d+\.?\d*|[+\-*/()])/g);
  if (!tokens) throw new Error("Invalid");
  // Rebuild and evaluate via recursive descent
  let pos = 0;
  const peek = () => tokens[pos] ?? "";
  const consume = () => tokens[pos++];

  function parseExpr(): number {
    let result = parseTerm();
    while (peek() === "+" || peek() === "-") {
      const op = consume();
      const right = parseTerm();
      result = op === "+" ? result + right : result - right;
    }
    return result;
  }
  function parseTerm(): number {
    let result = parseFactor();
    while (peek() === "*" || peek() === "/") {
      const op = consume();
      const right = parseFactor();
      result = op === "*" ? result * right : result / right;
    }
    return result;
  }
  function parseFactor(): number {
    if (peek() === "(") {
      consume();
      const result = parseExpr();
      consume(); // ")"
      return result;
    }
    return parseFloat(consume());
  }
  const result = parseExpr();
  if (!isFinite(result)) throw new Error("Invalid");
  return Math.round(result * 1e10) / 1e10;
}

const StealthMode = ({ enabled, onSOSTriggered, onExit }: StealthModeProps) => {
  const [display, setDisplay] = useState("0");
  const [sosArmed, setSosArmed] = useState(false);

  // Change tab title when in stealth mode
  useEffect(() => {
    if (enabled) {
      const original = document.title;
      document.title = "Calculatrice";
      return () => { document.title = original; };
    }
  }, [enabled]);

  // Detect shake gesture (mobile)
  useEffect(() => {
    if (!enabled) return;
    
    let lastX = 0, lastY = 0, lastZ = 0;
    let shakeCount = 0;
    let lastShake = 0;

    const handleMotion = (e: DeviceMotionEvent) => {
      const acc = e.accelerationIncludingGravity;
      if (!acc) return;
      
      const deltaX = Math.abs((acc.x ?? 0) - lastX);
      const deltaY = Math.abs((acc.y ?? 0) - lastY);
      const deltaZ = Math.abs((acc.z ?? 0) - lastZ);
      
      if (deltaX + deltaY + deltaZ > 30) {
        const now = Date.now();
        if (now - lastShake > 300) {
          shakeCount++;
          lastShake = now;
          if (shakeCount >= 3) {
            onSOSTriggered();
            shakeCount = 0;
          }
        }
      }
      
      lastX = acc.x ?? 0;
      lastY = acc.y ?? 0;
      lastZ = acc.z ?? 0;
    };

    window.addEventListener("devicemotion", handleMotion);
    return () => window.removeEventListener("devicemotion", handleMotion);
  }, [enabled, onSOSTriggered]);

  const handleKey = useCallback((key: string) => {
    if (key === "C") {
      setDisplay("0");
      setSosArmed(false);
      return;
    }

    if (key === "EXIT") {
      onExit();
      return;
    }

    if (key === "=") {
      if (display === STEALTH_CODE || display.endsWith(STEALTH_CODE)) {
        setSosArmed(true);
        setTimeout(() => {
          onSOSTriggered();
          setSosArmed(false);
          setDisplay("0");
        }, 1000);
        return;
      }
      // Secure math parser — no eval/Function
      try {
        const result = safeEvaluate(display);
        setDisplay(String(result));
      } catch {
        setDisplay("Erreur");
      }
      return;
    }

    setDisplay((prev) => (prev === "0" || prev === "Erreur" ? key : prev + key));
  }, [display, onSOSTriggered]);

  if (!enabled) return null;

  const keys = ["7", "8", "9", "÷", "4", "5", "6", "×", "1", "2", "3", "-", "0", ".", "=", "+"];

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col items-center justify-center">
      <div className="w-full max-w-xs space-y-4 px-4">
        {/* Display */}
        <Card className={cn(
          "transition-colors duration-300",
          sosArmed && "border-level4/50 bg-level4/5"
        )}>
          <CardContent className="py-6 px-4">
            <p className="text-right text-3xl font-mono tabular-nums truncate">
              {sosArmed ? "..." : display}
            </p>
          </CardContent>
        </Card>

        {/* Keypad */}
        <div className="grid grid-cols-4 gap-2">
          {keys.map((key) => (
            <Button
              key={key}
              variant={["÷", "×", "-", "+", "="].includes(key) ? "secondary" : "outline"}
              className="h-14 text-lg font-mono"
              onClick={() => {
                const mapped = key === "÷" ? "/" : key === "×" ? "*" : key;
                handleKey(mapped);
              }}
            >
              {key}
            </Button>
          ))}
        </div>

        {/* Clear & secret exit */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1 h-12"
            onClick={() => handleKey("C")}
          >
            C
          </Button>
          <Button
            variant="ghost"
            className="h-12 text-xs text-muted-foreground/30 hover:text-muted-foreground/50"
            onClick={() => handleKey("EXIT")}
          >
            <Clock className="w-3 h-3" />
          </Button>
        </div>

        {/* Invisible hint */}
        {sosArmed && (
          <div className="text-center">
            <Badge className="bg-level4 text-white animate-pulse text-xs">
              Signal en cours d'envoi…
            </Badge>
          </div>
        )}
      </div>
    </div>
  );
};

export default StealthMode;
