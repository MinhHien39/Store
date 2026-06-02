"use client";

import { useEffect } from "react";
import { initVersionCheck } from "@/versionCheck";

export default function VersionCheckScript() {
  useEffect(() => {
    initVersionCheck();
  }, []);

  return null;
}
