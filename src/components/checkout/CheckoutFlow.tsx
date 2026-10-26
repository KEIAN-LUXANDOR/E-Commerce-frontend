"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Check, Lock, ShieldCheck } from "lucide-react";
import { AddressForm } from "@/components/account/AddressForm";
import { VerifyEmailNotice } from "@/components/account/VerifyEmailNotice";
import { NotAvailableYet } from "@/components/common/NotAvailableYet";
import { Spinner } from "@/components/common/Spinner";
import { SummaryLines } from "@/components/checkout/SummaryLines";
import { formatDateTime } from "@/components/orders/OrderBits";
import { usePayment } from "@/components/orders/PayNow";
import { ProductImage } from "@/components/product/ProductImage";
import { isEnabled } from "@/config/features";
import { getCheckoutEligibility } from "@/lib/api/account";
import { getDeliveryAddresses } from "@/lib/api/addresses";
import { ApiError } from "@/lib/api/client";
import { placeOrder } from "@/lib/api/orders";
import { gradeLine, shortTitle } from "@/lib/catalog/product";
import { formatINR } from "@/lib/format";
import { useSession } from "@/lib/session";
import { refreshCart, useCart } from "@/lib/shop/cart";
import { site } from "@/lib/site";
import type { DeliveryAddress } from "@/lib/types/address";
import type { Order } from "@/lib/types/order";
import { cn } from "@/lib/utils";

type Eligibility = "checking" | "ok" | "unverified" | "error";

/**
 * Checkout in three steps on one page:
 *   1. You — logged in, email verified (GET /account/checkout-eligibility)
 *   2. Delivery address (live /account/addresses)
 *   3. Review and pay — POST /account/orders, then Razorpay (planned: "orders", "payments")
 */
