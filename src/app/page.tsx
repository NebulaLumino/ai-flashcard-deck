"use client";

import { useState } from "react";

export default function FlashcardDeckPage() {
  const [form, setForm] = useState({
    topic: "",
    numCards: "15",
    contentType: "Mixed",
    subject: "",
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.topic.trim()) return;
    setLoading(true);
    setError("");
    setResult("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");
      setResult(data.result);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 text-white">
      <div className="border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">AI Flashcard Deck Generator</h1>
            <p className="text-xs text-gray-400">Generate spaced repetition decks with memory tips &amp; study schedules</p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col lg:flex-row gap-8">
        {/* Form */}
        <div className="lg:w-2/5">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Topic <span className="text-red-400">*</span>
              </label>
              <input
                name="topic"
                value={form.topic}
                onChange={handleChange}
                placeholder="e.g. World War II, Organic Chemistry, Spanish Verbs"
                required
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Subject</label>
              <input
                name="subject"
                value={form.subject}
                onChange={handleChange}
                placeholder="e.g. History, Chemistry, Language"
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Number of Cards</label>
                <select
                  name="numCards"
                  value={form.numCards}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
                >
                  {[10, 15, 20, 25, 30, 40, 50].map(n => (
                    <option key={n}>{n}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Content Type</label>
                <select
                  name="contentType"
                  value={form.contentType}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
                >
                  {["Term/Definition", "Formula/Equation", "Concept/Explanation", "Mixed"].map(t => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-white bg-amber-600 hover:bg-amber-500 focus:ring-amber-500 transition-all duration-200 shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Generating Flashcard Deck…
                </span>
              ) : (
                "Generate Flashcard Deck"
              )}
            </button>

            {error && (
              <div className="p-3 bg-red-900/30 border border-red-700 rounded-xl text-red-300 text-sm">{error}</div>
            )}
          </form>

          <div className="mt-6 p-4 bg-amber-900/20 border border-amber-700/40 rounded-xl">
            <h3 className="text-sm font-semibold text-amber-400 mb-2">💡 Spaced Repetition Tip</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Cards are generated with SM-2 algorithm intervals. Review daily using Anki, Quizlet, or RemNote for optimal long-term retention. Reviewing at the right intervals prevents the forgetting curve.
            </p>
          </div>
        </div>

        {/* Output */}
        <div className="lg:w-3/5">
          {result ? (
            <div className="bg-gray-900 border border-gray-700 rounded-2xl overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-700 bg-gradient-to-r from-amber-900/40 to-amber-800/40 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-400" />
                <span className="text-sm font-medium text-gray-300">Generated Flashcard Deck</span>
              </div>
              <div className="p-6 overflow-auto max-h-[70vh]">
                <pre className="whitespace-pre-wrap text-sm text-gray-200 font-mono leading-relaxed">{result}</pre>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center min-h-[400px] border-2 border-dashed border-gray-700 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 rounded-2xl bg-amber-600/20 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-400 mb-2">Your flashcard deck will appear here</h3>
              <p className="text-sm text-gray-500 max-w-xs">Generate spaced repetition decks with memory tips, mnemonics, and SM-2 review schedules. Compatible with Anki, Quizlet, and RemNote.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
