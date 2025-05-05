export default function TabSwitcher({ tab, setTab }) {
    return ["private", "public"].map((t) => (
      <button
        key={t}
        onClick={() => setTab(t)}
        className={`flex items-center gap-2 mb-6 h-10 px-3 rounded-r-full transition-colors
          ${tab === t
            ? "bg-[#FBF8F5] text-[#5f360a] font-semibold border-l-4 border-[#5f360a]"
            : "text-[#704214] border-l-2 border-[#a1724c] hover:bg-[#FBF8F5]"}`}
      >
        <span>{t === "private" ? "👤" : "🧑‍🤝‍🧑"}</span>{t}
      </button>
    ));
  }
  