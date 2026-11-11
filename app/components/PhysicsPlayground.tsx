"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { RotateCcw, Compass, Info, X, Sparkles } from "lucide-react";
import { markFound } from "@/lib/secrets";

// Detailed facts from AGENTS.md for each skill chip
const SKILL_DETAILS: Record<string, string> = {
  Kotlin: "Kotlin: Native Android development and Coroutines in Student Organizer",
  Compose: "Compose: Declarative Material 3 UI and attendance calendar in Student Organizer",
  Room: "Room: offline storage in Student Organizer",
  Python: "Python: Backend routing, scoring, and data processing in TEJOVIK",
  Flask: "Flask: Modular web framework, view routing, and chat API in TEJOVIK",
  Java: "Java: Coursework and NPTEL Programming in Java Elite 95% certification",
  TypeScript: "TypeScript: Strict type systems, UI state, and frontend web development",
  SQL: "SQL: Relational database schema modeling, indexing, and queries",
};

const SKILL_LIST = [
  "Kotlin",
  "Compose",
  "Room",
  "Python",
  "Flask",
  "Java",
  "TypeScript",
  "SQL",
];

const NAME_LETTERS = ["K", "a", "r", "t", "i", "k", "K", "o", "u", "n", "d", "a", "l"];

type GravityMode = "normal" | "zero-g" | "flipped";

declare global {
  interface Window {
    Matter?: any;
  }
}

