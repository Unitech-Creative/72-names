import clsx from "clsx";
import { Lock } from "lucide-react";
import { PaymentIcon } from "@/components/PaymentIcon";

export function PaymentSeals({ featured }) {
  return (
    <div
      className={clsx(
        "flex flex-col space-y-2",
        featured ? "text-white" : "text-black"
      )}
    >
      <div className="flex place-content-between">
        <SafeAndSecure />
        <PaymentIcon
          type="PoweredByStripe"
          className="h-[41px] w-[149px] items-start"
        />
      </div>
      <div className="flex place-content-center space-x-2">
        {/* <PaymentIcon type="Apple" className="w-6" /> */}
        <PaymentIcon type="Google" className="w-6" />
        <PaymentIcon type="Visa" className="w-6" />
        <PaymentIcon type="Mastercard" className="w-6" />
        <PaymentIcon type="Amex" className="w-6" />
        <PaymentIcon type="Discover" className="w-6" />
      </div>
    </div>
  );
}

function SafeAndSecure() {
  return (
    <div className="flex place-items-center space-x-2 text-xs">
      <LockClosedIcon className="-mt-0.5 h-4 w-4" />
      <span>
        Guaranteed <strong>safe &amp; secure</strong> checkout
      </span>
    </div>
  );
}
