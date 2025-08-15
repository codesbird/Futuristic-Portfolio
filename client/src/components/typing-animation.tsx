import { useState, useEffect } from "react";

export default function TypingAnimation() {
  const texts = [
    "Python Developer & Data Science Enthusiast",
    "Full-Stack Web Developer",
    "Automation & AI/ML Specialist", 
    "Problem Solver & Tech Innovator"
  ];

  const [currentText, setCurrentText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const fullText = texts[currentIndex];
      
      if (isDeleting) {
        setCurrentText(fullText.substring(0, currentText.length - 1));
      } else {
        setCurrentText(fullText.substring(0, currentText.length + 1));
      }

      if (!isDeleting && currentText === fullText) {
        setTimeout(() => setIsDeleting(true), 2000);
      } else if (isDeleting && currentText === '') {
        setIsDeleting(false);
        setCurrentIndex((currentIndex + 1) % texts.length);
      }
    }, isDeleting ? 50 : 100);

    return () => clearTimeout(timeout);
  }, [currentText, currentIndex, isDeleting, texts]);

  return (
    <span className="typing-animation">
      {currentText}
      <span className="border-r-2 border-tech-light animate-pulse">|</span>
    </span>
  );
}
