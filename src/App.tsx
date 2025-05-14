import { useState } from "react";

export function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h1>Vite + React</h1>
      <button onClick={() => setCount((count) => count + 1)}>
        count is {count}
      </button>
    </div>
  );
}
