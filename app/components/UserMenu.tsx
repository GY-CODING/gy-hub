"use client";
import { LogIn, LogOut, User as UserIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

interface UserProfile {
  id: string;
  username: string;
  email: string;
  phoneNumber?: string;
  roles?: string[];
  apiKey?: string;
  picture?: string;
  biography?: string;
}

export function UserMenu() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch user profile from /api/auth/me
    fetch("/api/auth/me")
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          setUser(null);
        }
      })
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
        <div className="size-8 rounded-full bg-white/10 animate-pulse" />
        <div className="h-4 w-20 bg-white/10 rounded animate-pulse" />
      </div>
    );
  }

  if (!user) {
    return (
      <button
        onClick={() => (window.location.href = "/auth/login")}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 border border-primary/20 transition-colors cursor-pointer"
      >
        <LogIn className="size-4" />
        <span className="text-sm font-medium">Iniciar sesión</span>
      </button>
    );
  }

  return (
    <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors group">
      {user.picture ? (
        <Image
          src={user.picture}
          alt={user.username || "User"}
          width={40}
          height={40}
          className="rounded-full object-cover border-3 border-primary/50 ring-2 ring-primary/30"
        />
      ) : (
        <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center border-3 border-primary/50 ring-2 ring-primary/30">
          <UserIcon className="size-6 text-primary" />
        </div>
      )}
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-semibold">{user.username}</span>
      </div>

      <button
        onClick={() => (window.location.href = "/auth/logout")}
        className="ml-2 p-2 rounded-lg bg-transparent hover:bg-destructive/20 border border-transparent hover:border-destructive/30 transition-all cursor-pointer group-hover:opacity-100 opacity-60"
        title="Cerrar sesión"
      >
        <LogOut className="size-4 text-destructive" />
      </button>
    </div>
  );
}
