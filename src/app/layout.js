import { Montserrat } from "next/font/google";
import "./globals.css";
import './favicon.ico';

const montserrat = Montserrat({ 
  subsets: ["latin"],
  // Montserrat comes in multiple weights - you can specify which ones you want to load
  weight: ["300", "400", "500", "600", "700"],
  // You can also specify italic styles if needed
  // style: ['normal', 'italic'],
});

export const metadata = {
  title: "Fomo Wallet",
  description: "Bet on the future of cryptocurrency",
  icons : {
    icon : "/favicon.ico",
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={montserrat.className}>{children}</body>
    </html>
  );
}