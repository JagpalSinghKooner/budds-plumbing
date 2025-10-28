import { LockKeyhole, ShieldCheck, Users } from 'lucide-react';

const Compliance6 = () => {
  return (
    <section className="py-32">
      <div className="container">
        <div className="flex flex-col items-start justify-between gap-8 xl:flex-row">
          <div className="flex flex-col gap-6 lg:max-w-xl">
            <div className="flex items-center gap-1">
              <span className="bg-primary h-2 w-4" />
              <span className="text-xs uppercase">Compliance</span>
            </div>
            <h2 className="text-4xl font-medium md:text-6xl lg:text-7xl">
              Powerful automation, built for trust
            </h2>
            <p className="md:text-xl">
              Run secure, reliable, and scalable workflows every day. Here’s why
              organizations and teams rely on our platform for their data needs.
            </p>
          </div>
          <div className="bg-border border-border grid w-full shrink-0 grid-cols-2 gap-px border md:w-auto md:grid-cols-4">
            <div className="bg-background flex flex-col items-center gap-2 px-6 py-4 md:px-8 md:py-6">
              <img
                src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/compliance/ISO-27001.svg"
                alt="ISO 27001"
                className="w-full max-w-16 md:max-w-24 dark:invert"
              />
              <p className="text-center text-sm font-semibold uppercase">
                ISO 27001
              </p>
            </div>
            <div className="bg-background flex flex-col items-center gap-2 px-6 py-4 md:px-8 md:py-6">
              <img
                src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/compliance/GDPR.svg"
                alt="GDPR"
                className="w-full max-w-16 md:max-w-24 dark:invert"
              />
              <p className="text-center text-sm font-semibold uppercase">
                GDPR
              </p>
            </div>
            <div className="bg-background flex flex-col items-center gap-2 px-6 py-4 md:px-8 md:py-6">
              <img
                src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/compliance/CCPA.svg"
                alt="CCPA"
                className="w-full max-w-16 md:max-w-24 dark:invert"
              />
              <p className="text-center text-sm font-semibold uppercase">
                CCPA
              </p>
            </div>
            <div className="bg-background flex flex-col items-center gap-2 px-6 py-4 md:px-8 md:py-6">
              <img
                src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/compliance/AICPA-SOC.svg"
                alt="AICPA SOC"
                className="w-full max-w-16 md:max-w-24 dark:invert"
              />
              <p className="text-center text-sm font-semibold uppercase">
                AICPA SOC
              </p>
            </div>
          </div>
        </div>
        <div className="border-border mt-20 w-full border">
          <div className="border-border relative hidden h-16 border-b md:block">
            <div className="absolute inset-0 h-full w-full bg-[repeating-linear-gradient(-45deg,theme(colors.border)_0_1px,transparent_1px_16px)]"></div>
          </div>
          <div className="bg-border grid grid-cols-1 gap-px lg:grid-cols-3">
            <div className="bg-background flex flex-col justify-between gap-8 px-6 py-10 md:gap-16">
              <LockKeyhole className="size-8" />
              <div className="flex flex-col gap-6 md:gap-10">
                <h3 className="text-xl font-medium md:text-3xl">
                  Certified Security Standards
                </h3>
                <p className="text-muted-foreground md:text-lg">
                  Workflows are protected by industry-leading security and
                  compliance practices.
                </p>
              </div>
            </div>
            <div className="bg-background flex flex-col justify-between gap-8 px-6 py-10 md:gap-16">
              <ShieldCheck className="size-8" />
              <div className="flex flex-col gap-6 md:gap-10">
                <h3 className="text-xl font-medium md:text-3xl">
                  Data Privacy & Control
                </h3>
                <p className="text-muted-foreground md:text-lg">
                  Your information remains private and fully under your control
                  at all times.
                </p>
              </div>
            </div>
            <div className="bg-background flex flex-col justify-between gap-8 px-6 py-10 md:gap-16">
              <Users className="size-8" />
              <div className="flex flex-col gap-6 md:gap-10">
                <h3 className="text-xl font-medium md:text-3xl">
                  Flexible Access Management
                </h3>
                <p className="text-muted-foreground md:text-lg">
                  Control permissions for teams, applications, and actions with
                  ease.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { Compliance6 };
