import { ExtendedHandlerPros } from "../interfaces/index.js";
import {
  RenewFailedStripeHandler,
  RenewSuccessStripeHandler,
  StripeHandler,
} from "./index.js";

export default class StripeHandlerFactory {
  makeStripeHandler(options: ExtendedHandlerPros): StripeHandler {
    const { type, ...props } = options;
    if (type === "fail") {
      return new RenewFailedStripeHandler(props);
    }

    return new RenewSuccessStripeHandler(props);
  }
}
