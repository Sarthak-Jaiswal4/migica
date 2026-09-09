"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ChevronDown, ChevronUp, ImagePlus, Loader2, Pencil, Save, Trash2 } from "lucide-react";
import { Headers } from "@/components/Headers";
import { Footer } from "@/components/Footer";
import { AppImage as Image } from "@/components/AppImage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Exhibition, HappyCustomer } from "@/lib/showcase";

type ShowcaseType = "happy-customers" | "exhibitions";

const emptyHappy = { name: "", caption: "", image: "" };
const emptyExhibition = { title: "", location: "", description: "", image: "" };

async function uploadImage(file: File, folder: ShowcaseType) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);
  const response = await fetch("/api/upload", { method: "POST", body: formData });
  if (!response.ok) throw new Error("Upload failed");
  return (await response.json()).url as string;
}

export default function ShowcaseAdminPage() {
  const router = useRouter();
  const [type, setType] = useState<ShowcaseType>("happy-customers");
  const [customers, setCustomers] = useState<HappyCustomer[]>([]);
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const [happyForm, setHappyForm] = useState(emptyHappy);
  const [exhibitionForm, setExhibitionForm] = useState(emptyExhibition);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const loadItems = async () => {
    setIsLoading(true);
    try {
      const [customerResponse, exhibitionResponse] = await Promise.all([
        fetch("/api/showcase/happy-customers"),
        fetch("/api/showcase/exhibitions"),
      ]);
      const [customerData, exhibitionData] = await Promise.all([customerResponse.json(), exhibitionResponse.json()]);
      setCustomers(customerData.items || []);
      setExhibitions(exhibitionData.items || []);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const loadTimer = window.setTimeout(() => { void loadItems(); }, 0);
    return () => window.clearTimeout(loadTimer);
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setHappyForm(emptyHappy);
    setExhibitionForm(emptyExhibition);
  };

  const handleUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const image = await uploadImage(file, type);
      if (type === "happy-customers") setHappyForm((form) => ({ ...form, image }));
      else setExhibitionForm((form) => ({ ...form, image }));
    } catch {
      alert("Image upload failed. Please try again.");
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  const saveItem = async () => {
    const payload = type === "happy-customers" ? happyForm : exhibitionForm;
    const required = type === "happy-customers" ? happyForm.name : exhibitionForm.title;
    if (!required || !payload.image) return;
    setIsSaving(true);
    try {
      const response = await fetch(editingId ? `/api/showcase/${type}/${editingId}` : `/api/showcase/${type}`, {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Save failed");
      resetForm();
      await loadItems();
    } catch {
      alert("Could not save this item. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const editItem = (item: HappyCustomer | Exhibition) => {
    setEditingId(item.id);
    if (type === "happy-customers") {
      const customer = item as HappyCustomer;
      setHappyForm({ name: customer.name, caption: customer.caption, image: customer.image });
    } else {
      const exhibition = item as Exhibition;
      setExhibitionForm({ title: exhibition.title, location: exhibition.location, description: exhibition.description, image: exhibition.image });
    }
  };

  const deleteItem = async (id: string) => {
    if (!confirm("Delete this item?")) return;
    await fetch(`/api/showcase/${type}/${id}`, { method: "DELETE" });
    if (editingId === id) resetForm();
    await loadItems();
  };

  const reorderItems = async (from: number, to: number) => {
    const currentItems = type === "happy-customers" ? customers : exhibitions;
    if (to < 0 || to >= currentItems.length) return;
    const reordered = [...currentItems];
    const [moved] = reordered.splice(from, 1);
    reordered.splice(to, 0, moved);
    if (type === "happy-customers") setCustomers(reordered as HappyCustomer[]);
    else setExhibitions(reordered as Exhibition[]);
    await Promise.all(reordered.map((item, index) => fetch(`/api/showcase/${type}/${item.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order: index }),
    })));
  };

  const activeItems = type === "happy-customers" ? customers : exhibitions;
  const activeImage = type === "happy-customers" ? happyForm.image : exhibitionForm.image;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Headers />
      <main className="mx-auto w-full max-w-6xl flex-grow px-4 pb-12 pt-24">
        <Button variant="ghost" className="mb-6 px-0" onClick={() => router.push("/allproduct")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to products
        </Button>
        <div className="mb-8 flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Showcase Management</h1>
          <p className="text-muted-foreground">Manage the customer photos and exhibition cards shown across the site.</p>
        </div>

        <Tabs value={type} onValueChange={(value) => { setType(value as ShowcaseType); resetForm(); }}>
          <TabsList className="mb-6 h-11">
            <TabsTrigger value="happy-customers">Happy Customers</TabsTrigger>
            <TabsTrigger value="exhibitions">Exhibitions</TabsTrigger>
          </TabsList>
          {["happy-customers", "exhibitions"].map((tab) => (
            <TabsContent key={tab} value={tab}>
              <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
                <Card className="h-fit">
                  <CardHeader><CardTitle>{editingId ? "Edit item" : "Add item"}</CardTitle></CardHeader>
                  <CardContent className="space-y-5">
                    <button type="button" onClick={() => inputRef.current?.click()} className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-lg border border-dashed border-border bg-muted/40">
                      {activeImage ? <Image src={activeImage} alt="Upload preview" fill className="object-cover" /> : isUploading ? <Loader2 className="animate-spin" /> : <ImagePlus className="h-7 w-7 text-muted-foreground" />}
                    </button>
                    <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
                    {type === "happy-customers" ? <>
                      <div className="space-y-2"><Label htmlFor="customer-name">Customer name</Label><Input id="customer-name" value={happyForm.name} onChange={(e) => setHappyForm({ ...happyForm, name: e.target.value })} /></div>
                      <div className="space-y-2"><Label htmlFor="customer-caption">Caption</Label><Textarea id="customer-caption" value={happyForm.caption} onChange={(e) => setHappyForm({ ...happyForm, caption: e.target.value })} /></div>
                    </> : <>
                      <div className="space-y-2"><Label htmlFor="exhibition-title">Title</Label><Input id="exhibition-title" value={exhibitionForm.title} onChange={(e) => setExhibitionForm({ ...exhibitionForm, title: e.target.value })} /></div>
                      <div className="space-y-2"><Label htmlFor="exhibition-location">Location</Label><Input id="exhibition-location" value={exhibitionForm.location} onChange={(e) => setExhibitionForm({ ...exhibitionForm, location: e.target.value })} /></div>
                      <div className="space-y-2"><Label htmlFor="exhibition-description">Description</Label><Textarea id="exhibition-description" value={exhibitionForm.description} onChange={(e) => setExhibitionForm({ ...exhibitionForm, description: e.target.value })} /></div>
                    </>}
                    <div className="flex gap-3"><Button className="flex-1" onClick={saveItem} disabled={isSaving || isUploading}><Save className="mr-2 h-4 w-4" />{isSaving ? "Saving..." : editingId ? "Save changes" : "Add item"}</Button>{editingId && <Button variant="outline" onClick={resetForm}>Cancel</Button>}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader><CardTitle>Display order</CardTitle></CardHeader>
                  <CardContent className="space-y-3">
                    {isLoading ? <div className="flex justify-center py-10"><Loader2 className="animate-spin" /></div> : activeItems.length === 0 ? <p className="py-10 text-center text-sm text-muted-foreground">No items yet. Add the first one from the form.</p> : activeItems.map((item, index) => (
                      <div key={item.id} className="flex items-center gap-4 rounded-lg border border-border p-3">
                        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-muted"><Image src={item.image} alt="" fill className="object-cover" /></div>
                        <div className="min-w-0 flex-1"><p className="truncate font-semibold">{"name" in item ? item.name : item.title}</p><p className="truncate text-sm text-muted-foreground">{"caption" in item ? item.caption : item.location}</p></div>
                        <div className="flex items-center gap-1"><Button size="icon" variant="ghost" aria-label="Move earlier" disabled={index === 0} onClick={() => reorderItems(index, index - 1)}><ChevronUp className="h-4 w-4" /></Button><Button size="icon" variant="ghost" aria-label="Move later" disabled={index === activeItems.length - 1} onClick={() => reorderItems(index, index + 1)}><ChevronDown className="h-4 w-4" /></Button><Button size="icon" variant="ghost" aria-label="Edit" onClick={() => editItem(item)}><Pencil className="h-4 w-4" /></Button><Button size="icon" variant="ghost" aria-label="Delete" onClick={() => deleteItem(item.id)}><Trash2 className="h-4 w-4 text-red-500" /></Button></div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </main>
      <Footer />
    </div>
  );
}
