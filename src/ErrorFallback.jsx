export default function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div
      style={{
        padding: 20,
        background: "#111",
        color: "red",
        minHeight: "100vh",
        fontFamily: "monospace",
      }}
    >
      <h1>Application Crashed 🚨</h1>

      <h2>Error:</h2>

      <pre
        style={{
          whiteSpace: "pre-wrap",
          background: "#222",
          padding: 10,
          borderRadius: 5,
        }}
      >
        {error?.message}
      </pre>

      <h2>Stack Trace:</h2>

      <pre
        style={{
          whiteSpace: "pre-wrap",
          background: "#222",
          padding: 10,
          borderRadius: 5,
        }}
      >
        {error?.stack}
      </pre>

      <button
        onClick={resetErrorBoundary}
        style={{
          marginTop: 20,
          padding: "10px 20px",
          cursor: "pointer",
        }}
      >
        Reload
      </button>
    </div>
  );
}
