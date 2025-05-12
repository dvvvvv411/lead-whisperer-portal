
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { Comment } from "@/types/leads";
import { LeadCommentsDialog } from "./LeadCommentsDialog";
import { useState } from "react";
import { motion } from "framer-motion";

interface LeadCommentButtonProps {
  leadId: string;
  leadName: string;
  comments: Comment[];
  onCommentAdded: (newComment: Comment) => void;
  userEmail: string;
}

export const LeadCommentButton = ({
  leadId,
  leadName,
  comments,
  onCommentAdded,
  userEmail,
}: LeadCommentButtonProps) => {
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const leadComments = comments.filter(comment => comment.lead_id === leadId);

  return (
    <>
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button 
          variant="ghost" 
          size="sm" 
          className={`flex items-center gap-1 ${
            leadComments.length > 0 ? 'text-blue-400' : 'text-gray-400'
          } hover:text-blue-300 hover:bg-blue-500/10`}
          onClick={() => setIsCommentsOpen(true)}
        >
          <MessageSquare className="h-4 w-4" />
          <span>{leadComments.length}</span>
        </Button>
      </motion.div>
      
      <LeadCommentsDialog
        leadId={leadId}
        leadName={leadName}
        comments={leadComments}
        onCommentAdded={onCommentAdded}
        open={isCommentsOpen}
        onOpenChange={setIsCommentsOpen}
        userEmail={userEmail}
      />
    </>
  );
};
