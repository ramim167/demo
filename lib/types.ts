export type EditionLabel =
  | "Player Version"
  | "Fan Version"
  | "Retro Jersey"
  | "Limited Drop";

export type InventoryBadge = "In Stock" | "Limited Edition" | "Low Stock";

export type MediaType = "image" | "video";
export type UserRole = "user" | "author";
export type DiscountTarget = "sitewide" | "product" | "collection";
export type DiscountMode = "percentage" | "fixed";
export type AuthorApprovalStatus =
  | "not_applicable"
  | "pending_verification"
  | "pending_approval"
  | "approved"
  | "rejected";

export interface ProductMedia {
  id: string;
  type: MediaType;
  src: string;
  alt: string;
  label: string;
}

export interface SizeStock {
  label: string;
  stock: number;
  fitNote?: string;
}

export interface ProductVariant {
  id: string;
  edition: EditionLabel;
  sku: string;
  price: number;
  compareAtPrice?: number;
  badge: InventoryBadge;
  fitProfile: string;
  sizes: SizeStock[];
}

export interface PatchOption {
  id: string;
  name: string;
  tournament: string;
  price: number;
  description: string;
}

export interface SizeGuideRow {
  size: string;
  chest: string;
  length: string;
  recommendation: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  team: string;
  league: string;
  sport: "Football" | "Cricket";
  category: "Club" | "National";
  accent: string;
  priceFrom: number;
  rating: number;
  reviewCount: number;
  heroTag: string;
  description: string;
  highlights: string[];
  tags: string[];
  collectionIds: string[];
  discountPercentage?: number;
  source?: "seed" | "author";
  imageUrl?: string;
  backImageUrl?: string;
  uploaderUid?: string;
  createdAt?: string;
  updatedAt?: string;
  media: ProductMedia[];
  variants: ProductVariant[];
  patches: PatchOption[];
  customization: {
    nameMax: number;
    numberRange: [number, number];
    sizeGuide: {
      player: SizeGuideRow[];
      fan: SizeGuideRow[];
    };
  };
}

export interface MenuSection {
  title: string;
  items: string[];
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string;
  accent: string;
  coverImage: string;
  featured?: boolean;
}

export interface DiscountRule {
  id: string;
  title: string;
  code: string;
  mode: DiscountMode;
  value: number;
  target: DiscountTarget;
  targetIds: string[];
  active: boolean;
}

export interface CartLine {
  id: string;
  productId: string;
  productSlug: string;
  name: string;
  variantId: string;
  variantLabel: string;
  size: string;
  quantity: number;
  unitPrice: number;
  heroTag: string;
  accent: string;
  customName?: string;
  customNumber?: number;
  patches: PatchOption[];
}

export interface TrackingEvent {
  status: string;
  date: string;
  note: string;
}

export interface TrackingOrder {
  orderId: string;
  phone: string;
  destination: string;
  eta: string;
  status: string;
  paymentMethod: string;
  items: string[];
  timeline: TrackingEvent[];
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  emailVerified: boolean;
  authorStatus: AuthorApprovalStatus;
  isMainAuthor?: boolean;
  approvalRequestedAt?: string;
  approvedAt?: string;
  approvedBy?: string;
  updatedAt?: string;
}

export interface SignInInput {
  name?: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface FirebaseEndpointConfig {
  signIn: string;
  signUp: string;
  refreshSession: string;
  productSync: string;
}
