import type React from "react";

import { LogoutButton } from "./LogoutButton";

export const Navbar: React.FC = () => {
  return (
    <div className="navbar bg-primary shadow-sm text-primary-content">
      <div className="flex-1">
        <div className="flex">
          <img
            src="/icon.png"
            alt="PDS WebUI Icon"
            className="h-8 w-8 mr-2 brightness-0"
          />
          <span className="text-xl font-bold">PDS Admin</span>
        </div>
      </div>
      <LogoutButton />
    </div>
  );
};
