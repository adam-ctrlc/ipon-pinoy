"use client";
import { useState } from "react";

export function useHoneypot() {
  const [honeypot, setHoneypot] = useState("");

  const HoneypotField = () => (
    <div
      style={{ opacity: 0, position: "absolute", top: 0, left: 0, height: 0, width: 0, zIndex: -1, overflow: "hidden" }}
      aria-hidden="true"
    >
      <label htmlFor="website">
        Website
        <input
          type="text"
          id="website"
          name="website"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
        />
      </label>
    </div>
  );

  return {
    honeypot,
    HoneypotField,
    getHoneypotData: () => ({ website: honeypot }),
  };
}

export default useHoneypot;
