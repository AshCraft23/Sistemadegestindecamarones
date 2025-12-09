"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "./utils";

export function Tabs({ className, ...props }) {
  return (
    <TabsPrimitive.Root className={cn("flex flex-col gap-2", className)} {...props} />
  );
}

export function TabsList({ className, ...props }) {
  return (
    <TabsPrimitive.List
      className={cn(
        "inline-flex h-9 items-center justify-center rounded-xl bg-muted p-1",
        className
      )}
      {...props}
    />
  );
}

export function TabsTrigger({ className, ...props }) {
  return (
    <TabsPrimitive.Trigger
      className={cn(
        "inline-flex flex-1 items-center justify-center rounded-md px-3 py-1 text-sm",
        "data-[state=active]:bg-background data-[state=active]:text-foreground",
        "hover:bg-accent hover:text-accent-foreground",
        className
      )}
      {...props}
    />
  );
}

export function TabsContent({ className, ...props }) {
  return (
    <TabsPrimitive.Content className={cn("mt-2", className)} {...props} />
  );
}
