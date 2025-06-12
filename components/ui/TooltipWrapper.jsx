"use client";
import * as Tooltip from "@radix-ui/react-tooltip";

export default function TooltipWrapper({ children, label }) {
  return (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            className="bg-gray-800 text-white text-xs rounded px-2 py-1 shadow-md"
            side="right"
            sideOffset={8}
          >
            {label}
            <Tooltip.Arrow className="fill-gray-800" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}

