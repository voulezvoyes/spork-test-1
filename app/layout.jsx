export const metadata = {
  title: "Spork — Conversation Branching",
  description: "Usability prototype for branching AI conversations."
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
