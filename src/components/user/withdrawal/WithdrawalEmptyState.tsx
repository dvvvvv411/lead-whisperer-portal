
import { CardContent } from "@/components/ui/card";

const WithdrawalEmptyState = () => {
  return (
    <CardContent>
      <div className="text-center p-4 text-gray-500">
        Keine Auszahlungen gefunden.
      </div>
    </CardContent>
  );
};

export default WithdrawalEmptyState;
