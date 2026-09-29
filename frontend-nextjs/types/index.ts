export type Status = "active" | "inactive" | "published" | "draft" | "pending" | "processed" | "confirmed" | "cancelled";

export type Service = {
  id: number;
  title: string;
  slug: string;
  short_description: string;
  description: string;
  image?: string;
  icon?: string;
  price?: string;
  display_order: number;
  status: Status;
};

export type BlogPost = {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image?: string;
  category?: string;
  author?: string;
  meta_title?: string;
  meta_description?: string;
  published_at?: string;
};

export type Testimonial = {
  id: number;
  client_name: string;
  profession?: string;
  photo?: string;
  rating: number;
  comment: string;
};

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
  errors?: Record<string, string[]>;
};
