import { RegisterForm } from "./register-form";

export default function Home() {
  return (
    <main className="mx-auto max-w-md space-y-6 p-8">
      <h1 className="text-2xl font-bold">הרשמה לסדנה</h1>
      <RegisterForm />
    </main>
  );
}
