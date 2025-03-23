import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function AboutSection() {
  return (
    <section id='about' className='w-full py-12 md:py-24 lg:py-32 bg-muted/50'>
      <div className='container px-4 md:px-6'>
        <div className='grid gap-10 lg:grid-cols-2 lg:gap-16 items-center'>
          <div>
            <div className='space-y-4'>
              <div className='inline-block rounded-lg px-3 py-1 text-sm text-primary-background'>
                / About Us /
              </div>
              <h2 className='text-3xl font-bold tracking-tighter md:text-4xl/tight'>
                Transforming healthcare through technology
              </h2>
              <p className='text-muted-foreground md:text-xl'>
                Our healthcare platform was built with a simple mission: to make
                healthcare more accessible, efficient, and patient-centered. We
                believe that technology can transform the healthcare experience
                for everyone involved.
              </p>
              <p className='text-muted-foreground'>
                With our intuitive tools for appointment booking, medical record
                management, and direct communication with healthcare providers,
                we're bridging the gap between patients and quality care.
              </p>
              <div className='flex flex-col sm:flex-row gap-2 pt-4'>
                <Link href='/about'>
                  <Button variant='default'>Read More</Button>
                </Link>
              </div>
            </div>
          </div>
          <div className='relative lg:order-last'>
            <Image
              src='/placeholder.svg?height=600&width=600'
              width={600}
              height={600}
              alt='Healthcare team'
              className='mx-auto rounded-lg object-cover'
            />
          </div>
        </div>
      </div>
    </section>
  );
}
