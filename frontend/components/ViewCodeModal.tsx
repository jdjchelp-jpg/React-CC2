import { Code2, ExternalLink } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

interface ViewCodeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ViewCodeModal({
  open,
  onOpenChange,
}: ViewCodeModalProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="
          bg-background
          text-foreground
          border-l
          border-border
          w-[360px]
          sm:w-[420px]
        "
      >
        {/* Header */}
        <SheetHeader className="space-y-2">
          <SheetTitle className="flex items-center gap-2 text-lg font-semibold">
            <Code2 className="w-5 h-5" />
            View Project Code
          </SheetTitle>

          <SheetDescription className="text-muted-foreground">
            Choose where you want to view the source code
          </SheetDescription>
        </SheetHeader>

        {/* Links */}
        <div className="mt-8 space-y-4">
          {/* GitHub */}
          <a
            href="https://github.com/jdjchelp-jpg/React-CC2"
            target="_blank"
            rel="noopener noreferrer"
            className="
              group
              flex
              items-center
              justify-between
              rounded-xl
              border
              border-border
              bg-muted/40
              p-4
              transition-colors
              hover:bg-muted
            "
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2 font-medium">
                GitHub Repository
                <ExternalLink className="w-4 h-4 opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
              <div className="text-sm text-muted-foreground">
                Full project source code
              </div>
            </div>
          </a>

          {/* CodePen */}
          <a
            href="https://codepen.io/collection/WQbWVZ"
            target="_blank"
            rel="noopener noreferrer"
            className="
              group
              flex
              items-center
              justify-between
              rounded-xl
              border
              border-border
              bg-muted/40
              p-4
              transition-colors
              hover:bg-muted
            "
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2 font-medium">
                CodePen Collection
                <ExternalLink className="w-4 h-4 opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
              <div className="text-sm text-muted-foreground">
                Interactive demos & examples
              </div>
            </div>
          </a>
        </div>

        {/* Footer note */}
        <div className="mt-10 text-xs text-muted-foreground">
          Links open in a new tab.
        </div>
      </SheetContent>
    </Sheet>
  );
}
