import { useEffect } from 'react';
import { useSystem } from "@/store/systemStore";

export function HeaderBar() {
  const { ping } = useSystem();
  useEffect(() => {
    const i = window.setInterval(ping, 30_000);
    window.addEventListener("online", () => useSystem.setState({ online: true }));
    window.addEventListener("offline", () => useSystem.setState({ online: false }));
    return () => window.clearInterval(i);
  }, [ping]);
  // ... остальной код ...
} 