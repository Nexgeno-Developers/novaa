'use client';

import { Provider } from "react-redux";
import { store } from "@/redux";

interface ClientWrapperProps {
  children: React.ReactNode;
}

export default function ClientWrapper({ children }: ClientWrapperProps) {
  return <Provider store={store}>{children}</Provider>;
}
