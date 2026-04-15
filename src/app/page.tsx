export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-6">
      <main className="max-w-2xl w-full text-center sm:text-left flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <p className="text-sm uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
            CyberNet · Awareness Edition
          </p>
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Could you spot the attack?
          </h1>
        </div>

        <p className="text-lg leading-relaxed text-zinc-700 dark:text-zinc-300">
          You play a member of staff at a small university. Over the next
          few minutes, you&apos;ll face a series of realistic cyberattacks —
          a phishing email, a USB stick on the floor, a help-desk call
          asking for your password. Each decision plays out, an AI
          narrator explains what just happened, and you find out how an
          attacker would have used your slip.
        </p>

        <p className="text-base text-zinc-600 dark:text-zinc-400">
          Master&apos;s thesis prototype. Scenarios coming soon.
        </p>
      </main>
    </div>
  );
}
