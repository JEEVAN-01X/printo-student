export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-brand-cream/90 backdrop-blur-sm border-b border-brand-border">
      <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
        <a href="/" className="font-display text-xl font-black text-brand-ink tracking-tight select-none">
          Printo
          <span className="text-brand-orange">.</span>
        </a>
        <div />
      </div>
    </header>
  )
}