import type { PaymentMethodType } from "@/lib/pricing";

export interface CreatePaymentInput {
  orderReference: string;
  amount: number;
  currency: "TRY";
  method: PaymentMethodType;
  customer: {
    fullName: string;
    email: string;
    phone: string;
    city: string;
  };
  basketItems: Array<{
    id: string;
    name: string;
    category: string;
    price: number;
  }>;
}

export interface CreatePaymentResult {
  paymentId: string;
  provider: "demo-test" | "iyzico" | "paytr";
  status: "requires_confirmation" | "succeeded" | "failed";
  testModeNotice: string;
  checkoutToken?: string;
}

export interface ConfirmPaymentInput {
  paymentId: string;
  scenario: "success" | "failure";
}

export interface ConfirmPaymentResult {
  paymentId: string;
  success: boolean;
  transactionReference?: string;
  errorMessage?: string;
  processedAt: string;
}

export interface PaymentProvider {
  createPayment(input: CreatePaymentInput): Promise<CreatePaymentResult>;
  confirmPayment(input: ConfirmPaymentInput): Promise<ConfirmPaymentResult>;
}

/**
 * Demo Test Modu Ödeme Sağlayıcısı
 * Gerçek kart verisi toplamaz, dış ağ isteği yapmaz.
 */
class DemoTestPaymentProvider implements PaymentProvider {
  async createPayment(input: CreatePaymentInput): Promise<CreatePaymentResult> {
    return {
      paymentId: `pay_demo_${Date.now()}_${input.orderReference}`,
      provider: "demo-test",
      status: "requires_confirmation",
      testModeNotice:
        "Demo: gerçek ödeme alınmaz, kart bilgisi girmeyin. Test düğmeleriyle başarılı veya başarısız ödeme senaryolarını deneyebilirsiniz.",
    };
  }

  async confirmPayment(input: ConfirmPaymentInput): Promise<ConfirmPaymentResult> {
    if (input.scenario === "failure") {
      return {
        paymentId: input.paymentId,
        success: false,
        errorMessage:
          "Test ödemesi simülasyonu: Banka provizyonu reddedildi (Yetersiz limit / 3D Secure doğrulama hatası). Lütfen tekrar deneyin veya farklı bir ödeme yöntemi seçin.",
        processedAt: new Date().toISOString(),
      };
    }

    return {
      paymentId: input.paymentId,
      success: true,
      transactionReference: `TRX-DEMO-${Math.floor(100000 + Math.random() * 899999)}`,
      processedAt: new Date().toISOString(),
    };
  }
}

/**
 * Canlı Mağaza (iyzico / PayTR) Sağlayıcı İskeleti
 * Anahtarlar yalnızca ortam değişkenlerinden (`process.env.PAYMENT_API_KEY`, `process.env.PAYMENT_SECRET_KEY`) okunur.
 */
export function getPaymentProviderConfig() {
  return {
    provider: (process.env.PAYMENT_PROVIDER as "demo-test" | "iyzico" | "paytr") || "demo-test",
    apiKey: process.env.PAYMENT_API_KEY,
    secretKey: process.env.PAYMENT_SECRET_KEY,
    baseUrl: process.env.PAYMENT_BASE_URL,
  };
}

const demoProvider = new DemoTestPaymentProvider();

export async function createPayment(
  input: CreatePaymentInput
): Promise<CreatePaymentResult> {
  return demoProvider.createPayment(input);
}

export async function confirmPayment(
  input: ConfirmPaymentInput
): Promise<ConfirmPaymentResult> {
  return demoProvider.confirmPayment(input);
}
