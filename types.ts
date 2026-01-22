export type ViewState = 'dashboard' | 'assistant' | 'result';

export interface FurnitureItem {
  id: string;
  name: string;
  blocks: number; // Unit blocks (50x50cm)
  icon: 'box' | 'fridge' | 'washer' | 'sofa' | 'bed';
}

export interface SelectedItem extends FurnitureItem {
  instanceId: string; // Unique ID for this specific instance in the cart
}

export const FURNITURE_CATALOG: FurnitureItem[] = [
  { id: 'box', name: 'Caja Standard', blocks: 1, icon: 'box' },
  { id: 'fridge', name: 'Refrigerador', blocks: 2, icon: 'fridge' },
  { id: 'washer', name: 'Lavadora', blocks: 3, icon: 'washer' },
  { id: 'sofa', name: 'Sofá 3 Cuerpos', blocks: 6, icon: 'sofa' },
  { id: 'bed', name: 'Cama King', blocks: 8, icon: 'bed' },
];

export const TRUCK_CAPACITY = {
  S: 36, // 6x6
  M: 64, // 8x8
};