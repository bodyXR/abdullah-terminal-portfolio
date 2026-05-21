"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CommandOutput {
  id: string;
  command: string;
  output: React.ReactNode;
}

export default function Portfolio() {
  const [outputs, setOutputs] = useState<CommandOutput[]>([]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isMobile, setIsMobile] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Boot sequence
    const bootSequence = async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      addOutput("", "Initializing portfolio.sh...");
      await new Promise((resolve) => setTimeout(resolve, 600));
      addOutput("", "Loading modules... done");
      await new Promise((resolve) => setTimeout(resolve, 400));
      addOutput("", "Welcome. Type 'help' to see available commands.");
    };

    bootSequence();

    // Mobile detection
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    // Auto-scroll to bottom
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [outputs]);

  const addOutput = (command: string, output: React.ReactNode) => {
    setOutputs((prev) => [
      ...prev,
      { id: Date.now().toString(), command, output },
    ]);
  };

  const executeCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    if (!trimmed) return;

    addOutput(cmd, null);
    setInput("");
    setHistory((prev) => [cmd, ...prev]);
    setHistoryIndex(-1);

    // Simulate command processing
    setTimeout(() => {
      switch (trimmed) {
        case "help":
          addOutput("", <HelpOutput />);
          break;
        case "about":
          addOutput("", <AboutOutput />);
          break;
        case "projects":
        case "ls projects":
          addOutput("", <ProjectsOutput />);
          break;
        case "skills":
        case "cat skills.json":
          addOutput("", <SkillsOutput />);
          break;
        case "contact":
          addOutput("", <ContactOutput />);
          break;
        case "resume":
        case "cat resume.pdf":
          addOutput("", <ResumeOutput />);
          break;
        case "clear":
          setOutputs([]);
          break;
        case "sudo hire-me":
          addOutput("", <HiredOutput />);
          break;
        case "theme light":
          setTheme("light");
          addOutput(
            "",
            <span className="text-green-400">✔ Switched to light theme</span>,
          );
          break;
        case "theme dark":
          setTheme("dark");
          addOutput(
            "",
            <span className="text-green-400">✔ Switched to dark theme</span>,
          );
          break;
        default:
          addOutput(
            "",
            <span className="text-red-400">
              command not found: {trimmed}. Type 'help' for available commands.
            </span>,
          );
      }
    }, 200);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      executeCommand(input);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const newIndex = historyIndex + 1;
      if (newIndex < history.length) {
        setHistoryIndex(newIndex);
        setInput(history[newIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(history[newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput("");
      }
    }
  };

  const bgColor = theme === "dark" ? "#0d1117" : "#f6f8fa";
  const textColor = theme === "dark" ? "#e6edf3" : "#24292f";
  const borderColor = theme === "dark" ? "#30363d" : "#d0d7de";

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: bgColor }}
    >
      <div className="w-full max-w-2xl">
        {/* Terminal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="rounded-lg overflow-hidden border"
          style={{
            backgroundColor: bgColor,
            borderColor: borderColor,
            boxShadow:
              theme === "dark"
                ? "0 20px 60px rgba(0,0,0,0.5)"
                : "0 20px 60px rgba(0,0,0,0.1)",
          }}
        >
          {/* Title Bar */}
          <div
            className="px-4 py-3 flex items-center gap-2 border-b"
            style={{
              borderColor,
              backgroundColor: theme === "dark" ? "#161b22" : "#f3f6f8",
            }}
          >
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
            <span
              className="text-xs flex-1 text-center"
              style={{ color: theme === "dark" ? "#8b949e" : "#57606a" }}
            >
              portfolio.sh — bash — 80x24
            </span>
          </div>

          {/* Terminal Body */}
          <div
            ref={terminalRef}
            className="p-6 min-h-[500px] max-h-[600px] overflow-y-auto text-sm leading-relaxed cursor-text"
            style={{
              color: textColor,
              fontFamily: "JetBrains Mono, monospace",
            }}
            onClick={() => inputRef.current?.focus()}
          >
            <AnimatePresence>
              {outputs.map((output, idx) => (
                <motion.div
                  key={output.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mb-3"
                >
                  {output.command && (
                    <div className="mb-1">
                      <span style={{ color: "#3fb950" }}>
                        Abdullah@portfolio
                      </span>
                      <span style={{ color: textColor }}>:</span>
                      <span style={{ color: "#58a6ff" }}>~</span>
                      <span style={{ color: textColor }}>
                        $ {output.command}
                      </span>
                    </div>
                  )}
                  {output.output && (
                    <div
                      style={{
                        color: theme === "dark" ? "#cdd9e5" : "#24292f",
                      }}
                    >
                      {output.output}
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Input Prompt */}
            {!isMobile && (
              <div className="flex items-center gap-1 mt-4">
                <span style={{ color: "#3fb950" }}>Abdullah@portfolio</span>
                <span style={{ color: textColor }}>:</span>
                <span style={{ color: "#58a6ff" }}>~</span>
                <span style={{ color: textColor }}>$</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  autoFocus
                  className="flex-1 bg-transparent outline-none ml-1"
                  style={{ color: textColor, caretColor: "#3fb950" }}
                  placeholder=""
                />
              </div>
            )}
          </div>

          {/* Command Buttons - Mobile & Desktop */}
          <div
            className="p-4 border-t flex flex-wrap gap-2 justify-center"
            style={{ borderColor }}
          >
            {[
              "about",
              "projects",
              "skills",
              "contact",
              "resume",
              "help",
              "clear",
            ].map((cmd) => (
              <button
                key={cmd}
                onClick={() => executeCommand(cmd)}
                className="px-3 py-1 text-xs border rounded font-mono transition hover:bg-opacity-10 hover:bg-green-400"
                style={{
                  borderColor: "#3fb950",
                  color: "#3fb950",
                  backgroundColor: theme === "dark" ? "#0d1117" : "#f6f8fa",
                }}
              >
                $ {cmd}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Footer Comment */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-6 text-xs"
          style={{ color: theme === "dark" ? "#8b949e" : "#57606a" }}
        >
          # built with love & caffeine ☕
        </motion.div>
      </div>
    </div>
  );
}

// Command Output Components
function HelpOutput() {
  const commands = [
    { name: "about", desc: "Display your profile & bio" },
    { name: "projects", desc: "Show all portfolio projects" },
    { name: "skills", desc: "Display technical skills" },
    { name: "contact", desc: "Get contact information" },
    { name: "resume", desc: "View and download resume (PDF)" },
    { name: "clear", desc: "Clear the terminal" },
    { name: "theme light/dark", desc: "Toggle theme" },
    { name: "help", desc: "Show this help menu" },
  ];

  return (
    <div>
      <div
        style={{ color: "#d2a8ff", fontWeight: "bold", marginBottom: "8px" }}
      >
        Available Commands:
      </div>
      <div className="grid grid-cols-2 gap-4 text-sm">
        {commands.map((cmd, i) => (
          <div key={i}>
            <span style={{ color: "#58a6ff" }}>{cmd.name}</span>
            <span style={{ color: "#8b949e" }}> — {cmd.desc}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AboutOutput() {
  return (
    <div>
      <div>
        <span style={{ color: "#3fb950" }}>→</span>{" "}
        <span style={{ color: "#a5d6ff" }}>Abdullah Mohamed Hussien</span>
      </div>
      <div>
        <span style={{ color: "#3fb950" }}>→</span>{" "}
        <span style={{ color: "#a5d6ff" }}>Next.js Front-end Developer</span>
      </div>
      <div>
        <span style={{ color: "#3fb950" }}>→</span> Based in{" "}
        <span style={{ color: "#a5d6ff" }}>Giza, Egypt</span> · Open to work
      </div>
      <div>
        <span style={{ color: "#3fb950" }}>→</span> Building high-performance,
        scalable web applications
      </div>
      <div style={{ marginTop: "12px", color: "#8b949e", fontSize: "13px" }}>
        <div>
          Skilled Next.js Web Developer with experience building scalable,
        </div>
        <div>
          high-performance web applications for clients. Strong background in
        </div>
        <div>
          modern front-end development, API integration, and performance
        </div>
        <div>
          optimization with maintainable solutions aligned with business goals.
        </div>
      </div>
      <div style={{ marginTop: "8px" }}>
        <span style={{ color: "#f78166" }}>status:</span>{" "}
        <span style={{ color: "#3fb950" }}>● available for hire</span>
      </div>
    </div>
  );
}

function ProjectsOutput() {
  const projects = [
    {
      name: "SinceToonz",
      desc: "E-learning platform built and maintained with reusable, responsive UI components.",
      tags: ["Next.js", "React", "REST APIs", "Authentication"],
      demo: "https://sciencetoonz.com/",
    },
    {
      name: "Adepti",
      desc: "HR management platform focusing on skill matching and candidate evaluation workflows.",
      tags: ["Next.js", "React", "REST APIs", "Dynamic Components"],
      demo: "https://www.adepti.ai/",
    },
    {
      name: "Krakenz LMS",
      desc: "Courses platform with admin, instructor, and learner interfaces built using Next.js.",
      tags: ["Next.js", "React", "Responsive UI", "Role-based Workflows"],
      demo: "",
    },
    {
      name: "Edu Tactic",
      desc: "An AI studying tool project designed to enhance learning experiences.",
      tags: ["AI", "Education", "Next.js"],
      demo: "https://edu-tactic.vercel.app",
    },
    {
      name: "RAG Bot",
      desc: "A chat bot with RAG (Retrieval-Augmented Generation) capabilities.",
      tags: ["AI", "RAG", "Chatbot"],
      demo: "https://abdullah-rag-bot.vercel.app/",
    },
  ];

  return (
    <div>
      {projects.map((proj, i) => (
        <div
          key={i}
          className="mb-4 pb-4 border-b border-gray-700 last:border-0"
        >
          <div style={{ color: "#58a6ff", fontWeight: "bold" }}>
            ▸ {proj.name}
          </div>
          <div style={{ color: "#8b949e", marginTop: "4px" }}>{proj.desc}</div>
          <div className="flex gap-2 flex-wrap mt-3">
            {proj.tags.map((tag, j) => (
              <span
                key={j}
                className="px-2 py-1 text-xs rounded border"
                style={{ color: "#58a6ff", borderColor: "#58a6ff" }}
              >
                {tag}
              </span>
            ))}
          </div>
          {proj.demo ? (
            <div className="mt-2 flex gap-4 text-xs">
              <a
                href={proj.demo}
                style={{ color: "#3fb950" }}
                className="hover:underline"
              >
                [live demo]
              </a>
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}

function SkillsOutput() {
  const skills = {
    languages: ["JavaScript", "Python", "C#", "C++", "Dart", "SQL"],
    frameworks: ["React Js", "Next.js", "Node.js", "Flutter"],
  };

  return (
    <div className="font-mono text-sm" style={{ color: "#a5d6ff" }}>
      <div>{"{"}</div>
      {Object.entries(skills).map(([category, items], i) => (
        <div key={i} style={{ paddingLeft: "16px" }}>
          <span style={{ color: "#79c0ff" }}>"{category}"</span>
          <span style={{ color: "#a5d6ff" }}>: [</span>
          <div style={{ paddingLeft: "16px" }}>
            {items.map((item, j) => (
              <div key={j}>
                <span style={{ color: "#a5d6ff" }}>"{item}"</span>
                {j < items.length - 1 && (
                  <span style={{ color: "#a5d6ff" }}>,</span>
                )}
              </div>
            ))}
          </div>
          <span style={{ color: "#a5d6ff" }}>
            ]{i < Object.entries(skills).length - 1 ? "," : ""}
          </span>
        </div>
      ))}
      <div>{"}"}</div>
    </div>
  );
}

function ContactOutput() {
  return (
    <div>
      <div style={{ color: "#3fb950" }}>✔ Initiating contact protocol...</div>
      <div style={{ marginTop: "8px" }}>
        <div>
          <span style={{ color: "#f78166" }}>email</span>
          <span style={{ color: "#8b949e" }}> →</span>{" "}
          <a
            href="mailto:abdo251108@gmail.com"
            style={{ color: "#58a6ff" }}
            className="hover:underline"
          >
            abdo251108@gmail.com
          </a>
        </div>
        <div>
          <span style={{ color: "#f78166" }}>phone</span>
          <span style={{ color: "#8b949e" }}> →</span>{" "}
          <a
            href="tel:+201005497891"
            style={{ color: "#58a6ff" }}
            className="hover:underline"
          >
            +20 100 5497891
          </a>
        </div>
        <div>
          <span style={{ color: "#f78166" }}>website</span>
          <span style={{ color: "#8b949e" }}> →</span>{" "}
          <a
            href="https://abdullah-mohamed.vercel.app"
            style={{ color: "#58a6ff" }}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            abdullah-mohamed.vercel.app
          </a>
        </div>
        <div>
          <span style={{ color: "#f78166" }}>location</span>
          <span style={{ color: "#8b949e" }}> →</span>{" "}
          <span style={{ color: "#58a6ff" }}>Giza, Egypt</span>
        </div>
      </div>
      <div style={{ marginTop: "8px", color: "#8b949e" }}>
        Response time: &lt; 24 hours
      </div>
    </div>
  );
}

function ResumeOutput() {
  return (
    <div>
      <div style={{ color: "#3fb950" }}>→ Loading resume...</div>
      <div style={{ marginTop: "12px", marginBottom: "8px" }}>
        <div style={{ color: "#79c0ff", fontWeight: "bold" }}>
          Abdullah Mohamed Hussien
        </div>
        <div style={{ color: "#8b949e", fontSize: "13px" }}>
          Next.js Front-end Developer | abdo251108@gmail.com | +20 100 5497891 |
          Giza/Egypt
        </div>
      </div>
      <div style={{ marginTop: "8px", color: "#a5d6ff", fontSize: "13px" }}>
        <div style={{ color: "#79c0ff", marginTop: "8px", fontWeight: "bold" }}>
          Summary
        </div>
        <div style={{ color: "#8b949e" }}>
          Skilled Next.js Web Developer with experience building scalable,
          high-performance web applications for clients. Strong background in
          modern front-end development, API integration, and performance
          optimization.
        </div>
      </div>
      <div style={{ marginTop: "8px", color: "#a5d6ff", fontSize: "13px" }}>
        <div style={{ color: "#79c0ff", marginTop: "8px", fontWeight: "bold" }}>
          Professional Experience
        </div>
        <div style={{ color: "#79c0ff" }}>
          Next.js Developer, Gentech (2023 – Present)
        </div>
        <div style={{ color: "#8b949e" }}>
          Cairo, Egypt · Developing high-performance web applications using
          Next.js and React, turning business requirements into scalable,
          user-friendly solutions.
        </div>
      </div>
      <div style={{ marginTop: "12px", color: "#58a6ff", textAlign: "center" }}>
        <a
          href="/resume.pdf"
          download
          className="hover:underline"
          style={{ color: "#3fb950", fontWeight: "bold" }}
        >
          [⬇ download resume.pdf]
        </a>
      </div>
    </div>
  );
}

function HiredOutput() {
  return (
    <div className="text-center">
      <div
        style={{
          color: "#3fb950",
          fontWeight: "bold",
          fontSize: "16px",
          marginTop: "8px",
        }}
      >
        {"█████████████████████████████████████████"}
        <br />
        {"█ HIRED! 🚀                           █"}
        <br />
        {"█ Great choice. Let's build something █"}
        <br />
        {"█ amazing together.                  █"}
        <br />
        {"█████████████████████████████████████████"}
      </div>
    </div>
  );
}
