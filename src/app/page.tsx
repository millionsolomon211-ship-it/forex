import Link from "next/link";

export default function Home() {
  return (
    <main className="p-8 md:p-16">
      <header className="border-b-8 border-black pb-8 mb-12 flex justify-between items-end">
        <div>
          <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none">
            Forex
            <br />
            Exchange
          </h1>
          <p className="text-2xl mt-4 font-bold max-w-xl">
            The official foreign exchange module for the Tourism App.
          </p>
        </div>
        <div className="hidden md:block text-right border-l-8 border-black pl-8">
          <p className="text-4xl font-black">EST. 2026</p>
          <p className="text-xl font-bold uppercase">System Active</p>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <div className="border-8 border-black p-8 shadow-[8px_8px_0_0_#000]">
          <h2 className="text-4xl font-black uppercase mb-4 border-b-4 border-black pb-2">For Travelers</h2>
          <p className="text-lg font-medium mb-8">
            Register your international credentials upon arrival to receive a secure virtual card. Deposit foreign currency to ETB easily using rates from verified local providers.
          </p>
          <Link href="/login" className="inline-block bg-black text-white text-xl font-bold uppercase px-8 py-4 hover:bg-white hover:text-black hover:border-black border-4 border-black transition-colors">
            Access Card
          </Link>
        </div>

        <div className="border-8 border-black p-8 bg-black text-white shadow-[8px_8px_0_0_#ccc]">
          <h2 className="text-4xl font-black uppercase mb-4 border-b-4 border-white pb-2">For Providers</h2>
          <p className="text-lg font-medium mb-8">
            Banks and private forex companies can register to provide USD to ETB exchange rates. Rates are publicly available to all travelers.
          </p>
          <Link href="/login" className="inline-block bg-white text-black text-xl font-bold uppercase px-8 py-4 hover:bg-black hover:text-white hover:border-white border-4 border-white transition-colors">
            Provider Portal
          </Link>
        </div>
      </section>

      <footer className="border-t-8 border-black pt-8 mt-16 flex flex-col md:flex-row justify-between items-start md:items-center">
        <p className="text-xl font-bold">© 2026 TOURISM FOREX MODULE</p>
        <Link href="/login" className="text-xl font-bold underline mt-4 md:mt-0 hover:bg-black hover:text-white px-2 py-1">
          Admin Login
        </Link>
      </footer>
    </main>
  );
}
