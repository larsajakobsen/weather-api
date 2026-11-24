import type { ReactNode } from "react";

type AlertVariant = "info" | "warning" | "danger";

type AlertProps = {
  variant: AlertVariant;
  title: string;
  children?: ReactNode;
};

export function Alert({ variant, title, children }: AlertProps) {
  return (
    <div className={`alert alert-${variant}`} role={variant === "danger" ? "alert" : "status"}>
      <div>
        <strong>{title}</strong>
        {children ? <p>{children}</p> : null}
      </div>
    </div>
  );
}
