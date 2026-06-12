import MacTrafficLights from "./MacTrafficLights";

interface Props {
  app: string;
  title: string;
}

/**
 * Slim macOS window title-bar shown above a section's heading.
 * Non-functional traffic lights + app/title text.
 */
const MacSectionBar = ({ app, title }: Props) => (
  <div className="max-w-3xl mx-auto mb-8 flex items-center gap-3 px-4 py-2 rounded-2xl border border-border/40 bg-background/40 backdrop-blur-sm shadow-lg">
    <MacTrafficLights size="sm" />
    <div className="flex-1 text-center">
      <span className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground font-mono me-2">
        {app}
      </span>
      <span className="text-[11px] font-medium text-foreground/85">{title}</span>
    </div>
    <span className="w-[34px]" />
  </div>
);

export default MacSectionBar;