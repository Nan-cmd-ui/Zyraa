// components/WhatsAppButton.jsx
import { FaWhatsapp } from "react-icons/fa";

const WhatsAppButton = () => {
  const phoneNumber = "+2348074034191"; // your number
  const message = "Hello! I want to chat about Zyra."; // optional preset message
  const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 bg-orange-500 text-white p-4 rounded-full shadow-lg hover:scale-110 transition transform"
    >
      <FaWhatsapp size={24} />
    </a>
  );
};

export default WhatsAppButton;
