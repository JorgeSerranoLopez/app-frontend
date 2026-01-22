export type ViewState = 'dashboard' | 'assistant' | 'result';

export interface FurnitureItem {
  id: string;
  name: string;
  blocks: number; // Unit blocks (50x50cm)
  icon: 'box' | 'fridge' | 'washer' | 'sofa' | 'bed' | 'nightstand' | 'chair' | 'desk' | 'dining' | 'wardrobe' | 'bike' | 'tv' | 'microwave';
}

export interface SelectedItem extends FurnitureItem {
  instanceId: string; // Unique ID for this specific instance in the cart
}

export const FURNITURE_CATALOG: FurnitureItem[] = [
  { id: 'box', name: 'Caja Standard', blocks: 1, icon: 'box' },
  { id: 'nightstand', name: 'Velador', blocks: 1, icon: 'nightstand' },
  { id: 'microwave', name: 'Horno / Microondas', blocks: 1, icon: 'microwave' },
  { id: 'chair', name: 'Silla de Oficina', blocks: 2, icon: 'chair' },
  { id: 'fridge', name: 'Refrigerador', blocks: 2, icon: 'fridge' },
  { id: 'washer', name: 'Lavadora', blocks: 3, icon: 'washer' },
  { id: 'bike', name: 'Bicicleta', blocks: 3, icon: 'bike' },
  { id: 'tv', name: 'Televisor 65"', blocks: 3, icon: 'tv' },
  { id: 'desk', name: 'Escritorio', blocks: 4, icon: 'desk' },
  { id: 'sofa', name: 'Sofá 3 Cuerpos', blocks: 6, icon: 'sofa' },
  { id: 'bed', name: 'Cama King', blocks: 8, icon: 'bed' },
  { id: 'wardrobe', name: 'Ropero / Closet', blocks: 10, icon: 'wardrobe' },
  { id: 'dining', name: 'Comedor (Mesa + 6 Sillas)', blocks: 12, icon: 'dining' },
];

export const TRUCK_CAPACITY = {
  S: 36,   // 6x6
  M: 64,   // 8x8
  L: 100,  // 10x10
  XL: 144, // 12x12
};

export const TRUCK_BASE_PRICES = {
  S: 45000,
  M: 85000,
  L: 130000,
  XL: 180000,
};

export const PRICE_PER_KM = 1500;

export const COMUNAS_RM = [
  "Santiago Centro", "Providencia", "Las Condes", "Ñuñoa", "Vitacura", 
  "La Reina", "Lo Barnechea", "Macul", "Peñalolén", "La Florida", 
  "Maipú", "Estación Central", "San Miguel", "San Joaquín", "Independencia",
  "Recoleta", "Huechuraba", "Quilicura", "Pudahuel", "Puente Alto"
];

export interface Quote {
  id: string;
  date: string;
  origin: string;
  destination: string;
  distance: number;
  truck: string;
  blocks: number;
  basePrice: number;
  distancePrice: number;
  totalPrice: number;
  status: 'Reservado' | 'Completado' | 'Pendiente';
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  history: Quote[];
}