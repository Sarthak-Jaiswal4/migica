import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ShowcaseType } from "@/lib/showcase";

const tabs: { value: ShowcaseType; label: string }[] = [
  { value: "hero-media", label: "Hero Media" },
  { value: "happy-customers", label: "Happy Customers" },
  { value: "exhibitions", label: "Exhibitions" },
  { value: "certificates", label: "Certificates" },
  { value: "testimonials", label: "Testimonials" },
];

export function ShowcaseTabs() {
  return (
    <TabsList className="mb-6 flex h-11 w-full max-w-full flex-nowrap justify-start gap-1 overflow-x-auto overflow-y-hidden p-1 [scrollbar-width:none] sm:w-fit sm:overflow-visible">
      {tabs.map((tab) => <TabsTrigger key={tab.value} value={tab.value} className="shrink-0 flex-none px-3">{tab.label}</TabsTrigger>)}
    </TabsList>
  );
}
