import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { UserPlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";

interface CreateAccountFormData {
  name: string;
  email: string;
  password: string;
  leadId: string;
}

interface CreateAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: CreateAccountFormData;
  onFormDataChange: (data: Partial<CreateAccountFormData>) => void;
  onSuccess: () => void;
}

export const CreateAccountDialog = ({ 
  open, 
  onOpenChange,
  formData, 
  onFormDataChange,
  onSuccess
}: CreateAccountDialogProps) => {
  const { toast } = useToast();
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [accountCreationSuccess, setAccountCreationSuccess] = useState(false);
  
  const handleCreateAccount = async () => {
    try {
      setIsCreatingAccount(true);
      
      // 1. Store the admin's current session
      const { data: adminSession } = await supabase.auth.getSession();
      if (!adminSession?.session) {
        throw new Error("Admin session not found");
      }
      
      // 2. Create the new user account with admin auth client
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: formData.email,
        password: formData.password,
        email_confirm: true,
        user_metadata: {
          name: formData.name
        }
      });
      
      if (authError) {
        throw authError;
      }
      
      // 3. Add user role if account created successfully
      if (authData?.user) {
        // Set up their role
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert([{
            user_id: authData.user.id,
            role: 'user'
          }]);
          
        if (roleError) {
          throw roleError;
        }
        
        // 4. Update lead status
        const { error: leadError } = await supabase
          .from('leads')
          .update({ status: 'akzeptiert' })
          .eq('id', formData.leadId);
          
        if (leadError) {
          throw leadError;
        }
        
        // 5. Make sure we stay logged in as the admin
        await supabase.auth.setSession({
          access_token: adminSession.session.access_token,
          refresh_token: adminSession.session.refresh_token
        });
        
        setAccountCreationSuccess(true);
      }
    } catch (error: any) {
      console.error("Fehler beim Erstellen des Benutzerkontos:", error);
      toast({
        title: "Fehler",
        description: error?.message || "Der Benutzeraccount konnte nicht erstellt werden.",
        variant: "destructive"
      });
    } finally {
      setIsCreatingAccount(false);
    }
  };

  const resetAndClose = () => {
    setAccountCreationSuccess(false);
    onSuccess();
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        {!accountCreationSuccess ? (
          <>
            <AlertDialogHeader>
              <AlertDialogTitle>Benutzerkonto erstellen</AlertDialogTitle>
              <AlertDialogDescription>
                Erstellen Sie ein Benutzerkonto für diesen Lead. Der Lead wird automatisch als akzeptiert markiert.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => onFormDataChange({name: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => onFormDataChange({email: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="password" className="text-right">
                  Passwort
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => onFormDataChange({password: e.target.value})}
                  className="col-span-3"
                />
              </div>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isCreatingAccount}>Abbrechen</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleCreateAccount}
                disabled={!formData.email || !formData.password || !formData.name || isCreatingAccount}
              >
                {isCreatingAccount ? "Wird erstellt..." : "Konto erstellen"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </>
        ) : (
          <>
            <AlertDialogHeader>
              <AlertDialogTitle>Benutzerkonto erfolgreich erstellt</AlertDialogTitle>
              <AlertDialogDescription>
                Das Benutzerkonto wurde erfolgreich erstellt und der Lead als akzeptiert markiert.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="py-4">
              <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <UserPlus className="h-5 w-5 mr-2" />
                  <p className="font-medium">Account für {formData.name} erstellt</p>
                </div>
                <p>Email: {formData.email}</p>
              </div>
            </div>
            <AlertDialogFooter>
              <AlertDialogAction onClick={resetAndClose}>
                Schließen
              </AlertDialogAction>
            </AlertDialogFooter>
          </>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
};
