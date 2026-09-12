"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Headers } from "@/components/Headers";
import { Footer } from "@/components/Footer";
import { ShowcaseForm } from "@/components/admin/showcase/ShowcaseForm";
import { ShowcaseItemList } from "@/components/admin/showcase/ShowcaseItemList";
import { ShowcaseTabs } from "@/components/admin/showcase/ShowcaseTabs";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import type {
  Exhibition,
  ExhibitionForm,
  HappyCustomer,
  HappyCustomerForm,
  HeroMedia,
  HeroMediaForm,
  ShowcaseItem,
  ShowcaseType,
  Testimonial,
  TestimonialForm,
} from "@/lib/showcase";

const emptyHappy: HappyCustomerForm = { name: "", caption: "", image: "" };
const emptyExhibition: ExhibitionForm = { title: "", location: "", description: "", image: "" };
const emptyTestimonial: TestimonialForm = { name: "", detail: "", body: "", stars: 5 };
const emptyHeroMedia: HeroMediaForm = { url: "", mediaType: "image", title: "", description: "", alt: "" };
const showcaseTypes: ShowcaseType[] = ["hero-media", "happy-customers", "exhibitions", "testimonials"];

async function uploadMedia(file: File, folder: "happy-customers" | "exhibitions" | "hero-media") {
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
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [heroMedia, setHeroMedia] = useState<HeroMedia[]>([]);
  const [happyForm, setHappyForm] = useState(emptyHappy);
  const [exhibitionForm, setExhibitionForm] = useState(emptyExhibition);
  const [testimonialForm, setTestimonialForm] = useState(emptyTestimonial);
  const [heroForm, setHeroForm] = useState(emptyHeroMedia);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [search, setSearch] = useState("");

  const loadItems = async () => {
    setIsLoading(true);
    try {
      const responses = await Promise.all(showcaseTypes.map((itemType) => fetch(`/api/showcase/${itemType}`)));
      const [heroData, customerData, exhibitionData, testimonialData] = await Promise.all(responses.map((response) => response.json()));
      setHeroMedia(heroData.items || []);
      setCustomers(customerData.items || []);
      setExhibitions(exhibitionData.items || []);
      setTestimonials(testimonialData.items || []);
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
    setTestimonialForm(emptyTestimonial);
    setHeroForm(emptyHeroMedia);
  };

  const handleUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || type === "testimonials") return;
    if (type === "hero-media" && file.type.startsWith("video/") && file.size > 25 * 1024 * 1024) {
      alert("Hero videos must be 25 MB or smaller.");
      event.target.value = "";
      return;
    }

    setIsUploading(true);
    try {
      const url = await uploadMedia(file, type);
      if (type === "happy-customers") setHappyForm((form) => ({ ...form, image: url }));
      else if (type === "exhibitions") setExhibitionForm((form) => ({ ...form, image: url }));
      else setHeroForm((form) => ({ ...form, url, mediaType: file.type.startsWith("video/") ? "video" : "image" }));
    } catch {
      alert("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  const activeItems: ShowcaseItem[] = type === "happy-customers" ? customers : type === "exhibitions" ? exhibitions : type === "testimonials" ? testimonials : heroMedia;
  const activeMediaUrl = type === "happy-customers" ? happyForm.image : type === "exhibitions" ? exhibitionForm.image : type === "hero-media" ? heroForm.url : "";
  const cannotAddHeroMedia = type === "hero-media" && !editingId && heroMedia.length >= 5;

  const saveItem = async () => {
    const payload = type === "happy-customers" ? happyForm : type === "exhibitions" ? exhibitionForm : type === "testimonials" ? testimonialForm : heroForm;
    const isValid = type === "happy-customers" ? happyForm.name && happyForm.image : type === "exhibitions" ? exhibitionForm.title && exhibitionForm.image : type === "testimonials" ? testimonialForm.name && testimonialForm.body : heroForm.url;
    if (!isValid) return;

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

  const editItem = (item: ShowcaseItem) => {
    setEditingId(item.id);
    if ("image" in item && "name" in item) setHappyForm({ name: item.name, caption: item.caption, image: item.image });
    else if ("image" in item) setExhibitionForm({ title: item.title, location: item.location, description: item.description, image: item.image });
    else if ("body" in item) setTestimonialForm({ name: item.name, detail: item.detail, body: item.body, stars: item.stars });
    else setHeroForm({ url: item.url, mediaType: item.mediaType, title: item.title, description: item.description, alt: item.alt });
  };

  const deleteItem = async (id: string) => {
    if (!confirm("Delete this item?")) return;
    const response = await fetch(`/api/showcase/${type}/${id}`, { method: "DELETE" });
    if (!response.ok) return alert("Could not delete this item. Please try again.");
    if (editingId === id) resetForm();
    await loadItems();
  };

  const reorderItems = async (from: number, to: number) => {
    if (to < 0 || to >= activeItems.length) return;
    const reordered = [...activeItems];
    const [moved] = reordered.splice(from, 1);
    reordered.splice(to, 0, moved);
    if (type === "happy-customers") setCustomers(reordered as HappyCustomer[]);
    else if (type === "exhibitions") setExhibitions(reordered as Exhibition[]);
    else if (type === "testimonials") setTestimonials(reordered as Testimonial[]);
    else setHeroMedia(reordered as HeroMedia[]);
    await Promise.all(reordered.map((item, index) => fetch(`/api/showcase/${type}/${item.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ order: index }) })));
  };

  const title = (item: ShowcaseItem) => "body" in item ? item.name : "name" in item ? item.name : "url" in item ? item.title || "Hero media" : item.title;
  const subtitle = (item: ShowcaseItem) => "body" in item ? item.detail : "caption" in item ? item.caption : "url" in item ? item.description : item.location;
  const filteredItems = activeItems.filter((item) => `${title(item)} ${subtitle(item)} ${"body" in item ? item.body : "alt" in item ? item.alt : ""}`.toLowerCase().includes(search.toLowerCase()));

  return <div className="flex min-h-screen max-w-full flex-col overflow-x-hidden bg-background">
    <Headers />
    <main className="mx-auto w-full min-w-0 max-w-6xl flex-grow overflow-x-hidden px-4 pb-12 pt-24">
      <Button variant="ghost" className="mb-6 px-0" onClick={() => router.push("/allproduct")}><ArrowLeft className="mr-2 h-4 w-4" /> Back to products</Button>
      <div className="mb-8"><h1 className="text-3xl font-bold">Showcase Management</h1><p className="text-muted-foreground">Manage hero media, customer photos, exhibitions, and About-page testimonials.</p></div>
      <Tabs value={type} onValueChange={(value) => { setType(value as ShowcaseType); resetForm(); }}>
        <ShowcaseTabs />
        {showcaseTypes.map((tab) => <TabsContent key={tab} value={tab} className="w-full min-w-0 max-w-full overflow-x-hidden"><div className="grid w-full min-w-0 max-w-full gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
          <ShowcaseForm type={type} editing={Boolean(editingId)} isSaving={isSaving} isUploading={isUploading} cannotAddHeroMedia={cannotAddHeroMedia} activeMediaUrl={activeMediaUrl} happyForm={happyForm} exhibitionForm={exhibitionForm} testimonialForm={testimonialForm} heroForm={heroForm} onHappyChange={setHappyForm} onExhibitionChange={setExhibitionForm} onTestimonialChange={setTestimonialForm} onHeroChange={setHeroForm} onUpload={handleUpload} onSave={saveItem} onCancel={resetForm} />
          <ShowcaseItemList items={activeItems} filteredItems={filteredItems} isLoading={isLoading} search={search} onSearchChange={setSearch} onMove={reorderItems} onEdit={editItem} onDelete={deleteItem} title={title} subtitle={subtitle} />
        </div></TabsContent>)}
      </Tabs>
    </main>
    <Footer />
  </div>;
}