export function PhysicsPlayground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gravityMode, setGravityMode] = useState<GravityMode>("normal");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [touchActive, setTouchActive] = useState(false);
  const [isMatterLoaded, setIsMatterLoaded] = useState(false);

  // Engine refs
  const engineRef = useRef<any>(null);
  const runnerRef = useRef<any>(null);
  const mouseConstraintRef = useRef<any>(null);
  const renderLoopRef = useRef<number | null>(null);
  const wallsRef = useRef<any[]>([]);
  const itemsRef = useRef<any[]>([]);
  const isIntersectingRef = useRef(false);
  const hasDroppedRef = useRef(false);
  const lastClickTimeRef = useRef<{ id: number; time: number }>({ id: 0, time: 0 });

  // 1. Check Matter.js from CDN (in head) with local fallback
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (window.Matter) {
      setIsMatterLoaded(true);
      return;
    }

    const checkInterval = setInterval(() => {
      if (window.Matter) {
        setIsMatterLoaded(true);
        clearInterval(checkInterval);
      }
    }, 100);

    const fallbackTimeout = setTimeout(() => {
      if (!window.Matter) {
        const localScript = document.createElement("script");
        localScript.src = "/vendor/matter.min.js";
        localScript.async = true;
        localScript.onload = () => {
          setIsMatterLoaded(true);
          clearInterval(checkInterval);
        };
        document.head.appendChild(localScript);
      }
    }, 2000);

    return () => {
      clearInterval(checkInterval);
      clearTimeout(fallbackTimeout);
    };
  }, []);

  // 2. Setup and Tear down Physics World
  const initPhysics = useCallback(() => {
    if (!window.Matter || !canvasRef.current || !containerRef.current) return;

    const Matter = window.Matter;
    const { Engine, Runner, Bodies, Composite, Mouse, MouseConstraint, Events } = Matter;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    const width = container.clientWidth || 800;
    const height = 360;

    // Retina display setup
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);

    // Create engine & world
    const engine = Engine.create({
      gravity: { x: 0, y: 1, scale: 0.001 },
      enableSleeping: false,
    });
    engineRef.current = engine;

    const runner = Runner.create();
    runnerRef.current = runner;

    // Create boundary walls
    const wallThickness = 60;
    const ground = Bodies.rectangle(width / 2, height + wallThickness / 2 - 2, width * 2, wallThickness, {
      isStatic: true,
      friction: 0.5,
      render: { visible: false },
    });
    const ceiling = Bodies.rectangle(width / 2, -wallThickness / 2, width * 2, wallThickness, {
      isStatic: true,
      friction: 0.5,
      render: { visible: false },
    });
    const leftWall = Bodies.rectangle(-wallThickness / 2, height / 2, wallThickness, height * 2, {
      isStatic: true,
      friction: 0.5,
      render: { visible: false },
    });
    const rightWall = Bodies.rectangle(width + wallThickness / 2, height / 2, wallThickness, height * 2, {
      isStatic: true,
      friction: 0.5,
      render: { visible: false },
    });

    wallsRef.current = [ground, ceiling, leftWall, rightWall];
    Composite.add(engine.world, wallsRef.current);

    // Mouse and Constraint-based dragging
    const mouse = Mouse.create(canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false },
      },
    });
    mouseConstraintRef.current = mouseConstraint;
    Composite.add(engine.world, mouseConstraint);

    // Throw detection -> marks easter egg unlocked!
    Events.on(mouseConstraint, "enddrag", (event: any) => {
      const body = event.body;
      if (body) {
        const speed = Math.hypot(body.velocity.x, body.velocity.y);
        if (speed > 1.8) {
          markFound("physics");
        }
      }
    });

    // Collision Flash micro-interaction
    Events.on(engine, "collisionStart", (event: any) => {
      const now = Date.now();
      event.pairs.forEach((pair: any) => {
        const { bodyA, bodyB } = pair;
        if (!bodyA.isStatic && !bodyB.isStatic) {
          bodyA.collisionFlash = now;
          bodyB.collisionFlash = now;
        } else if (!bodyA.isStatic) {
          bodyA.collisionFlash = now;
        } else if (!bodyB.isStatic) {
          bodyB.collisionFlash = now;
        }
      });
    });

    // Double-click detection for skill chips
    const handleCanvasClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      const now = Date.now();

      const clickedBody = itemsRef.current.find((item) => {
        return Matter.Bounds.contains(item.body.bounds, { x: clickX, y: clickY });
      });

      if (clickedBody) {
        if (
          lastClickTimeRef.current.id === clickedBody.body.id &&
          now - lastClickTimeRef.current.time < 380
        ) {
          // Double-click detected!
          if (clickedBody.type === "chip") {
            const detail = SKILL_DETAILS[clickedBody.label];
            if (detail) {
              setToastMessage(detail);
            }
          }
        }
        lastClickTimeRef.current = { id: clickedBody.body.id, time: now };
      }
    };

    canvas.addEventListener("click", handleCanvasClick);

    // Custom 2D Canvas Render Loop with Green Accent & Glow
    const render = () => {
      if (!isIntersectingRef.current) {
        renderLoopRef.current = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      // Draw subtle background grid/floor line
      ctx.strokeStyle = "rgba(42, 46, 50, 0.5)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, height - 2);
      ctx.lineTo(width, height - 2);
      ctx.stroke();

      const now = Date.now();

      // Render each letter block and chip
      itemsRef.current.forEach((item) => {
        const { body, label, type, w, h } = item;
        const { position, angle } = body;

        ctx.save();
        ctx.translate(position.x, position.y);
        ctx.rotate(angle);

        const isFlashing = body.collisionFlash && now - body.collisionFlash < 180;

        if (type === "letter") {
          // Square Letter Block (34x34)
          ctx.beginPath();
          ctx.roundRect(-w / 2, -h / 2, w, h, 4);

          // Background fill
          ctx.fillStyle = isFlashing ? "rgba(95, 179, 143, 0.25)" : "#181B1E";
          ctx.fill();

          // Border stroke
          ctx.lineWidth = isFlashing ? 2 : 1;
          ctx.strokeStyle = isFlashing ? "#5FB38F" : "#2A2E32";
          ctx.stroke();

          // Monospace letter
          ctx.font = "bold 14px 'IBM Plex Mono', monospace";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillStyle = "#5FB38F";
          ctx.fillText(label, 0, 1);
        } else {
          // Skill Chip (Pill shape)
          ctx.beginPath();
          ctx.roundRect(-w / 2, -h / 2, w, h, 6);

          // Fill
          ctx.fillStyle = isFlashing ? "rgba(95, 179, 143, 0.3)" : "#141618";
          ctx.fill();

          // Border
          ctx.lineWidth = isFlashing ? 2 : 1;
          ctx.strokeStyle = isFlashing ? "#5FB38F" : "rgba(95, 179, 143, 0.4)";
          ctx.stroke();

          // Text
          ctx.font = "500 12px 'IBM Plex Mono', monospace";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillStyle = "#E9E8E3";
          ctx.fillText(label, 0, 1);
        }

        ctx.restore();
      });

      renderLoopRef.current = requestAnimationFrame(render);
    };

    renderLoopRef.current = requestAnimationFrame(render);
    Runner.run(runner, engine);

    return () => {
      canvas.removeEventListener("click", handleCanvasClick);
      if (renderLoopRef.current) cancelAnimationFrame(renderLoopRef.current);
      Runner.stop(runner);
      Engine.clear(engine);
    };
  }, []);

  // 3. Drop objects into the world (respects prefers-reduced-motion)
  const dropObjects = useCallback(() => {
    if (!window.Matter || !engineRef.current || !containerRef.current) return;

    const Matter = window.Matter;
    const { Bodies, Composite } = Matter;
    const engine = engineRef.current;
    const width = containerRef.current.clientWidth || 800;
    const height = 360;

    // Remove existing items
    itemsRef.current.forEach((item) => {
      Composite.remove(engine.world, item.body);
    });
    itemsRef.current = [];

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const newItems: any[] = [];

    // A. Letters for "Kartik Koundal"
    const letterSize = 34;
    const totalLettersWidth = NAME_LETTERS.length * (letterSize + 6);
    const startX = Math.max(30, (width - totalLettersWidth) / 2);

    NAME_LETTERS.forEach((letter, i) => {
      const targetX = startX + i * (letterSize + 6);
      const spawnY = prefersReducedMotion ? height - letterSize / 2 - 4 : -30 - i * 16;

      const body = Bodies.rectangle(targetX, spawnY, letterSize, letterSize, {
        chamfer: { radius: 4 },
        restitution: 0.35,
        friction: 0.5,
        frictionAir: 0.015,
        density: 0.002,
      });

      newItems.push({
        body,
        label: letter,
        type: "letter",
        w: letterSize,
        h: letterSize,
      });
      Composite.add(engine.world, body);
    });

    // B. Skill Chips (fall in after letters or rest on floor)
    const chipHeight = 30;
    SKILL_LIST.forEach((skill, i) => {
      // Calculate width based on text length
      const chipWidth = Math.max(68, skill.length * 9.5 + 24);
      const spawnX = (width / (SKILL_LIST.length + 1)) * (i + 1) + (Math.random() * 20 - 10);
      const spawnY = prefersReducedMotion
        ? height - chipHeight * 2 - 12
        : -160 - i * 36;

      const body = Bodies.rectangle(spawnX, spawnY, chipWidth, chipHeight, {
        chamfer: { radius: 6 },
        restitution: 0.4,
        friction: 0.4,
        frictionAir: 0.012,
        density: 0.0018,
      });

      newItems.push({
        body,
        label: skill,
        type: "chip",
        w: chipWidth,
        h: chipHeight,
      });
      Composite.add(engine.world, body);
    });

    itemsRef.current = newItems;
    hasDroppedRef.current = true;
  }, []);

  // 4. Initialize physics when Matter.js is ready
  useEffect(() => {
    if (!isMatterLoaded) return;
    const cleanup = initPhysics();
    return () => {
      if (cleanup) cleanup();
    };
  }, [isMatterLoaded, initPhysics]);

  // 5. IntersectionObserver: triggers initial drop & pauses physics loop when off-screen
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isIntersectingRef.current = entry.isIntersecting;

        if (entry.isIntersecting) {
          // Resume runner
          if (runnerRef.current && engineRef.current) {
            window.Matter?.Runner.run(runnerRef.current, engineRef.current);
          }
          // Initial drop when scrolled into view
          if (!hasDroppedRef.current) {
            dropObjects();
          }
        } else {
          // Pause runner when off-screen to save battery
          if (runnerRef.current) {
            window.Matter?.Runner.stop(runnerRef.current);
          }
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [dropObjects]);

  // 6. Handle Gravity Mode toggling (3 states)
  const toggleGravity = () => {
    if (!engineRef.current || !window.Matter) return;
    const engine = engineRef.current;

    let nextMode: GravityMode = "normal";
    if (gravityMode === "normal") {
      nextMode = "zero-g";
      engine.gravity.y = 0;
      engine.gravity.x = 0;

      // Give objects a gentle floating drift in Zero-G
      itemsRef.current.forEach((item) => {
        window.Matter.Body.setVelocity(item.body, {
          x: (Math.random() - 0.5) * 1.5,
          y: (Math.random() - 0.5) * 1.5,
        });
      });
    } else if (gravityMode === "zero-g") {
      nextMode = "flipped";
      engine.gravity.y = -1;
      engine.gravity.x = 0;
    } else {
      nextMode = "normal";
      engine.gravity.y = 1;
      engine.gravity.x = 0;
    }

    setGravityMode(nextMode);
  };

  // 7. Reset function
  const handleReset = () => {
    if (!engineRef.current) return;
    engineRef.current.gravity.y = 1;
    engineRef.current.gravity.x = 0;
    setGravityMode("normal");
    dropObjects();
  };

  return (
    <div className="w-full my-8">
      {/* Playground Header / Controls Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pb-2.5 border-b border-[var(--rule)] font-mono text-xs text-[var(--ink-muted)]">
        <div className="flex items-center gap-2">
          <span className="text-[var(--accent)] font-semibold flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
            <Compass size={13} className="shrink-0" />
            <span>Interactive Physics Sandbox</span>
          </span>
          <span className="text-[var(--rule)] hidden sm:inline">&middot;</span>
          <span className="text-[11px] hidden sm:inline text-[var(--ink-muted)]">
            Grab, throw, stack &bull; Double-click chips for details
          </span>
        </div>

        {/* Buttons: Gravity Toggle & Reset */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleGravity}
            className={`px-2.5 py-1 rounded-[4px] border transition-colors cursor-pointer text-xs font-mono flex items-center gap-1.5 ${
              gravityMode === "zero-g"
                ? "border-amber-500/60 bg-amber-500/10 text-amber-400"
                : gravityMode === "flipped"
                ? "border-cyan-500/60 bg-cyan-500/10 text-cyan-400"
                : "border-[var(--rule)] bg-[var(--surface)] text-[var(--ink)] hover:border-[var(--accent)]"
            }`}
            title="Cycle gravity: Normal -> Zero-G -> Flipped"
          >
            <span>
              Gravity: {gravityMode === "normal" ? "Normal" : gravityMode === "zero-g" ? "Zero-G" : "Flipped"}
            </span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="px-2.5 py-1 rounded-[4px] border border-[var(--rule)] bg-[var(--surface)] text-[var(--ink)] hover:border-[var(--accent)] transition-colors cursor-pointer text-xs font-mono flex items-center gap-1.5"
            title="Reset and re-drop letters and skill chips"
          >
            <RotateCcw size={12} />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Canvas Container */}
      <div
        ref={containerRef}
        onClick={() => setTouchActive(true)}
        className="relative w-full h-[360px] bg-[#0C0E11] border border-[var(--rule)] rounded-[4px] overflow-hidden select-none"
      >
        <canvas
          ref={canvasRef}
          style={{
            touchAction: touchActive ? "none" : "pan-y",
          }}
          className="w-full h-full block cursor-grab active:cursor-grabbing"
        />

        {/* Touch Activation Overlay for mobile devices */}
        {!touchActive && (
          <div
            onClick={() => setTouchActive(true)}
            className="md:hidden absolute inset-0 z-10 flex items-center justify-center bg-black/40 backdrop-blur-[2px] transition-opacity cursor-pointer"
          >
            <div className="px-3.5 py-1.5 bg-[var(--surface)] border border-[var(--accent)]/50 rounded-[4px] text-xs font-mono text-[var(--ink)] flex items-center gap-2 shadow-lg">
              <Sparkles size={13} className="text-[var(--accent)] animate-pulse" />
              <span>Tap to activate physics sandbox</span>
            </div>
          </div>
        )}

        {/* Chip Information Toast (triggered on double-click) */}
        {toastMessage && (
          <div className="absolute bottom-3 left-3 right-3 sm:left-4 sm:right-auto sm:max-w-md z-20 p-2.5 bg-[var(--surface)] border border-[var(--accent)]/60 rounded-[4px] shadow-xl text-xs font-mono text-[var(--ink)] flex items-start justify-between gap-3 animate-[fadeIn_0.2s_ease-out]">
            <div className="flex items-start gap-2 leading-relaxed">
              <Info size={14} className="text-[var(--accent)] shrink-0 mt-0.5" />
              <span>{toastMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setToastMessage(null)}
              className="text-[var(--ink-muted)] hover:text-[var(--ink)] cursor-pointer p-0.5 shrink-0"
              aria-label="Dismiss toast"
            >
              <X size={13} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
