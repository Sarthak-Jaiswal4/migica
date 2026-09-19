import { ChangeEvent, useRef } from "react";
import { ImagePlus, Loader2, Save, Video } from "lucide-react";
import { AppImage as Image } from "@/components/AppImage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { CertificateForm, ExhibitionForm, HappyCustomerForm, HeroMediaForm, ShowcaseType, TestimonialForm } from "@/lib/showcase";

type Props = {
  type: ShowcaseType;
  editing: boolean;
  isSaving: boolean;
  isUploading: boolean;
  cannotAddHeroMedia: boolean;
  activeMediaUrl: string;
  happyForm: HappyCustomerForm;
  exhibitionForm: ExhibitionForm;
  testimonialForm: TestimonialForm;
  heroForm: HeroMediaForm;
  certificateForm: CertificateForm;
  onHappyChange: (form: HappyCustomerForm) => void;
  onExhibitionChange: (form: ExhibitionForm) => void;
  onTestimonialChange: (form: TestimonialForm) => void;
  onHeroChange: (form: HeroMediaForm) => void;
  onCertificateChange: (form: CertificateForm) => void;
  onUpload: (event: ChangeEvent<HTMLInputElement>) => void;
  onSave: () => void;
  onCancel: () => void;
};

export function ShowcaseForm(props: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { type, heroForm, activeMediaUrl, cannotAddHeroMedia } = props;
  const showsUpload = type !== "testimonials";

  return (
    <Card className="h-fit w-full min-w-0 max-w-full overflow-hidden">
      <CardHeader><CardTitle>{props.editing ? "Edit item" : "Add item"}</CardTitle></CardHeader>
      <CardContent className="space-y-5">
        {showsUpload && <>
          <button type="button" disabled={cannotAddHeroMedia} onClick={() => inputRef.current?.click()} className="relative flex h-52 w-full items-center justify-center overflow-hidden rounded-lg border border-dashed border-border bg-muted/40 disabled:opacity-50 sm:h-auto sm:aspect-square">
            {activeMediaUrl
              ? type === "hero-media" && heroForm.mediaType === "video"
                ? <video src={activeMediaUrl} muted className="h-full w-full object-cover" />
                : <Image src={activeMediaUrl} alt="Upload preview" fill className="object-cover" />
              : props.isUploading ? <Loader2 className="animate-spin" />
                : type === "hero-media" ? <Video className="h-7 w-7 text-muted-foreground" />
                  : <ImagePlus className="h-7 w-7 text-muted-foreground" />}
          </button>
          <input ref={inputRef} type="file" accept={type === "hero-media" ? "image/*,video/*" : "image/*"} className="hidden" onChange={props.onUpload} />
        </>}

        {type === "hero-media" && <HeroFields {...props} />}
        {type === "happy-customers" && <HappyFields {...props} />}
        {type === "exhibitions" && <ExhibitionFields {...props} />}
        {type === "certificates" && <CertificateFields {...props} />}
        {type === "testimonials" && <TestimonialFields {...props} />}

        <div className="flex gap-3">
          <Button className="flex-1" onClick={props.onSave} disabled={props.isSaving || props.isUploading || cannotAddHeroMedia}>
            <Save className="mr-2 h-4 w-4" />{props.isSaving ? "Saving..." : props.editing ? "Save changes" : "Add item"}
          </Button>
          {props.editing && <Button variant="outline" onClick={props.onCancel}>Cancel</Button>}
        </div>
      </CardContent>
    </Card>
  );
}

