export default function SearchBar({ value, onChange, placeholder, className = "" }) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full rounded-xl border border-white/10 bg-[rgba(31,31,43,0.65)] px-4 py-3 text-white placeholder-white/30 backdrop-blur-md transition focus:border-[var(--f1-red)] focus:outline-none focus:ring-2 focus:ring-[var(--f1-red)]/40 ${className}`}
    />
  );
}
