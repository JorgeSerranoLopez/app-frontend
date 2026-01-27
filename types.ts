export type ViewState = 'dashboard' | 'assistant' | 'result';

export type TruckSize = 'S' | 'M' | 'L' | 'XL';

export interface FurnitureItem {
  id: string;
  name: string;
  blocks: number; // Still useful for quick estimates, but shape is primary now
  shape: number[][]; // 1 = filled, 0 = empty space (for L-shapes)
  icon: 'box' | 'fridge' | 'washer' | 'sofa' | 'bed' | 'nightstand' | 'chair' | 'desk' | 'dining' | 'wardrobe' | 'bike' | 'tv' | 'microwave';
}

export interface SelectedItem extends FurnitureItem {
  instanceId: string;
  position?: { x: number; y: number }; // Coordinates on the grid
  color: string; // Visual color for the grid
}

// shape: array of rows. [[1,1], [1,1]] is a 2x2 square.
export const FURNITURE_CATALOG: FurnitureItem[] = [
  { 
    id: 'box', 
    name: 'Caja Standard', 
    blocks: 1, 
    shape: [[1]], 
    icon: 'box' 
  },
  { 
    id: 'nightstand', 
    name: 'Velador', 
    blocks: 1, 
    shape: [[1]], 
    icon: 'nightstand' 
  },
  { 
    id: 'microwave', 
    name: 'Horno / Microondas', 
    blocks: 1, 
    shape: [[1]], 
    icon: 'microwave' 
  },
  { 
    id: 'chair', 
    name: 'Silla de Oficina', 
    blocks: 2, 
    shape: [[1], [1]], // Vertical 1x2
    icon: 'chair' 
  },
  { 
    id: 'fridge', 
    name: 'Refrigerador', 
    blocks: 2, 
    shape: [[1], [1]], // Vertical 1x2
    icon: 'fridge' 
  },
  { 
    id: 'washer', 
    name: 'Lavadora', 
    blocks: 2, // Corrected to match shape roughly
    shape: [[1, 1]], // Horizontal 2x1
    icon: 'washer' 
  },
  { 
    id: 'bike', 
    name: 'Bicicleta', 
    blocks: 3, 
    shape: [[1, 1, 1]], // Long 3x1
    icon: 'bike' 
  },
  { 
    id: 'tv', 
    name: 'Televisor 65"', 
    blocks: 3, 
    shape: [[1, 1, 1]], // Long 3x1
    icon: 'tv' 
  },
  { 
    id: 'desk', 
    name: 'Escritorio', 
    blocks: 4, 
    shape: [[1, 1], [1, 1]], // Square 2x2
    icon: 'desk' 
  },
  { 
    id: 'sofa', 
    name: 'Sofá L', 
    blocks: 6, 
    shape: [
      [1, 0],
      [1, 0],
      [1, 1]
    ], // L-Shape: 3 tall, 2 wide at bottom
    icon: 'sofa' 
  },
  { 
    id: 'bed', 
    name: 'Cama King', 
    blocks: 6, 
    shape: [
      [1, 1],
      [1, 1],
      [1, 1]
    ], // 3x2 Rectangle
    icon: 'bed' 
  },
  { 
    id: 'wardrobe', 
    name: 'Ropero / Closet', 
    blocks: 8, 
    shape: [
      [1, 1],
      [1, 1],
      [1, 1],
      [1, 1]
    ], // 4x2 Tall Rectangle
    icon: 'wardrobe' 
  },
  { 
    id: 'dining', 
    name: 'Comedor', 
    blocks: 12, 
    shape: [
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1]
    ], // 4x3 Large Rectangle
    icon: 'dining' 
  },
];

export const TRUCK_DIMENSIONS = {
  S: 6,   // 6x6
  M: 8,   // 8x8
  L: 10,  // 10x10
  XL: 12, // 12x12
};

// Kept for backward compatibility in price calc
export const TRUCK_CAPACITY = {
  S: 36,
  M: 64,
  L: 100,
  XL: 144,
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