function HeroFields({ heroForm, onHeroChange, cannotAddHeroMedia }: Props) {
  return <><p className="text-sm text-muted-foreground">Upload up to five hero images or videos. Hero videos must be 25 MB or smaller. The first item appears first on the homepage.</p>{cannotAddHeroMedia && <p className="text-sm font-medium text-amber-700">Five hero items are already uploaded. Delete one before adding another.</p>}<Field label="Heading" id="hero-title"><Input id="hero-title" value={heroForm.title} onChange={(e) => onHeroChange({ ...heroForm, title: e.target.value })} /></Field><Field label="Description" id="hero-description"><Textarea id="hero-description" value={heroForm.description} onChange={(e) => onHeroChange({ ...heroForm, description: e.target.value })} /></Field><Field label="Image/video description" id="hero-alt"><Input id="hero-alt" value={heroForm.alt} onChange={(e) => onHeroChange({ ...heroForm, alt: e.target.value })} /></Field></>;
}

function HappyFields({ happyForm, onHappyChange }: Props) {
  return <><Field label="Customer name" id="customer-name"><Input id="customer-name" value={happyForm.name} onChange={(e) => onHappyChange({ ...happyForm, name: e.target.value })} /></Field><Field label="Caption" id="customer-caption"><Textarea id="customer-caption" value={happyForm.caption} onChange={(e) => onHappyChange({ ...happyForm, caption: e.target.value })} /></Field></>;
}

function ExhibitionFields({ exhibitionForm, onExhibitionChange }: Props) {
  return <><Field label="Title" id="exhibition-title"><Input id="exhibition-title" value={exhibitionForm.title} onChange={(e) => onExhibitionChange({ ...exhibitionForm, title: e.target.value })} /></Field><Field label="Location" id="exhibition-location"><Input id="exhibition-location" value={exhibitionForm.location} onChange={(e) => onExhibitionChange({ ...exhibitionForm, location: e.target.value })} /></Field><Field label="Description" id="exhibition-description"><Textarea id="exhibition-description" value={exhibitionForm.description} onChange={(e) => onExhibitionChange({ ...exhibitionForm, description: e.target.value })} /></Field></>;
}

function CertificateFields({ certificateForm, onCertificateChange }: Props) {
  return <><Field label="Certificate, award, or degree title" id="certificate-title"><Input id="certificate-title" value={certificateForm.title} onChange={(e) => onCertificateChange({ ...certificateForm, title: e.target.value })} /></Field><Field label="Issued by / awarding organisation" id="certificate-issuer"><Input id="certificate-issuer" value={certificateForm.issuer} onChange={(e) => onCertificateChange({ ...certificateForm, issuer: e.target.value })} /></Field><Field label="Date or year awarded" id="certificate-date"><Input id="certificate-date" placeholder="2026 or June 2026" value={certificateForm.awardedOn} onChange={(e) => onCertificateChange({ ...certificateForm, awardedOn: e.target.value })} /></Field><Field label="Description" id="certificate-description"><Textarea id="certificate-description" value={certificateForm.description} onChange={(e) => onCertificateChange({ ...certificateForm, description: e.target.value })} /></Field></>;
}

function TestimonialFields({ testimonialForm, onTestimonialChange }: Props) {
  return <><Field label="Name" id="testimonial-name"><Input id="testimonial-name" value={testimonialForm.name} onChange={(e) => onTestimonialChange({ ...testimonialForm, name: e.target.value })} /></Field><Field label="Customer detail" id="testimonial-detail"><Input id="testimonial-detail" placeholder="Mumbai · Loyal customer" value={testimonialForm.detail} onChange={(e) => onTestimonialChange({ ...testimonialForm, detail: e.target.value })} /></Field><Field label="Testimonial" id="testimonial-body"><Textarea id="testimonial-body" value={testimonialForm.body} onChange={(e) => onTestimonialChange({ ...testimonialForm, body: e.target.value })} /></Field><Field label="Rating (1–5)" id="testimonial-stars"><Input id="testimonial-stars" type="number" min="1" max="5" value={testimonialForm.stars} onChange={(e) => onTestimonialChange({ ...testimonialForm, stars: Math.max(1, Math.min(5, Number(e.target.value) || 1)) })} /></Field></>;
}

function Field({ label, id, children }: { label: string; id: string; children: React.ReactNode }) {
  return <div className="space-y-2"><Label htmlFor={id}>{label}</Label>{children}</div>;
}
