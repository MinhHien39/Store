"use client";

import React from "react";
import { MessageCircle } from "lucide-react";

const MESSENGER_URL = "https://m.me/xh.456789";

const FloatingMessenger: React.FC = () => {
    return (
        <a
            href={MESSENGER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-[0_18px_36px_rgba(37,99,235,0.32)] transition hover:-translate-y-1 hover:bg-blue-700 hover:shadow-[0_24px_48px_rgba(37,99,235,0.4)]"
            style={{ animation: "float-soft 3.4s ease-in-out infinite" }}
            aria-label="Contact via Messenger"
        >
            <MessageCircle size={26} />
        </a>
    );
};

export default FloatingMessenger;
