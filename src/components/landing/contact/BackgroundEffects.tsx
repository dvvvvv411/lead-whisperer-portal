
import { motion } from "framer-motion";
import SharedBackgroundEffects from "../common/SharedBackgroundEffects";

const BackgroundEffects = () => {
  const additionalElements = (
    <>
      {/* Contact-specific background elements */}
      <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-accent1/5 rounded-full filter blur-3xl"></div>
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-gold/5 rounded-full filter blur-3xl"></div>
    </>
  );

  return (
    <SharedBackgroundEffects 
      variant="secondary"
      showTopWave={true}
      showBottomGradient={true}
      additionalElements={additionalElements}
    />
  );
};

export default BackgroundEffects;
