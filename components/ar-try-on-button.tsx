'use client';

import { Button } from "@/components/ui/button";

export default function ARTryOnButton() {
  return (
    <Button
      size="lg"
      className="bg-purple-600 hover:bg-purple-700 text-white px-6 md:px-8 py-4 md:py-6 text-base md:text-lg rounded-full"
      onClick={() => {
        window.location.href = "/try-on?item=c8f7fd8f-4ed0-4f29-9c37-0fb1756a8046";
      }}
    >
      Try AR Experience
    </Button>
  );
} 