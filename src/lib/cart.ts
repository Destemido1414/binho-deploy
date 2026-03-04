export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  priceCents: number;
  imageUrl: string | null;
  quantity: number;
};

const KEY = "motopecas_cart_v1";

export function readCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed as CartItem[];
  } catch {
    return [];
  }
}

export function writeCart(items: CartItem[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(items));
}

export function addToCart(next: Omit<CartItem, "quantity">, quantity = 1) {
  const cart = readCart();
  const idx = cart.findIndex((i) => i.productId === next.productId);
  if (idx >= 0) {
    cart[idx] = { ...cart[idx], quantity: cart[idx].quantity + quantity };
  } else {
    cart.push({ ...next, quantity });
  }
  writeCart(cart);
  return cart;
}

export function setQuantity(productId: string, quantity: number) {
  const cart = readCart()
    .map((i) => (i.productId === productId ? { ...i, quantity } : i))
    .filter((i) => i.quantity > 0);
  writeCart(cart);
  return cart;
}

export function clearCart() {
  writeCart([]);
}

