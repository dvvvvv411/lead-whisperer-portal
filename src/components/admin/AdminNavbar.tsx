
import { Link } from "react-router-dom";
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from "../ui/menubar";

export const AdminNavbar = () => {
  return (
    <Menubar className="border-b mb-6 py-2 px-4 w-full">
      <MenubarMenu>
        <MenubarTrigger>Navigation</MenubarTrigger>
        <MenubarContent>
          <MenubarItem asChild>
            <Link to="/admin/leads">Leads</Link>
          </MenubarItem>
          <MenubarItem asChild>
            <Link to="/admin/crypto-wallets">Krypto Wallets</Link>
          </MenubarItem>
          <MenubarItem asChild>
            <Link to="/admin/users">Benutzer</Link>
          </MenubarItem>
          <MenubarItem asChild>
            <Link to="/admin/payments">Zahlungen</Link>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
};
