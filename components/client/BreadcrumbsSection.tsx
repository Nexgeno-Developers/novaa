"use client";

import React from "react";
import Breadcrumbs from "@/components/client/Breadcrumbs";

interface BreadcrumbsSectionProps {
  title?: string;
  description?: string;
  backgroundImageUrl?: string;
  [key: string]: unknown;
  pageSlug?: string;
}

export default function BreadcrumbsSection({
  title = "About Us",
  description = "",
  backgroundImageUrl = "/images/breadcrumb-bg.png",
  pageSlug,
  ...props
}: BreadcrumbsSectionProps) {
  return (
    <Breadcrumbs
      title={title}
      description={description}
      backgroundImageUrl={backgroundImageUrl}
      pageSlug={pageSlug}
      {...props}
    />
  );
}
