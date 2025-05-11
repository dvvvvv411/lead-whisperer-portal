
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Comment } from "@/types/leads";

export function useComments() {
  const { toast } = useToast();
  const [comments, setComments] = useState<Comment[]>([]);

  // Kommentare abrufen
  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .order('created_at', { ascending: true });
      
      if (error) {
        throw error;
      }
      
      if (data) {
        setComments(data as Comment[]);
      }
    } catch (error) {
      console.error("Fehler beim Abrufen der Kommentare:", error);
      toast({
        title: "Fehler beim Laden",
        description: "Die Kommentare konnten nicht geladen werden.",
        variant: "destructive"
      });
    }
  };

  // Initial load of comments
  useEffect(() => {
    fetchComments();
  }, []);

  const handleCommentAdded = (newComment: Comment) => {
    setComments(prevComments => [...prevComments, newComment]);
  };

  return {
    comments,
    fetchComments,
    handleCommentAdded
  };
}
