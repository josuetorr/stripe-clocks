import { ExtendedHandlerPros } from "../interfaces/index.js";
import { StripeHandler } from "./index.js";
import RenewFailedStripeHandler from "./RenewFailedStripeHandler.js";
import RenewSuccessStripeHandler from "./RenewSuccessStripeHandler.js";

export default class StripeHandlerFactory {
  makeStripeHandler(options: ExtendedHandlerPros): StripeHandler {
    const { type, ...props } = options;
    if (type === "fail") {
      return new RenewFailedStripeHandler(props);
    }

    return new RenewSuccessStripeHandler(props);
  }
}
