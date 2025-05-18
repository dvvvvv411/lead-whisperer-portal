
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Clipboard, X, Send, Trash2, CheckCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface ChatId {
  id: string;
  chat_id: string;
  description: string | null;
  created_at: string;
}

interface TelegramChatIdDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TelegramChatIdDialog({ open, onOpenChange }: TelegramChatIdDialogProps) {
  const { toast } = useToast();
  const [chatIds, setChatIds] = useState<ChatId[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [newChatId, setNewChatId] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (open) {
      fetchChatIds();
    }
  }, [open]);

  const fetchChatIds = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("telegram_chat_ids")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) throw error;
      setChatIds(data || []);
    } catch (error: any) {
      toast({
        title: "Fehler",
        description: `Fehler beim Laden der Chat-IDs: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddChatId = async () => {
    if (!newChatId) {
      toast({
        title: "Eingabefehler",
        description: "Bitte geben Sie eine Chat-ID ein.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("telegram_chat_ids")
        .insert([
          {
            chat_id: newChatId,
            description: description || null,
          },
        ])
        .select();

      if (error) {
        if (error.code === "23505") {
          // Unique constraint violation
          toast({
            title: "Fehler",
            description: "Diese Chat-ID existiert bereits.",
            variant: "destructive",
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: "Erfolgreich",
          description: "Telegram Chat-ID wurde hinzugefügt.",
        });
        setNewChatId("");
        setDescription("");
        await fetchChatIds();
      }
    } catch (error: any) {
      toast({
        title: "Fehler",
        description: `Fehler beim Hinzufügen: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteChatId = async (id: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from("telegram_chat_ids")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Erfolgreich",
        description: "Telegram Chat-ID wurde gelöscht.",
      });
      await fetchChatIds();
    } catch (error: any) {
      toast({
        title: "Fehler",
        description: `Fehler beim Löschen: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestNotification = async (chatId: string) => {
    try {
      setIsSending(true);
      
      const { data, error } = await supabase.functions.invoke('simple-telegram-alert', {
        body: {
          type: 'test',
          chatId: chatId, // Specific chat ID to test
          message: 'Test Nachricht von der Admin Oberfläche'
        }
      });
      
      if (error) throw error;
      
      if (data?.success) {
        toast({
          title: "Test erfolgreich",
          description: "Die Testnachricht wurde erfolgreich gesendet.",
        });
      } else {
        throw new Error(data?.error || 'Unbekannter Fehler');
      }
    } catch (error: any) {
      toast({
        title: "Fehler",
        description: `Fehler beim Senden der Testnachricht: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-casino-card border border-gold/20 sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-gold">Telegram Chat-IDs verwalten</DialogTitle>
          <DialogDescription className="text-gray-300">
            Fügen Sie Telegram Chat-IDs hinzu, um Benachrichtigungen an mehrere Empfänger zu senden.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Form to add new chat ID */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-200">Neue Chat-ID hinzufügen</h3>
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="chatId">Chat-ID</Label>
                <Input
                  id="chatId"
                  placeholder="z.B. 123456789"
                  value={newChatId}
                  onChange={(e) => setNewChatId(e.target.value)}
                  className="bg-casino-darker border-gold/20 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Beschreibung (optional)</Label>
                <Input
                  id="description"
                  placeholder="z.B. Marketing Team"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="bg-casino-darker border-gold/20 text-white"
                />
              </div>
              <Button 
                onClick={handleAddChatId} 
                disabled={isLoading || !newChatId}
                className="bg-gold/80 hover:bg-gold text-black font-medium"
              >
                Chat-ID hinzufügen
              </Button>
            </div>
          </div>

          <Separator className="bg-gold/20" />

          {/* List of existing chat IDs */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-200">Vorhandene Chat-IDs</h3>
            {isLoading ? (
              <div className="py-4 text-center text-gray-400">Laden...</div>
            ) : chatIds.length === 0 ? (
              <div className="py-4 text-center text-gray-400">Keine Chat-IDs vorhanden.</div>
            ) : (
              <div className="space-y-3">
                {chatIds.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center justify-between p-3 bg-casino-darker rounded-md border border-gold/10"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-200">{item.chat_id}</p>
                      {item.description && (
                        <p className="text-sm text-gray-400">{item.description}</p>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleTestNotification(item.chat_id)}
                        disabled={isSending}
                        className="border-blue-500/30 bg-blue-900/20 text-blue-400 hover:bg-blue-900/30 hover:text-blue-300"
                        title="Test senden"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteChatId(item.id)}
                        disabled={isLoading}
                        className="border-red-500/30 bg-red-900/20 text-red-400 hover:bg-red-900/30 hover:text-red-300"
                        title="Löschen"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            Schließen
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
