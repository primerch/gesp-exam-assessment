"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export default function useMounted() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
