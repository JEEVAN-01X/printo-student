export default function FileShareNotice() {
  return (
    <div
      role="note"
      className="flex items-center gap-2 bg-orange-50 border border-orange-300 rounded-lg px-3 py-2"
    >
      <span className="text-orange-500 text-sm shrink-0">!</span>
      <p className="text-xs text-orange-700">
        Set your Drive link to{' '}
        <strong className="font-semibold">"Anyone with the link can view"</strong>
        {' '}before pasting.
      </p>
    </div>
  )
}