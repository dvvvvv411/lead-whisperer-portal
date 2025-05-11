import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { Check, X, MessageSquare } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface Lead {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  message: string;
  status: 'neu' | 'akzeptiert' | 'abgelehnt';
}

interface Comment {
  id: string;
  lead_id: string;
  created_at: string;
  content: string;
  user_email: string;
}

const LeadTable = () => {
  const { toast } = useToast();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [newComment, setNewComment] = useState("");
  const [user, setUser] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);

  // Benutzer-Session abrufen
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUser(data.user);
      } else {
        // Wenn kein Benutzer eingeloggt ist, zur Login-Seite weiterleiten
        window.location.href = "/admin";
      }
    };
    
    getUser();
  }, []);

  // Leads abrufen
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const { data, error } = await supabase
          .from('leads')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) {
          throw error;
        }
        
        if (data) {
          setLeads(data as Lead[]);
          setFilteredLeads(data as Lead[]);
        }
      } catch (error) {
        console.error("Fehler beim Abrufen der Leads:", error);
        toast({
          title: "Fehler beim Laden",
          description: "Die Leads konnten nicht geladen werden.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchLeads();
  }, [toast]);

  // Anwenden des Filters, wenn sich der statusFilter ändert
  useEffect(() => {
    if (statusFilter === undefined) {
      setFilteredLeads(leads);
    } else {
      setFilteredLeads(leads.filter(lead => lead.status === statusFilter));
    }
  }, [statusFilter, leads]);

  // Kommentare abrufen
  useEffect(() => {
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
      }
    };
    
    fetchComments();
  }, []);

  const handleStatusChange = async (id: string, status: 'akzeptiert' | 'abgelehnt') => {
    try {
      const { error } = await supabase
        .from('leads')
        .update({ status })
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      // Lokale Daten aktualisieren
      setLeads(prevLeads => 
        prevLeads.map(lead => 
          lead.id === id ? { ...lead, status } : lead
        )
      );
      
      toast({
        title: "Status aktualisiert",
        description: `Der Lead wurde als "${status}" markiert.`
      });
      
    } catch (error) {
      console.error("Fehler bei der Statusänderung:", error);
      toast({
        title: "Fehler",
        description: "Der Status konnte nicht aktualisiert werden.",
        variant: "destructive"
      });
    }
  };

  const handleAddComment = async () => {
    if (!selectedLead || !newComment.trim() || !user) {
      return;
    }

    try {
      const { data, error } = await supabase
        .from('comments')
        .insert([
          { 
            lead_id: selectedLead.id,
            content: newComment,
            user_email: user.email
          }
        ])
        .select();
      
      if (error) {
        throw error;
      }
      
      // Kommentar zur lokalen Liste hinzufügen
      if (data && data.length > 0) {
        setComments([...comments, data[0] as Comment]);
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

  const getLeadComments = (leadId: string) => {
    return comments.filter(comment => comment.lead_id === leadId);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'neu':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">Neu</Badge>;
      case 'akzeptiert':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">Akzeptiert</Badge>;
      case 'abgelehnt':
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">Abgelehnt</Badge>;
      default:
        return <Badge variant="outline">Unbekannt</Badge>;
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      window.location.href = "/admin";
    } catch (error) {
      console.error("Fehler beim Abmelden:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <p>Wird geladen...</p>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Lead-Verwaltung</h1>
        <div className="flex items-center gap-2">
          {user && <span className="text-sm text-gray-600">Angemeldet als: {user.email}</span>}
          <Button variant="outline" onClick={handleLogout}>Abmelden</Button>
        </div>
      </div>
      
      {/* Filter-Buttons - now left-aligned */}
      <div className="mb-6">
        <h2 className="text-sm text-gray-500 mb-2">Nach Status filtern:</h2>
        <div className="flex justify-start">
          <ToggleGroup type="single" value={statusFilter} onValueChange={setStatusFilter}>
            <ToggleGroupItem value="neu" className="bg-blue-100 text-blue-800 border-blue-300 data-[state=on]:bg-blue-200">
              Neu
            </ToggleGroupItem>
            <ToggleGroupItem value="akzeptiert" className="bg-green-100 text-green-800 border-green-300 data-[state=on]:bg-green-200">
              Akzeptiert
            </ToggleGroupItem>
            <ToggleGroupItem value="abgelehnt" className="bg-red-100 text-red-800 border-red-300 data-[state=on]:bg-red-200">
              Abgelehnt
            </ToggleGroupItem>
          </ToggleGroup>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setStatusFilter(undefined)}
            className="ml-2"
          >
            Alle anzeigen
          </Button>
        </div>
      </div>
      
      {filteredLeads.length === 0 ? (
        <div className="text-center p-10 bg-gray-50 rounded-lg">
          <p className="text-gray-600">Keine Leads vorhanden für diese Filterauswahl.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg overflow-hidden shadow">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left">Datum</th>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Unternehmen</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Kommentare</th>
                <th className="px-4 py-3 text-left">Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3">
                    {new Date(lead.created_at).toLocaleDateString('de-DE')} {new Date(lead.created_at).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="px-4 py-3">{lead.name}</td>
                  <td className="px-4 py-3">{lead.email}</td>
                  <td className="px-4 py-3">{lead.company || "-"}</td>
                  <td className="px-4 py-3">{getStatusBadge(lead.status)}</td>
                  <td className="px-4 py-3">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="flex items-center gap-1"
                          onClick={() => setSelectedLead(lead)}
                        >
                          <MessageSquare className="h-4 w-4" />
                          <span>{getLeadComments(lead.id).length}</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Kommentare zu {lead.name}</DialogTitle>
                          <DialogDescription>
                            Füge interne Notizen zu diesem Lead hinzu
                          </DialogDescription>
                        </DialogHeader>
                        <div className="max-h-80 overflow-y-auto space-y-4 my-4">
                          {getLeadComments(lead.id).length > 0 ? (
                            getLeadComments(lead.id).map((comment) => (
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
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-green-50 hover:bg-green-100"
                        onClick={() => handleStatusChange(lead.id, 'akzeptiert')}
                        disabled={lead.status === 'akzeptiert'}
                      >
                        <Check className="h-4 w-4 text-green-600" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-red-50 hover:bg-red-100"
                        onClick={() => handleStatusChange(lead.id, 'abgelehnt')}
                        disabled={lead.status === 'abgelehnt'}
                      >
                        <X className="h-4 w-4 text-red-600" />
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedLead(lead)}
                          >
                            Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Lead-Details</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div>
                              <h3 className="font-medium">Name</h3>
                              <p>{lead.name}</p>
                            </div>
                            <div>
                              <h3 className="font-medium">Email</h3>
                              <p>{lead.email}</p>
                            </div>
                            {lead.phone && (
                              <div>
                                <h3 className="font-medium">Telefon</h3>
                                <p>{lead.phone}</p>
                              </div>
                            )}
                            {lead.company && (
                              <div>
                                <h3 className="font-medium">Unternehmen</h3>
                                <p>{lead.company}</p>
                              </div>
                            )}
                            <div>
                              <h3 className="font-medium">Nachricht</h3>
                              <p className="whitespace-pre-line">{lead.message}</p>
                            </div>
                            <div>
                              <h3 className="font-medium">Eingegangen am</h3>
                              <p>{new Date(lead.created_at).toLocaleString('de-DE')}</p>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default LeadTable;
