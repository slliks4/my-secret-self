import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { questions } from "@/data/questions";
import landingImg from "@/assets/landing.png.asset.json";
import avatar1 from "@/assets/avatar1.png.asset.json";
import avatar2 from "@/assets/avatar2.png.asset.json";
import resultsImg from "@/assets/results.png.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "The Interrogation 💌 — 50 Questions" },
      { name: "description", content: "A fun, flirty 50-question quiz to get to know each other." },
      { property: "og:title", content: "The Interrogation 💌" },
      { property: "og:description", content: "A fun, flirty 50-question quiz to get to know each other." },
    ],
  }),
  component: Index,
});

type Stage = "landing" | "quiz" | "results";

function Index() {
  const [stage, setStage] = useState<Stage>("landing");
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [draft, setDraft] = useState("");
  const [fade, setFade] = useState(false);

  const q = questions[index];
  const total = questions.length;
  const progress = ((index + (stage === "results" ? 1 : 0)) / total) * 100;

  const advance = (value: string) => {
    if (!value.trim()) return;
    const next = { ...answers, [q.id]: value };
    setAnswers(next);
    setDraft("");
    setFade(true);
    setTimeout(() => {
      if (index + 1 >= total) setStage("results");
      else setIndex(index + 1);
      setFade(false);
    }, 200);
  };

  const restart = () => {
    setStage("landing");
    setIndex(0);
    setAnswers({});
    setDraft("");
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-pink-400 via-fuchsia-500 to-indigo-600 text-white">
      <div className="mx-auto flex min-h-screen max-w-2xl flex-col px-5 py-8 sm:py-12">
        {stage === "landing" && (
          <div className="m-auto text-center animate-[fadeIn_0.6s_ease]">
            <div className="mb-6 text-7xl sm:text-8xl">💌</div>
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight drop-shadow-lg">
              The Interrogation
            </h1>
            <p className="mx-auto mt-4 max-w-md text-base sm:text-lg text-white/90">
              50 questions. Zero filter. Let's see who you really are. 😏
            </p>
            <button
              onClick={() => setStage("quiz")}
              className="mt-10 rounded-full bg-white px-8 py-4 text-lg font-bold text-fuchsia-600 shadow-2xl transition-all hover:scale-105 hover:shadow-pink-300/50 active:scale-95"
            >
              Start the Interrogation →
            </button>
          </div>
        )}

        {stage === "quiz" && (
          <>
            <div className="mb-8">
              <div className="mb-2 flex items-center justify-between text-sm font-medium text-white/90">
                <span>Question {index + 1} of {total}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-white/20 backdrop-blur">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-yellow-300 to-pink-200 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div
              key={q.id}
              className={`m-auto w-full rounded-3xl bg-white/15 p-6 sm:p-10 backdrop-blur-xl shadow-2xl ring-1 ring-white/20 transition-all duration-200 ${
                fade ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
              }`}
            >
              <h2 className="text-2xl sm:text-3xl font-bold leading-snug">
                {q.text}
              </h2>

              {q.type === "choice" && q.options ? (
                <div className="mt-8 grid gap-3">
                  {q.options.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => advance(opt)}
                      className="rounded-2xl bg-white/90 px-5 py-4 text-left text-base font-semibold text-fuchsia-700 shadow-lg transition-all hover:scale-[1.02] hover:bg-white active:scale-[0.99]"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    advance(draft);
                  }}
                  className="mt-8 space-y-4"
                >
                  <textarea
                    autoFocus
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder="Type your answer..."
                    rows={3}
                    className="w-full resize-none rounded-2xl bg-white/95 p-4 text-base text-slate-800 placeholder:text-slate-400 shadow-inner outline-none ring-2 ring-transparent focus:ring-yellow-300"
                  />
                  <button
                    type="submit"
                    disabled={!draft.trim()}
                    className="w-full rounded-full bg-gradient-to-r from-yellow-300 to-pink-300 px-6 py-3 text-lg font-bold text-fuchsia-800 shadow-lg transition-all hover:scale-[1.02] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
                  >
                    {index + 1 === total ? "Finish 💖" : "Next →"}
                  </button>
                </form>
              )}
            </div>

            {index > 0 && (
              <button
                onClick={() => setIndex(index - 1)}
                className="mx-auto mt-6 text-sm text-white/80 underline-offset-4 hover:underline"
              >
                ← Back
              </button>
            )}
          </>
        )}

        {stage === "results" && (
          <div className="m-auto w-full text-center animate-[fadeIn_0.6s_ease]">
            <div className="mb-4 text-7xl sm:text-8xl">🎉</div>
            <h1 className="text-4xl sm:text-5xl font-extrabold drop-shadow-lg">
              You survived all 50!
            </h1>
            <p className="mx-auto mt-3 max-w-md text-white/90">
              That's <span className="font-bold">{Object.keys(answers).length}</span> answers
              of pure honesty. Score: <span className="font-bold">10/10 vibes ✨</span>
            </p>

            <div className="mt-8 max-h-[55vh] overflow-y-auto rounded-3xl bg-white/15 p-5 sm:p-6 text-left backdrop-blur-xl ring-1 ring-white/20">
              {questions.map((qq, i) => (
                <div key={qq.id} className="mb-4 border-b border-white/15 pb-3 last:mb-0 last:border-0 last:pb-0">
                  <p className="text-xs font-semibold uppercase tracking-wide text-yellow-200">
                    Q{i + 1}
                  </p>
                  <p className="text-sm font-medium text-white/90">{qq.text}</p>
                  <p className="mt-1 text-base font-semibold text-white">
                    → {answers[qq.id] || <span className="italic opacity-60">skipped</span>}
                  </p>
                </div>
              ))}
            </div>

            <button
              onClick={restart}
              className="mt-8 rounded-full bg-white px-8 py-4 text-lg font-bold text-fuchsia-600 shadow-2xl transition-all hover:scale-105 active:scale-95"
            >
              Do it again 💘
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
