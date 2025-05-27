import type { ComponentProps } from "react";

import { cn } from "../../utils/cn";

type Props = ComponentProps<"button"> & {
  loading?: boolean;
  loadingClassName?: string;
};

export function Button({
  loading,
  loadingClassName,
  children,
  ...props
}: Props) {
  return (
    <button disabled={loading} {...props}>
      {loading && (
        <div
          className={cn(
            "loading loading-spinner loading-sm absolute",
            loadingClassName,
          )}
        ></div>
      )}
      <span className={cn(loading && "opacity-0")}>{children}</span>
    </button>
  );
}
