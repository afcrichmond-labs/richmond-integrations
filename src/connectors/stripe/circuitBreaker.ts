import CircuitBreaker from "opossum";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const breaker = new CircuitBreaker(
  (params: Stripe.PaymentIntentCreateParams) => stripe.paymentIntents.create(params),
  {
    timeout: 10000,
    errorThresholdPercentage: 50,
    resetTimeout: 10000,
    volumeThreshold: 5,
  }
);

breaker.on("open", () => console.warn("[Stripe] Circuit breaker OPEN"));
breaker.on("halfOpen", () => console.info("[Stripe] Circuit breaker HALF-OPEN"));
breaker.on("close", () => console.info("[Stripe] Circuit breaker CLOSED"));

export { breaker as stripeCircuitBreaker };
