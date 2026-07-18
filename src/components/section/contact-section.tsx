import Link from "next/link";
import { DATA } from "@/data/resume";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";

export default function ContactSection() {
  return (
    <div className="border rounded-xl p-10 relative">
      <div className="absolute -top-4 border bg-primary z-10 rounded-xl px-4 py-1 left-1/2 -translate-x-1/2">
        <span className="text-background text-sm font-medium">Contact</span>
      </div>
      <div className="relative flex flex-col items-center gap-6 text-center">
        <div className="flex flex-col items-center gap-3">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
            Get in Touch
          </h2>
          <p className="mx-auto max-w-lg text-muted-foreground text-balance">
            Have a question or want to work together? Send me an email and
            I&apos;ll get back to you as soon as I can. I will ignore all
            soliciting.
          </p>
        </div>
        <Button asChild size="lg" className="rounded-xl gap-2">
          <Link href={`mailto:${DATA.contact.email}`}>
            <Icons.email className="size-4" />
            {DATA.contact.email}
          </Link>
        </Button>
      </div>
    </div>
  );
}
