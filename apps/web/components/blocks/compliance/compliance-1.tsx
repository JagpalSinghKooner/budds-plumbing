import { LockKeyhole, ShieldCheck, Users, FileCheck, Shield, Award } from "lucide-react";
import { PAGE_QUERYResult } from "@/sanity.types";
import SectionContainer from "@/components/ui/section-container";
import { stegaClean } from "next-sanity";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";

type Compliance1Props = Extract<
  NonNullable<NonNullable<PAGE_QUERYResult>["blocks"]>[number],
  { _type: "compliance-1" }
>;

const iconMap = {
  "lock-keyhole": LockKeyhole,
  "shield-check": ShieldCheck,
  users: Users,
  "file-check": FileCheck,
  shield: Shield,
  award: Award,
};

export default function Compliance1({
  padding,
  colorVariant,
  tagLine,
  title,
  body,
  badges,
  features,
}: Compliance1Props) {
  const color = stegaClean(colorVariant);

  return (
    <SectionContainer color={color} padding={padding}>
      <div className="flex flex-col items-start justify-between gap-8 xl:flex-row">
        <div className="flex flex-col gap-6 lg:max-w-xl">
          {tagLine && (
            <div className="flex items-center gap-1">
              <span className="bg-primary h-2 w-4" />
              <span className="text-xs uppercase">{tagLine}</span>
            </div>
          )}
          {title && (
            <h2 className="text-4xl font-medium md:text-6xl lg:text-7xl">
              {title}
            </h2>
          )}
          {body && <p className="md:text-xl">{body}</p>}
        </div>

        {badges && badges.length > 0 && (
          <div className="bg-border border-border grid w-full shrink-0 grid-cols-2 gap-px border md:w-auto md:grid-cols-4">
            {badges.map((badge, index) => (
              <div
                key={index}
                className="bg-background flex flex-col items-center gap-2 px-6 py-4 md:px-8 md:py-6"
              >
                {badge.image && badge.image.asset?._id && (
                  <Image
                    src={urlFor(badge.image).url()}
                    alt={badge.image.alt || badge.label || ""}
                    width={96}
                    height={96}
                    className="w-full max-w-16 md:max-w-24 dark:invert"
                  />
                )}
                {badge.label && (
                  <p className="text-center text-sm font-semibold uppercase">
                    {badge.label}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {features && features.length > 0 && (
        <div className="border-border mt-20 w-full border">
          <div className="border-border relative hidden h-16 border-b md:block">
            <div className="absolute inset-0 h-full w-full bg-[repeating-linear-gradient(-45deg,theme(colors.border)_0_1px,transparent_1px_16px)]"></div>
          </div>
          <div className="bg-border grid grid-cols-1 gap-px lg:grid-cols-3">
            {features.map((feature, index) => {
              const IconComponent = feature.icon
                ? iconMap[feature.icon as keyof typeof iconMap]
                : ShieldCheck;

              return (
                <div
                  key={index}
                  className="bg-background flex flex-col justify-between gap-8 px-6 py-10 md:gap-16"
                >
                  {IconComponent && <IconComponent className="size-8" />}
                  <div className="flex flex-col gap-6 md:gap-10">
                    {feature.title && (
                      <h3 className="text-xl font-medium md:text-3xl">
                        {feature.title}
                      </h3>
                    )}
                    {feature.description && (
                      <p className="text-muted-foreground md:text-lg">
                        {feature.description}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </SectionContainer>
  );
}
