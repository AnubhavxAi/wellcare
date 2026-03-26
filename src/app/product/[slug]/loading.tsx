export default function ProductLoading() {
  return (
    <div
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "32px 16px",
      }}
    >
      {/* Skeleton loader for product page */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "48px",
        }}
      >
        <div
          style={{
            height: "400px",
            background: "#F3F4F6",
            borderRadius: "16px",
            animation: "pulse 2s infinite",
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          {[200, 100, 150, 80, 200].map((w, i) => (
            <div
              key={i}
              style={{
                height: "20px",
                width: `${w}px`,
                background: "#F3F4F6",
                borderRadius: "4px",
                animation: "pulse 2s infinite",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
