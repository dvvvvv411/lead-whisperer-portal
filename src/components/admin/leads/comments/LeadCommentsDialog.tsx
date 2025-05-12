
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { Comment } from "@/types/leads";

interface LeadCommentsDialogProps {
  leadId: string;
  leadName: string;
  comments: Comment[];
  onCommentAdded: (newComment: Comment) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userEmail: string;
}

export const LeadCommentsDialog = ({
  leadId,
  leadName,
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
            lead_id: leadId,
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
      <DialogContent className="max-w-md bg-casino-dark border-gold/20 text-gray-200">
        <DialogHeader>
          <DialogTitle className="text-gray-100">Kommentare zu {leadName}</DialogTitle>
          <DialogDescription className="text-gray-400">
            Füge interne Notizen zu diesem Lead hinzu
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-80 overflow-y-auto space-y-4 my-4">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment.id} className="bg-casino-card p-3 rounded-lg border border-gold/10">
                <div className="flex justify-between text-sm text-gray-400 mb-1">
                  <span>{comment.user_email}</span>
                  <span>{new Date(comment.created_at).toLocaleString('de-DE')}</span>
                </div>
                <p className="text-gray-200">{comment.content}</p>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-400">Noch keine Kommentare</p>
          )}
        </div>
        <Textarea
          placeholder="Neuen Kommentar hinzufügen..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="mb-4 bg-casino-card border-gold/20 text-gray-200 placeholder:text-gray-500"
        />
        <DialogFooter>
          <Button onClick={handleAddComment} className="bg-gold hover:bg-gold/90 text-black">Kommentar speichern</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
