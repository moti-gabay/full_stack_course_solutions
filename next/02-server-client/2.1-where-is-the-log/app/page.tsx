import Counter from "./components/counter";

export default function HomePage() {
  console.log("[server] HomePage rendered");

  return (
    <main className="mx-auto max-w-xl p-6">
      <h1 className="text-2xl font-bold">איפה הלוג?</h1>
      <p className="my-2">פתחו את הטרמינל של npm run dev ואת הקונסול של הדפדפן.</p>
      <Counter />
    </main>
  );
}
