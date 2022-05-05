export interface Card {
  number: string;
  exp_month: number;
  exp_year: number;
  cvc: string;
}

export interface HandlerProps {
  email?: string;
  customerId?: string;
  paymentMethod?: string;
  cardNumber?: string;
  exp?: string;
  cvc?: string;
  startAt?: string;
  endAt?: string;
  name?: string;
  help?: string;
  apiKey?: string;
}
