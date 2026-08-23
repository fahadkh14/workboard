export default function Avatar({ name, color = "#5B5CE2", size = 32, status }) {
  const initials = (name || "?")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <span className="relative inline-flex flex-shrink-0" style={{ width: size, height: size }}>
      <span
        className="flex items-center justify-center rounded-full text-white font-semibold"
        style={{ width: size, height: size, background: color, fontSize: size * 0.38 }}
      >
        {initials}
      </span>
      {status && (
        <span
          className="absolute bottom-0 right-0 rounded-full border-2 border-surface"
          style={{
            width: size * 0.32,
            height: size * 0.32,
            background:
              status === "online" ? "var(--wb-success)" : status === "away" ? "var(--wb-warning)" : "var(--wb-muted)",
          }}
        />
      )}
    </span>
  );
}
