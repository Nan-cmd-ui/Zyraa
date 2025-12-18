import { Outfit } from "next/font/google";
import "./globals.css";
import { AppContextProvider } from "@/context/AppContext";
import { Toaster } from 'react-hot-toast';
import WhatsAppButton from "@/components/message";

const outfit = Outfit({ subsets: ['latin'], weight: ["300", "400", "500"] })

export const metadata = {
  title: "Zyra - Ecommerce",
  description: "E-Commerce ",
};

export default function RootLayout({ children }) {
  return (
      <html lang="en">
        <body className={`${outfit.className} antialiased text-gray-700`} >
        <Toaster position="top-right" reverseOrder={false} />
          <AppContextProvider>
            {children}
          </AppContextProvider>
          <WhatsAppButton />
        </body>
      </html>
  );
}
