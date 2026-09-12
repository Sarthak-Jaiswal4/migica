import { ChevronDown, ChevronUp, Loader2, Pencil, Search, Trash2 } from "lucide-react";
import { AppImage as Image } from "@/components/AppImage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { ShowcaseItem } from "@/lib/showcase";

type Props = {
  items: ShowcaseItem[];
  filteredItems: ShowcaseItem[];
  isLoading: boolean;
  search: string;
  onSearchChange: (value: string) => void;
  onMove: (from: number, to: number) => void;
  onEdit: (item: ShowcaseItem) => void;
  onDelete: (id: string) => void;
  title: (item: ShowcaseItem) => string;
  subtitle: (item: ShowcaseItem) => string;
};

export function ShowcaseItemList({ items, filteredItems, isLoading, search, onSearchChange, onMove, onEdit, onDelete, title, subtitle }: Props) {
  return <Card className="w-full min-w-0 max-w-full overflow-hidden"><CardHeader><CardTitle>All uploaded items</CardTitle></CardHeader><CardContent className="min-w-0 space-y-3">
    <div className="relative min-w-0"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input aria-label="Search descriptions" className="w-full min-w-0 pl-9" placeholder="Search by name, title, or description" value={search} onChange={(event) => onSearchChange(event.target.value)} /></div>
    {isLoading ? <div className="flex justify-center py-10"><Loader2 className="animate-spin" /></div>
      : items.length === 0 ? <p className="py-10 text-center text-sm text-muted-foreground">No items yet. Add the first one from the form.</p>
        : filteredItems.length === 0 ? <p className="py-10 text-center text-sm text-muted-foreground">No matching items found.</p>
          : filteredItems.map((item) => <ShowcaseListItem key={item.id} item={item} index={items.indexOf(item)} total={items.length} title={title(item)} subtitle={subtitle(item)} onMove={onMove} onEdit={onEdit} onDelete={onDelete} />)}
  </CardContent></Card>;
}

function ShowcaseListItem({ item, index, total, title, subtitle, onMove, onEdit, onDelete }: { item: ShowcaseItem; index: number; total: number; title: string; subtitle: string; onMove: Props["onMove"]; onEdit: Props["onEdit"]; onDelete: Props["onDelete"] }) {
  return <div className="flex w-full min-w-0 max-w-full flex-wrap items-center gap-3 overflow-hidden rounded-lg border border-border p-3 sm:flex-nowrap sm:gap-4">
    {"image" in item && <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-muted"><Image src={item.image} alt="" fill className="object-cover" /></div>}
    {"url" in item && <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted">{item.mediaType === "video" ? <video src={item.url} muted className="h-full w-full object-cover" /> : <Image src={item.url} alt="" fill className="object-cover" />}</div>}
    <div className="min-w-0 flex-1"><p className="truncate font-semibold">{title}</p><p className="truncate text-sm text-muted-foreground">{subtitle}</p></div>
    <div className="flex w-full justify-end gap-1 border-t border-border pt-2 sm:w-auto sm:border-t-0 sm:pt-0">
      <Button size="icon" variant="ghost" aria-label="Move earlier" disabled={index === 0} onClick={() => onMove(index, index - 1)}><ChevronUp className="h-4 w-4" /></Button>
      <Button size="icon" variant="ghost" aria-label="Move later" disabled={index === total - 1} onClick={() => onMove(index, index + 1)}><ChevronDown className="h-4 w-4" /></Button>
      <Button size="icon" variant="ghost" aria-label="Edit" onClick={() => onEdit(item)}><Pencil className="h-4 w-4" /></Button>
      <Button size="icon" variant="ghost" aria-label="Delete" onClick={() => onDelete(item.id)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
    </div>
  </div>;
}
