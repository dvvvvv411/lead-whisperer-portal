
interface LeadDateProps {
  dateString: string;
}

export const LeadDate = ({ dateString }: LeadDateProps) => {
  const date = new Date(dateString);
  
  return (
    <span>
      {date.toLocaleDateString('de-DE')} {date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}
    </span>
  );
};
