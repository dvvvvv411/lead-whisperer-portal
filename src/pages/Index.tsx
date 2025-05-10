
import ContactForm from "@/components/ContactForm";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">Willkommen bei unserem Service</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Kontaktiere uns noch heute, und wir werden uns so schnell wie möglich bei dir melden.
          </p>
        </header>
        
        <ContactForm />
      </div>
    </div>
  );
};

export default Index;
