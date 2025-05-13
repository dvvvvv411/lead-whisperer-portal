import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Trash2, Wallet, ArrowUp, ArrowDown, Phone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { CreditEditDialog } from "./CreditEditDialog";
import { motion } from "framer-motion";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export interface User {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  role: string;
  activated: boolean;
  credit?: number | null;
  phone?: string | null;
}

interface UserTableProps {
  users: User[];
  onUserUpdated: () => void;
  isLeadsOnlyUser?: boolean;
}

export const UserTable = ({ users, onUserUpdated, isLeadsOnlyUser = false }: UserTableProps) => {
  const { toast } = useToast();
  const [processing, setProcessing] = useState<string | null>(null);
  const [editingCredit, setEditingCredit] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const toggleUserRole = async (userId: string, currentRole: string) => {
    // Remove the restriction check for leads-only user
    try {
      setProcessing(userId);
      const newRole = currentRole === "admin" ? "user" : "admin";
      
      // Entfernen der alten Rolle - Konvertiere string zu app_role Enum
      await supabase.rpc('remove_user_role', {
        _user_id: userId,
        _role: currentRole as 'admin' | 'user'
      });
      
      // Hinzufügen der neuen Rolle - Konvertiere string zu app_role Enum
      await supabase.rpc('add_user_role', {
        _user_id: userId,
        _role: newRole as 'admin' | 'user'
      });
      
      toast({
        title: "Benutzerrolle aktualisiert",
        description: `Die Rolle wurde zu ${newRole} geändert.`,
      });
      
      onUserUpdated();
    } catch (error: any) {
      console.error("Fehler beim Ändern der Benutzerrolle:", error);
      toast({
        title: "Fehler",
        description: "Die Benutzerrolle konnte nicht aktualisiert werden: " + error.message,
        variant: "destructive"
      });
    } finally {
      setProcessing(null);
    }
  };

  const deleteUser = async (userId: string) => {
    // Remove the restriction check for leads-only user
    try {
      setProcessing(userId);
      
      // Instead of using RPC, we'll directly invoke the function using POST with the correct headers
      const { data, error } = await supabase.functions.invoke('delete-user', {
        body: { userId: userId }
      });
      
      if (error) throw error;
      
      toast({
        title: "Benutzer gelöscht",
        description: "Das Benutzerkonto wurde erfolgreich gelöscht.",
      });
      
      onUserUpdated();
      setUserToDelete(null);
    } catch (error: any) {
      console.error("Fehler beim Löschen des Benutzerkontos:", error);
      toast({
        title: "Fehler",
        description: "Das Benutzerkonto konnte nicht gelöscht werden: " + error.message,
        variant: "destructive"
      });
    } finally {
      setProcessing(null);
    }
  };

  // Handle sorting when user clicks on the credit column header
  const toggleSort = (field: string) => {
    if (sortField === field) {
      // If already sorting by this field, toggle direction
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // Set new sort field and default to descending (highest first)
      setSortField(field);
      setSortDirection("desc");
    }
  };

  // Sort users based on current sort field and direction
  const sortedUsers = [...users].sort((a, b) => {
    if (sortField === "credit") {
      const creditA = a.credit ?? 0;
      const creditB = b.credit ?? 0;
      
      return sortDirection === "asc" 
        ? creditA - creditB 
        : creditB - creditA;
    }
    
    // Default sort - keep original order
    return 0;
  });

  return (
    <div className="rounded-md">
      <Table className="border-collapse">
        <TableHeader className="bg-casino-darker">
          <TableRow className="border-gold/10">
            <TableHead className="text-gray-300">E-Mail</TableHead>
            <TableHead className="text-gray-300">Rolle</TableHead>
            <TableHead className="text-gray-300">Telefon</TableHead>
            <TableHead 
              className="text-gray-300 cursor-pointer hover:text-gold transition-colors"
              onClick={() => toggleSort("credit")}
            >
              <div className="flex items-center">
                Guthaben
                {sortField === "credit" && (
                  sortDirection === "asc" 
                    ? <ArrowUp className="ml-1 h-4 w-4" /> 
                    : <ArrowDown className="ml-1 h-4 w-4" />
                )}
              </div>
            </TableHead>
            <TableHead className="text-gray-300">Registriert am</TableHead>
            <TableHead className="text-gray-300">Letzter Login</TableHead>
            <TableHead className="text-right text-gray-300">Aktionen</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedUsers.length === 0 ? (
            <TableRow className="border-t border-gold/10">
              <TableCell colSpan={7} className="text-center py-6 text-gray-400">
                Keine Benutzer gefunden
              </TableCell>
            </TableRow>
          ) : (
            sortedUsers.map((user, index) => (
              <motion.tr 
                key={user.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="border-t border-gold/10 hover:bg-casino-highlight"
              >
                <TableCell className="text-gray-300">{user.email}</TableCell>
                <TableCell>
                  <Badge 
                    variant={user.role === "admin" ? "default" : "outline"} 
                    className={user.role === "admin" 
                      ? "bg-gold/30 text-gold border-gold/50" 
                      : "bg-gray-800/30 text-gray-300 border-gray-500/50"}
                  >
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  {user.phone ? (
                    <div className="flex items-center">
                      <Phone className="mr-2 h-4 w-4 text-blue-400" />
                      <span className="text-gray-300">{user.phone}</span>
                    </div>
                  ) : (
                    <span className="text-gray-500 text-sm">Nicht verfügbar</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Wallet className="mr-2 h-4 w-4 text-gold" />
                    <span className="text-gray-300">
                      {user.credit !== undefined ? `${user.credit.toFixed(2)}€` : "-"}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                    <span className="text-gray-400">
                      {user.created_at ? format(new Date(user.created_at), 'dd.MM.yyyy') : '-'}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-gray-400">
                  {user.last_sign_in_at ? format(new Date(user.last_sign_in_at), 'dd.MM.yyyy') : '-'}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-gold/10 border-gold/30 hover:bg-gold/20 text-gold"
                      onClick={() => setEditingCredit(user)}
                    >
                      Guthaben
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={processing === user.id || user.role === "admin"}
                      className="bg-red-900/20 border-red-500/30 hover:bg-red-800/30 text-red-400"
                      onClick={() => setUserToDelete(user)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </motion.tr>
            ))
          )}
        </TableBody>
      </Table>

      {editingCredit && (
        <CreditEditDialog
          isOpen={!!editingCredit}
          onClose={() => setEditingCredit(null)}
          userId={editingCredit.id}
          userEmail={editingCredit.email}
          currentCredit={editingCredit.credit || 0}
          onCreditUpdated={onUserUpdated}
        />
      )}

      <AlertDialog open={!!userToDelete} onOpenChange={(open) => !open && setUserToDelete(null)}>
        <AlertDialogContent className="bg-casino-card border border-gold/20">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gold">Benutzer löschen</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-300">
              Möchten Sie den Benutzer <span className="font-semibold text-white">{userToDelete?.email}</span> wirklich löschen? 
              <br />
              Diese Aktion kann nicht rückgängig gemacht werden. Alle Daten des Benutzers werden unwiderruflich gelöscht.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border border-gray-600 text-gray-300 hover:bg-gray-800">
              Abbrechen
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => userToDelete && deleteUser(userToDelete.id)}
              className="bg-red-900/50 border border-red-500/30 text-red-300 hover:bg-red-800/50 hover:text-red-200"
            >
              Löschen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
