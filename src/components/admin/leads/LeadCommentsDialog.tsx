
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";

interface Comment {
  id: string;
  lead_id: string;
  created_at: string;
  content: string;
  user_email: string;
}

interface Lead {
  id: string;
  name: string;
}

interface LeadCommentsDialogProps {
  lead: Lead;
  comments: Comment[];
  onCommentAdded: (newComment: Comment) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userEmail: string;
}

export const LeadCommentsDialog = ({
  lead,
  comments,
  onCommentAdded,
  open,
  onOpenChange,
  userEmail
}: LeadCommentsDialogProps) => {
  const { toast } = useToast();
  const [newComment, setNewComment] = useState("");

  const handleAddComment = async () => {
    if (!newComment.trim() || !userEmail) {
      return;
    }

    try {
      const { data, error } = await supabase
        .from('comments')
        .insert([
          { 
            lead_id: lead.id,
            content: newComment,
            user_email: userEmail
          }
        ])
        .select();
      
      if (error) {
        throw error;
      }
      
      // Kommentar zur lokalen Liste hinzufügen
      if (data && data.length > 0) {
        onCommentAdded(data[0] as Comment);
        setNewComment("");
        
        toast({
          title: "Kommentar hinzugefügt",
          description: "Dein Kommentar wurde erfolgreich gespeichert."
        });
      }
      
    } catch (error) {
      console.error("Fehler beim Hinzufügen des Kommentars:", error);
      toast({
        title: "Fehler",
        description: "Der Kommentar konnte nicht gespeichert werden.",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Kommentare zu {lead.name}</DialogTitle>
          <DialogDescription>
            Füge interne Notizen zu diesem Lead hinzu
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-80 overflow-y-auto space-y-4 my-4">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment.id} className="bg-gray-50 p-3 rounded-lg">
                <div className="flex justify-between text-sm text-gray-500 mb-1">
                  <span>{comment.user_email}</span>
                  <span>{new Date(comment.created_at).toLocaleString('de-DE')}</span>
                </div>
                <p>{comment.content}</p>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">Noch keine Kommentare</p>
          )}
        </div>
        <Textarea
          placeholder="Neuen Kommentar hinzufügen..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="mb-4"
        />
        <DialogFooter>
          <Button onClick={handleAddComment}>Kommentar speichern</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
