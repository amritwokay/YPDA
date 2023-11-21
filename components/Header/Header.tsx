import Link from "next/link";
import Github from "../Logo";
import ThemeButton from "../ThemeButton";
import { useTheme } from "next-themes";
import {useAuthenticator} from '@aws-amplify/ui-react';

export const Header = ({ className }: { className?: string }) => {
  const { resolvedTheme } = useTheme();
  const { signOut } = useAuthenticator();
  const svgFillColor = resolvedTheme === "dark" ? "#D8D8D8" : "black";
  const btnBgColor =
    resolvedTheme === "dark"
      ? "dark-button-w-gradient-border"
      : "light-button-w-gradient-border";

  return (
    <header className="flex flex-col sm:flex-row sm:justify-between w-full pt-4 pb-8 px-2">
      <Link href="/" className="flex flex-col">
        <h1 className="font-montserrat font-bold sm:text-xl tracking-tight">DataPrompters</h1>
        <p className="font-mono font-bold text-gray-600">
          Insights Delayed Are Opportunities Decayed
        </p>
      </Link>
      <div className="absolute top-2.5 right-2.5">
        <button onClick={() => signOut()}>
          <b>Sign Out</b>
        </button>
      </div>      
    </header>
  );
};

