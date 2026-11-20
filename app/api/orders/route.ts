import { NextResponse } from "next/server";
import { products } from "../../data/products";
import { getProductTotalPrice } from "../../data/products/pricing";

const MINIMUM_ORDER_VALUE = 400;
const FREE_SHIPPING_THRESHOLD = 750;
const MINIMUM_SHIPPING_CHARGE = 80;
const MAXIMUM_SHIPPING_CHARGE = 100;
const MAX_CART_ITEMS = 50;
const MAX_QUANTITY_PER_ITEM = 100;

type CheckoutItem = {
  id: string;
  quantity: number;
};

function isCheckoutItem(value: unknown): value is CheckoutItem {
  if (!value || typeof value !== "object") return false;

  const item = value as Record<string, unknown>;
  return typeof item.id === "string"
    && Number.isInteger(item.quantity)
    && (item.quantity as number) > 0
    && (item.quantity as number) <= MAX_QUANTITY_PER_ITEM;
}

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "The order details were not valid JSON." }, { status: 400 });
  }

  if (!payload || typeof payload !== "object") {
    return NextResponse.json({ error: "Order items are required." }, { status: 400 });
  }

  const orderData = payload as Record<string, unknown>;
  if (orderData.name !== undefined && typeof orderData.name !== "string") {
    return NextResponse.json({ error: "The customer name must be text." }, { status: 400 });
  }
  const rawCustomerName = typeof orderData.name === "string" ? orderData.name.trim() : "";
  if (rawCustomerName.length > 100) {
    return NextResponse.json({ error: "The customer name must be no more than 100 characters." }, { status: 400 });
  }
  if (!Array.isArray(orderData.items)) {
    return NextResponse.json({ error: "Order items are required." }, { status: 400 });
  }

  const customerName = rawCustomerName.replace(/\s+/g, " ");
  const requestedItems: unknown[] = orderData.items;
  if (requestedItems.length === 0 || requestedItems.length > MAX_CART_ITEMS || !requestedItems.every(isCheckoutItem)) {
    return NextResponse.json({ error: "The order must contain between 1 and 50 valid items." }, { status: 400 });
  }

  const items = requestedItems.map((item) => {
    const checkoutItem = item as CheckoutItem;
    const product = products.find(({ id }) => id === checkoutItem.id);
    return product ? { product, quantity: checkoutItem.quantity } : null;
  });

  if (items.some((item) => item === null)) {
    return NextResponse.json({ error: "The order contains a product that is no longer available." }, { status: 400 });
  }

  const validItems = items.filter((item): item is NonNullable<typeof item> => item !== null);
  const subtotal = validItems.reduce(
    (total, { product, quantity }) => total + getProductTotalPrice(product, quantity),
    0,
  );
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD
    ? 0
    : Math.round(
      MAXIMUM_SHIPPING_CHARGE
      - ((Math.max(subtotal, MINIMUM_ORDER_VALUE) - MINIMUM_ORDER_VALUE)
        / (FREE_SHIPPING_THRESHOLD - MINIMUM_ORDER_VALUE))
      * (MAXIMUM_SHIPPING_CHARGE - MINIMUM_SHIPPING_CHARGE),
    );
  const order = {
    name: customerName,
    items: validItems.map(({ product, quantity }) => ({
      description: `${quantity} × ${product.name} — ₹${getProductTotalPrice(product, quantity)}`,
      quantity,
      lineTotal: getProductTotalPrice(product, quantity),
    })),
    subtotal,
    shipping,
    total: subtotal + shipping,
    status: "Checkout started",
  };

  const scriptUrl = process.env.GOOGLE_SHEETS_WEB_APP_URL;
  const secret = process.env.GOOGLE_SHEETS_WEBHOOK_SECRET;
  if (!scriptUrl || !secret) {
    return NextResponse.json({ error: "Google Sheets recording is not configured on the website yet." }, { status: 503 });
  }

  try {
    const response = await fetch(scriptUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...order, secret }),
      cache: "no-store",
      signal: AbortSignal.timeout(10000),
    });
    const result: unknown = await response.json();

    if (!response.ok || !result || typeof result !== "object" || (result as { ok?: unknown }).ok !== true) {
      console.error("Google Sheets order recording failed.", result);
      return NextResponse.json({ error: "Google Sheets could not save the order. Check the Apps Script setup." }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Google Sheets order recording request failed.", error);
    return NextResponse.json({ error: "Could not reach Google Sheets. Please try again or send the order on WhatsApp." }, { status: 502 });
  }
}