export function CheckoutFlow() {
  const router = useRouter();
  const session = useSession();
  const cart = useCart();
  const payment = usePayment();
  const [eligibility, setEligibility] = useState<Eligibility>("checking");
  const [addresses, setAddresses] = useState<DeliveryAddress[] | null>(null);
  const [addressId, setAddressId] = useState<string>();
  const [adding, setAdding] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState<string>();
  const [existing, setExisting] = useState<string>();
  const [placed, setPlaced] = useState<Order | null>(null);

  useEffect(() => {
    void refreshCart();
    let active = true;
    getCheckoutEligibility()
      .then(() => {
        if (active) setEligibility("ok");
      })
      .catch((e: unknown) => {
        if (!active) return;
        if (e instanceof ApiError && e.code === "EMAIL_NOT_VERIFIED") setEligibility("unverified");
        else if (e instanceof ApiError && e.status === 401) router.replace("/login?next=/checkout");
        else setEligibility("error");
      });
    getDeliveryAddresses()
      .then((list) => {
        if (!active) return;
        setAddresses(list);
        const preferred = list.find((a) => a.defaultAddress) ?? list[0];
        if (preferred) setAddressId(preferred.id);
        if (list.length === 0) setAdding(true);
      })
      .catch(() => {
        if (active) setAddresses([]);
      });
    return () => {
      active = false;
    };
  }, [router]);

  if (session.status === "loading" || cart.status === "loading") return <Spinner className="mt-10" label="Getting checkout ready" />;
  if (session.status === "guest") {
    return (
      <div className="mt-10 max-w-lg">
        <p className="text-lg">Please log in to check out.</p>
        <Link href="/login?next=/checkout" className="btn btn-primary mt-4">
          Log in
        </Link>
      </div>
    );
  }
  const user = session.user;

  if (cart.mode === "server" && cart.itemCount === 0 && !placed) {
    return (
      <div className="mt-10 max-w-lg">
        <p className="font-serif text-2xl">Your cart is empty</p>
        <Link href="/diamonds" className="btn btn-primary mt-4">
          Browse diamonds
        </Link>
      </div>
    );
  }

  const ordersOn = isEnabled("orders");
  const paymentsOn = isEnabled("payments");
  const verified = eligibility === "ok";
  const selected = addresses?.find((a) => a.id === addressId);
  const canPlace = verified && Boolean(selected) && agreed && !cart.hasUnavailableItems && !placing && !payment.busy;

  let placeLabel = `Place order and pay ${formatINR(cart.totalPaise)}`;
  if (!paymentsOn) placeLabel = "Place order";
  if (placing) placeLabel = "Placing your order…";

  async function submit() {
    if (!selected) return;
    setPlacing(true);
    setError(undefined);
    setExisting(undefined);
    try {
      const order = await placeOrder(selected.id);
      setPlaced(order);
      void refreshCart();
      if (paymentsOn) {
        const opened = await payment.pay(order.orderNumber);
        if (!opened) router.push(`/account/orders/${encodeURIComponent(order.orderNumber)}`);
      }
    } catch (e) {
      if (e instanceof ApiError && e.code === "PENDING_ORDER_EXISTS" && typeof e.body.orderNumber === "string") setExisting(e.body.orderNumber);
      if (e instanceof ApiError && e.code === "EMAIL_NOT_VERIFIED") setEligibility("unverified");
      if (e instanceof ApiError && e.code === "ITEM_SOLD") void refreshCart();
      setError(e instanceof Error ? e.message : "Couldn’t place your order. Please try again.");
    } finally {
      setPlacing(false);
    }
  }

  return (
    <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_24rem]">
      <div className="space-y-5">
        {/* Step 1 */}
        <Step number={1} title="Your details" done={verified}>
          <p className="text-sm">
            {user.fullName} · {user.email}
            {user.phone && ` · ${user.phone}`}
          </p>
          {eligibility === "checking" && <Spinner className="mt-3" label="Checking your account" />}
          {eligibility === "unverified" && <VerifyEmailNotice user={user} className="mt-4" />}
          {eligibility === "error" && <p className="mt-3 text-sm text-out">We couldn’t check your account just now. Please refresh the page.</p>}
          <p className="mt-2 text-sm text-slate">
            Order updates go to this email. <Link href="/account" className="link">Edit details</Link>
          </p>
        </Step>

        {/* Step 2 */}
        <Step number={2} title="Delivery address" done={Boolean(selected) && !adding}>
          {addresses === null && <Spinner label="Loading your addresses" />}
          {addresses && addresses.length > 0 && !adding && (
            <fieldset>
              <legend className="sr-only">Choose a delivery address</legend>
              <div className="grid gap-3 sm:grid-cols-2">
                {addresses.map((a) => (
                  <label key={a.id} className={cn("flex cursor-pointer gap-3 border p-4 text-sm transition-colors", a.id === addressId ? "border-ink bg-stone" : "border-line hover:border-line-dark")}>
                    <input type="radio" name="address" className="mt-1 size-4 accent-ink" checked={a.id === addressId} onChange={() => setAddressId(a.id)} />
                    <span className="text-ink-secondary">
                      <span className="block font-medium text-ink">{a.fullName}</span>
                      {a.line1}
                      {a.line2 && `, ${a.line2}`}
                      <br />
                      {a.city}, {a.state} {a.pincode}
                      <br />
                      Mobile {a.phone}
                    </span>
                  </label>
                ))}
                <button type="button" onClick={() => setAdding(true)} className="flex min-h-28 items-center justify-center border border-dashed border-line-dark p-4 text-sm hover:border-ink">
                  + Add a new address
                </button>
              </div>
            </fieldset>
          )}
          {addresses && adding && (
            <AddressForm
              defaultName={user.fullName}
              defaultPhone={user.phone}
              makeDefaultOption={addresses.length > 0}
              onCancel={addresses.length > 0 ? () => setAdding(false) : undefined}
              onSaved={(saved) => {
                setAddresses((list) => [saved, ...(list ?? [])]);
                setAddressId(saved.id);
                setAdding(false);
              }}
            />
          )}
          <p className="mt-3 text-sm text-slate">Free, fully insured delivery. Someone must be there to sign for it.</p>
        </Step>

        {/* Step 3 */}
        <Step number={3} title="Review and pay" done={false}>
          {!ordersOn && (
            <NotAvailableYet title="Online payment is being switched on" compact whatsappText={`Hello Keian Luxandor, I'd like to buy: ${cart.lines.map((l) => l.product.name).join(", ")}.`}>
              Your cart is saved. To buy now, message or call us and we’ll reserve the diamonds for you and send a secure payment link.
            </NotAvailableYet>
          )}
          {ordersOn && (
            <div className="space-y-4">
              {cart.hasUnavailableItems && (
                <p role="alert" className="text-sm text-out">
                  A diamond in your cart has been sold. <Link href="/cart" className="underline">Go back to your cart</Link> to remove it.
                </p>
              )}
              <label className="flex items-start gap-3 text-sm">
                <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-0.5 size-4 accent-ink" />
                <span>
                  I agree to the <Link href="/terms" className="link" target="_blank">terms of sale</Link> and the <Link href="/returns" className="link" target="_blank">{site.returnDays}-day returns policy</Link>.
                </span>
              </label>
              {error && (
                <p role="alert" className="text-sm text-out">
                  {error}{" "}
                  {existing && (
                    <Link href={`/account/orders/${encodeURIComponent(existing)}`} className="underline">
                      Open order {existing}
                    </Link>
                  )}
                </p>
              )}
              {payment.error && (
                <p role="alert" className="text-sm text-out">
                  {payment.error}
                </p>
              )}
              {placed && !paymentsOn && (
                <div role="status" className="border border-ok/30 bg-ok-bg p-4 text-sm text-ok">
                  Order {placed.orderNumber} is reserved until {formatDateTime(placed.expiresAt)}. Online payment isn’t switched on yet, so we’ll contact you with a secure payment link.{" "}
                  <Link href={`/account/orders/${encodeURIComponent(placed.orderNumber)}`} className="underline">
                    View order
                  </Link>
                </div>
              )}
              {!placed && (
                <button type="button" onClick={submit} disabled={!canPlace} className="btn btn-primary w-full">
                  <Lock className="size-4" aria-hidden />
                  {placeLabel}
                </button>
              )}
              {!verified && eligibility !== "checking" && <p className="text-sm text-slate">Verify your email (step 1) to continue.</p>}
              <p className="flex items-center gap-2 text-xs text-slate">
                <ShieldCheck className="size-4" aria-hidden /> Payments are handled by Razorpay. We never see your card details.
              </p>
            </div>
          )}
        </Step>
      </div>

      <aside aria-label="Order summary" className="lg:sticky lg:top-24 lg:self-start">
        <div className="border border-line bg-stone p-6">
          <h2 className="text-2xl">Your order</h2>
          <ul className="mt-4 divide-y divide-line">
            {cart.lines.map((l) => (
              <li key={l.variantId} className="flex gap-3 py-3">
                <span className="relative size-14 shrink-0 border border-line bg-white">
                  <ProductImage product={l.product} sizes="56px" />
                </span>
                <span className="min-w-0 flex-1 text-sm">
                  <span className="block font-medium">{shortTitle(l.product)}</span>
                  <span className="block truncate text-slate">{gradeLine(l.product)}</span>
                  {!l.available && <span className="block text-out">Sold</span>}
                </span>
                {l.available && l.pricePaise !== null && <span className="text-sm tabular-nums">{formatINR(l.pricePaise)}</span>}
              </li>
            ))}
          </ul>
          <div className="mt-4 border-t border-line pt-4">
            <SummaryLines subtotalPaise={cart.subtotalPaise} discountPaise={cart.discountPaise} couponCode={cart.coupon?.code} totalPaise={cart.totalPaise} />
          </div>
          <Link href="/cart" className="mt-4 inline-block text-sm underline underline-offset-4">
            Edit cart
          </Link>
        </div>
        <p className="mt-4 text-sm text-slate">
          Diamonds are held for you for {site.paymentWindowMinutes} minutes after you place the order, so nobody else can buy them while you pay.
        </p>
      </aside>
      {payment.mockDialog}
    </div>
  );
}

function Step({ number, title, done, children }: { number: number; title: string; done: boolean; children: React.ReactNode }) {
  return (
    <section className="border border-line bg-white p-5 sm:p-6" aria-labelledby={`step-${number}`}>
      <h2 id={`step-${number}`} className="flex items-center gap-3 text-2xl">
        <span className={cn("grid size-8 shrink-0 place-items-center text-sm font-sans", done ? "bg-ink text-white" : "border border-line-dark text-ink")}>
          {done ? <Check className="size-4" aria-hidden /> : number}
          {done && <span className="sr-only">Done:</span>}
        </span>
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}
