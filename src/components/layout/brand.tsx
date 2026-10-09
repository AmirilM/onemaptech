export function Brand() {
  return (
    <div className="mb-6 flex items-center gap-2.5 px-2">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-foreground text-background">
        <span className="font-display text-sm font-bold">O</span>
      </div>
      <div>
        <p className="font-display text-sm font-semibold leading-none text-foreground">
          OneMapTech
        </p>
        <p className="mt-1 text-[11px] leading-none text-subtle">
          Sales Dashboard
        </p>
      </div>
    </div>
  );
}
