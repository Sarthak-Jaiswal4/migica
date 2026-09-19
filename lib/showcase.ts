export type HappyCustomer = {
  id: string;
  name: string;
  caption: string;
  image: string;
  order: number;
};

export type Exhibition = {
  id: string;
  title: string;
  location: string;
  description: string;
  image: string;
  order: number;
};

export type Testimonial = {
  id: string;
  body: string;
  name: string;
  detail: string;
  stars: number;
  order: number;
};

export type HeroMedia = {
  id: string;
  url: string;
  mediaType: "image" | "video";
  title: string;
  description: string;
  alt: string;
  order: number;
};

export type Certificate = { id: string; title: string; issuer: string; awardedOn: string; description: string; image: string; order: number };

export type ShowcaseType = "happy-customers" | "exhibitions" | "testimonials" | "hero-media" | "certificates";
export type ShowcaseItem = HappyCustomer | Exhibition | Testimonial | HeroMedia | Certificate;
export type HappyCustomerForm = Omit<HappyCustomer, "id" | "order">;
export type ExhibitionForm = Omit<Exhibition, "id" | "order">;
export type TestimonialForm = Omit<Testimonial, "id" | "order">;
export type HeroMediaForm = Omit<HeroMedia, "id" | "order">;
export type CertificateForm = Omit<Certificate, "id" | "order">;
