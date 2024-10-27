import "./globals.css";

export const metadata = {
  title: "No Contiene",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="dark">{children}</body>
    </html>
  );
}
