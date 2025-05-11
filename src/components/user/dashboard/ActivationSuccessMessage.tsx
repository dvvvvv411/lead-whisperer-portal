
import { CheckCircle } from "lucide-react";

interface ActivationSuccessMessageProps {
  onDismiss: () => void;
}

const ActivationSuccessMessage = ({ onDismiss }: ActivationSuccessMessageProps) => {
  return (
    <div className="mb-6 p-4 bg-gradient-to-r from-green-900/30 to-green-800/30 border border-green-500/30 rounded-xl animate-fade-in backdrop-blur-sm">
      <div className="flex items-start">
        <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-bold text-green-400">Konto erfolgreich aktiviert!</h3>
          <p className="text-green-300 mt-1">
            Ihr Konto wurde erfolgreich aktiviert. Sie haben nun Zugriff auf alle Funktionen des Systems.
          </p>
          <div className="mt-3">
            <button 
              className="px-3 py-1 text-sm bg-green-800/50 hover:bg-green-700/50 text-green-200 rounded"
              onClick={onDismiss}
            >
              Verstanden
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivationSuccessMessage;
