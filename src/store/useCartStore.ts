import { create } from 'zustand';
import districtsData from '../data/districts.json';

export interface CartItemOption {
  size?: { id: string; nameAr: string; nameEn: string; priceDelta: number };
  milk?: { id: string; nameAr: string; nameEn: string; priceDelta: number };
  beans?: { id: string; nameAr: string; nameEn: string; origin: string; priceDelta: number };
  sweetness?: { id: string; nameAr: string; nameEn: string };
  ice?: { id: string; nameAr: string; nameEn: string };
  extraShot?: boolean;
  notes?: string;
}

export interface CartItem {
  id: string; // unique cart line id
  menuItemId: string;
  nameAr: string;
  nameEn: string;
  imageKey: string;
  unitPrice: number;
  quantity: number;
  options: CartItemOption;
}

export type FulfillmentType = 'delivery' | 'pickup' | 'curbside';

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  fulfillmentType: FulfillmentType;
  selectedDistrictId: string;
  selectedBranchId: string;
  promoCode: string | null;
  discountPercent: number;

  // Actions
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  setIsOpen: (isOpen: boolean) => void;
  toggleCart: () => void;
  setFulfillmentType: (type: FulfillmentType) => void;
  setSelectedDistrictId: (id: string) => void;
  setSelectedBranchId: (id: string) => void;
  applyPromoCode: (code: string) => boolean;
  removePromoCode: () => void;

  // Computed
  getSubtotal: () => number;
  getDeliveryFee: () => number;
  getDiscount: () => number;
  getVatAmount: () => number;
  getTotal: () => number;
  getTotalCount: () => number;
}

const STORAGE_KEY = 'aim_cart_state_v1';

// Safe localStorage helper wrapped in try/catch
function loadSavedCart(): Partial<CartState> {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        items: Array.isArray(parsed.items) ? parsed.items : [],
        fulfillmentType: parsed.fulfillmentType || 'curbside',
        selectedDistrictId: parsed.selectedDistrictId || 'al-malqa',
        selectedBranchId: parsed.selectedBranchId || 'al-malqa',
        promoCode: parsed.promoCode || null,
        discountPercent: parsed.discountPercent || 0,
      };
    }
  } catch (err) {
    console.warn('[CartStore] Failed to load saved cart:', err);
  }
  return {};
}

function saveCart(state: CartState) {
  try {
    const toSave = {
      items: state.items,
      fulfillmentType: state.fulfillmentType,
      selectedDistrictId: state.selectedDistrictId,
      selectedBranchId: state.selectedBranchId,
      promoCode: state.promoCode,
      discountPercent: state.discountPercent,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch (err) {
    console.warn('[CartStore] Failed to save cart state:', err);
  }
}

const initialSaved = loadSavedCart();

export const useCartStore = create<CartState>((set, get) => ({
  items: initialSaved.items || [],
  isOpen: false,
  fulfillmentType: initialSaved.fulfillmentType || 'curbside',
  selectedDistrictId: initialSaved.selectedDistrictId || 'al-malqa',
  selectedBranchId: initialSaved.selectedBranchId || 'al-malqa',
  promoCode: initialSaved.promoCode || null,
  discountPercent: initialSaved.discountPercent || 0,

  addItem: (newItem) => {
    set((state) => {
      // Build unique signature based on menuItemId and selected options
      const optSig = JSON.stringify({
        size: newItem.options.size?.id,
        milk: newItem.options.milk?.id,
        beans: newItem.options.beans?.id,
        sweet: newItem.options.sweetness?.id,
        ice: newItem.options.ice?.id,
        extraShot: newItem.options.extraShot,
        notes: newItem.options.notes?.trim() || '',
      });
      const uniqueId = `${newItem.menuItemId}__${btoa(encodeURIComponent(optSig)).slice(0, 16)}`;

      const existingIndex = state.items.findIndex((item) => item.id === uniqueId);
      let updatedItems: CartItem[];

      if (existingIndex > -1) {
        updatedItems = state.items.map((item, idx) =>
          idx === existingIndex
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item
        );
      } else {
        updatedItems = [...state.items, { ...newItem, id: uniqueId }];
      }

      const nextState = { ...state, items: updatedItems, isOpen: true };
      saveCart(nextState as CartState);
      return { items: updatedItems, isOpen: true };
    });
  },

  removeItem: (id) => {
    set((state) => {
      const updated = state.items.filter((item) => item.id !== id);
      const nextState = { ...state, items: updated };
      saveCart(nextState as CartState);
      return { items: updated };
    });
  },

  updateQuantity: (id, delta) => {
    set((state) => {
      const updated = state.items
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];

      const nextState = { ...state, items: updated };
      saveCart(nextState as CartState);
      return { items: updated };
    });
  },

  clearCart: () => {
    set((state) => {
      const nextState = { ...state, items: [], promoCode: null, discountPercent: 0 };
      saveCart(nextState as CartState);
      return { items: [], promoCode: null, discountPercent: 0 };
    });
  },

  setIsOpen: (isOpen) => set({ isOpen }),
  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

  setFulfillmentType: (fulfillmentType) => {
    set((state) => {
      const next = { ...state, fulfillmentType };
      saveCart(next as CartState);
      return { fulfillmentType };
    });
  },

  setSelectedDistrictId: (selectedDistrictId) => {
    set((state) => {
      const next = { ...state, selectedDistrictId };
      saveCart(next as CartState);
      return { selectedDistrictId };
    });
  },

  setSelectedBranchId: (selectedBranchId) => {
    set((state) => {
      const next = { ...state, selectedBranchId };
      saveCart(next as CartState);
      return { selectedBranchId };
    });
  },

  applyPromoCode: (rawCode) => {
    const code = rawCode.trim().toUpperCase();
    if (code === 'AIM2026' || code === 'RIYADH' || code === 'AIM15') {
      set((state) => {
        const next = { ...state, promoCode: code, discountPercent: 15 };
        saveCart(next as CartState);
        return { promoCode: code, discountPercent: 15 };
      });
      return true;
    }
    return false;
  },

  removePromoCode: () => {
    set((state) => {
      const next = { ...state, promoCode: null, discountPercent: 0 };
      saveCart(next as CartState);
      return { promoCode: null, discountPercent: 0 };
    });
  },

  getSubtotal: () => {
    return get().items.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
  },

  getDeliveryFee: () => {
    const { fulfillmentType, selectedDistrictId } = get();
    if (fulfillmentType !== 'delivery') return 0;
    const district = districtsData.find((d) => d.id === selectedDistrictId);
    return district ? district.fee : 15;
  },

  getDiscount: () => {
    const { discountPercent } = get();
    const subtotal = get().getSubtotal();
    return discountPercent > 0 ? (subtotal * discountPercent) / 100 : 0;
  },

  getVatAmount: () => {
    // 15% VAT is inclusive in consumer prices in Saudi Arabia
    // Base amount = Total / 1.15; VAT = Total - Base
    const total = get().getTotal();
    return Math.round((total - total / 1.15) * 100) / 100;
  },

  getTotal: () => {
    const subtotal = get().getSubtotal();
    const delivery = get().getDeliveryFee();
    const discount = get().getDiscount();
    return Math.max(0, subtotal - discount + delivery);
  },

  getTotalCount: () => {
    return get().items.reduce((acc, item) => acc + item.quantity, 0);
  },
}));
