'use client';

import { useEffect, useState } from "react";
import Loading from "./common/Loading";

function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return isLoading ? <Loading /> : <>{children}</>;
}

export default ClientLayoutWrapper;
