import { z } from "zod";

const createStripPaymentIntent = z.object({
  body: z.object({
    totalAmount: z.number({ required_error: "Total Amount is required" }),
  }),
});

const createSSLPaymentIntent = z.object({
  body: z.object({
    totalAmount: z.number({ required_error: "Total Amount is required" }),
  }),
});

export const PaymentValidation = {
  createStripPaymentIntent,
  createSSLPaymentIntent,
};
