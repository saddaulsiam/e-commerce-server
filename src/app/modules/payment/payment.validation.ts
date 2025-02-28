import { z } from "zod";

const createPaymentIntent = z.object({
  body: z.object({
    totalAmount: z.number({ required_error: "Total Amount is required" }),
  }),
});

export const PaymentValidation = {
  createPaymentIntent,
};
