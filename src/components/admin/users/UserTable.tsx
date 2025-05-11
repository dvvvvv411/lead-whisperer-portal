
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
import { Calendar, Check, X, Wallet } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { CreditEditDialog } from "./CreditEditDialog";

export interface User {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  role: string;
  activated: boolean;
  credit?: number | null;
}

interface UserTableProps {
  users: User[];
  onUserUpdated: () => void;
}

export const UserTable = ({ users, onUserUpdated }: UserTableProps) => {
  const { toast } = useToast();
  const [processing, setProcessing] = useState<string | null>(null);
  const [editingCredit, setEditingCredit] = useState<User | null>(null);

  const toggleUserRole = async (userId: string, currentRole: string) => {
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

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>E-Mail</TableHead>
            <TableHead>Rolle</TableHead>
            <TableHead>Aktiviert</TableHead>
            <TableHead>Guthaben</TableHead>
            <TableHead>Registriert am</TableHead>
            <TableHead>Letzter Login</TableHead>
            <TableHead className="text-right">Aktionen</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-6">
                Keine Benutzer gefunden
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant={user.role === "admin" ? "default" : "outline"}>
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  {user.activated ? (
                    <Check className="h-5 w-5 text-green-500" />
                  ) : (
                    <X className="h-5 w-5 text-red-500" />
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Wallet className="mr-2 h-4 w-4 text-gray-500" />
                    {user.credit !== undefined ? `${user.credit.toFixed(2)}€` : "-"}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                    {user.created_at ? format(new Date(user.created_at), 'dd.MM.yyyy') : '-'}
                  </div>
                </TableCell>
                <TableCell>
                  {user.last_sign_in_at ? format(new Date(user.last_sign_in_at), 'dd.MM.yyyy') : '-'}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingCredit(user)}
                    >
                      Guthaben
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={processing === user.id}
                      onClick={() => toggleUserRole(user.id, user.role)}
                    >
                      {user.role === "admin" ? "Zum Benutzer" : "Zum Admin"}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
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
    </div>
  );
};
