import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import AdminNavbar from "./AdminNavbar";

const AdminRegister = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate inputs
    if (!email || !password || !passwordConfirm) {
      setError("Bitte füllen Sie alle Felder aus.");
      return;
    }
    
    if (password !== passwordConfirm) {
      setError("Die Passwörter stimmen nicht überein.");
      return;
    }
    
    if (password.length < 6) {
      setError("Das Passwort muss mindestens 6 Zeichen lang sein.");
      return;
    }
    
    setError("");
    setLoading(true);
    
    try {
      // Register the user with Supabase
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email,
        password: password,
      });
      
      if (signUpError) {
        throw signUpError;
      }
      
      if (data?.user) {
        // Add admin role to the user
        const { error: rolesError } = await supabase.rpc('add_user_role', { 
          _user_id: data.user.id, 
          _role: 'admin' 
        });
        
        if (rolesError) {
          throw rolesError;
        }
        
        setSuccess(true);
        toast({
          title: "Benutzer erstellt",
          description: "Der Admin-Benutzer wurde erfolgreich registriert.",
        });
      }
    } catch (error: any) {
      console.error("Fehler bei der Registrierung:", error);
      setError(error.message || "Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.");
      toast({
        title: "Fehler",
        description: "Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <AdminNavbar />
      
      <h1 className="text-3xl font-bold mb-6">Admin registrieren</h1>
      
      {success ? (
        <div className="bg-green-100 border-l-4 border-green-500 p-4 mb-4">
          <p className="text-green-700">
            Admin-Benutzer erfolgreich registriert. Der Benutzer kann sich jetzt anmelden.
          </p>
          <Button 
            onClick={() => window.location.href = "/admin/leads"} 
            className="mt-4"
          >
            Zurück zur Übersicht
          </Button>
        </div>
      ) : (
        <div className="max-w-md mx-auto">
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 p-4 mb-4">
              <p className="text-red-700">{error}</p>
            </div>
          )}
          
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">E-Mail</label>
              <Input 
                id="email"
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1">Passwort</label>
              <Input 
                id="password"
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <div>
              <label htmlFor="passwordConfirm" className="block text-sm font-medium mb-1">Passwort bestätigen</label>
              <Input 
                id="passwordConfirm"
                type="password" 
                value={passwordConfirm} 
                onChange={(e) => setPasswordConfirm(e.target.value)}
                required
              />
            </div>
            
            <Button 
              type="submit" 
              disabled={loading}
              className="w-full"
            >
              {loading ? "Wird registriert..." : "Registrieren"}
            </Button>
            
            <div className="text-center">
              <a href="/admin/leads" className="text-blue-600 hover:text-blue-800 text-sm">
                Zurück zur Übersicht
              </a>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminRegister;
