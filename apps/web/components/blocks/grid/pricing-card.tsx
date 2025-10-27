import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { stegaClean } from "next-sanity";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { PAGE_QUERYResult, ColorVariant } from "@/sanity.types";

type Block = NonNullable<NonNullable<PAGE_QUERYResult>["blocks"]>[number];
type GridRow = Extract<Block, { _type: "grid-row" }>;
type GridColumn = NonNullable<NonNullable<GridRow["columns"]>>[number];
type PricingCard = Extract<GridColumn, { _type: "pricing-card" }>;

interface PricingCardProps extends Omit<PricingCard, "_type" | "_key"> {
  color?: ColorVariant;
}

export default function PricingCard({
  color,
  title,
  tagLine,
  excerpt,
  price,
  list,
  link,
}: PricingCardProps) {
  // Helper function to safely extract text from strings or custom text objects
  const getText = (value: any): string => {
    if (typeof value === "string") return value;
    if (value && typeof value === "object" && "text" in value) return value.text;
    return "";
  };

  const titleText = getText(title);
  const tagLineText = getText(tagLine);
  const excerptText = getText(excerpt);

  return (
    <div
      key={titleText}
      className="flex w-full rounded-3xl ring-offset-background focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 group"
    >
      <div className="flex w-full flex-col justify-between border rounded-3xl p-8">
        <div
          className={cn(color === "primary" ? "text-background" : undefined)}
        >
          {titleText && (
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-xl leading-[1.2]">{titleText}</h3>
              {tagLineText && <Badge>{tagLineText}</Badge>}
            </div>
          )}
          {price && price.value !== null && price.value !== undefined && (
            <div className="flex items-end my-8 gap-1">
              <div className="text-3xl font-bold leading-none">
                ${price.value}
              </div>
              {price.period && <div className="text-sm">{price.period}</div>}
            </div>
          )}
          {list && list.length > 0 && (
            <ul className="flex flex-col gap-2 my-8">
              {list.map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <Check size={16} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          )}
          {excerptText && <p>{excerptText}</p>}
        </div>
        <Button
          className="mt-6"
          size="lg"
          variant={stegaClean(link?.buttonVariant)}
          asChild
        >
          <Link
            href={link?.href ? link.href : "#"}
            target={link?.target ? "_blank" : undefined}
          >
            {link?.title}
          </Link>
        </Button>
      </div>
    </div>
  );
}
