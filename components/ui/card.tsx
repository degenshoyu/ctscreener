import React from "react";
import classNames from "classnames";

export function Card({ className, ...props }) {
  return <div className={classNames("rounded-2xl shadow p-4 bg-[#202232]", className)} {...props} />;
}

export function CardContent({ className, ...props }) {
  return <div className={classNames("p-4", className)} {...props} />;
}
