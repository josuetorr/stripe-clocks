import { HandlerProps } from "../interfaces/index.js";
import {
  RenewFailedStripeHandler,
  RenewSuccessStripeHandler,
  StripeHandler,
} from "./index.js";

type HandlerType = "success" | "fail";

export default class StripeHandlerFactory {
  makeStripeHandler(props: HandlerProps, type: HandlerType): StripeHandler {
    switch (type) {
      case "success": {
        return new RenewSuccessStripeHandler(props);
      }
      case "fail": {
        return new RenewFailedStripeHandler(props);
      }
    }
  }
}
