import { Button, IconLogOut } from "@supabase/ui";
import Link from "next/link";
import { client } from "src/libs/supabase";

export const Header = () => {
  return (
    <header className="flex fixed top-0 z-50 justify-between px-5 w-full h-6 bg-blue-900">
      <Link href="/">
        <a className="text-3xl">
          <h2 className="font-bold text-white shadow">-Title-</h2>
        </a>
      </Link>
      <div className="text-blue-600">
        <Button
          size="tiny"
          type="text"
          className="text-blue-600"
          icon={<IconLogOut />}
          onClick={() => {
            return client.auth.signOut();
          }}
        >
          Sign Out
        </Button>
      </div>
    </header>
  );
};
