import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle, Users, Shield, HeartPulse } from "lucide-react";

export default function AboutPage() {
  return (
    <div className='min-h-screen flex flex-col'>
      <Navbar />
      <main className='flex-1'>
        {/* Hero Section */}
        <section className='w-full py-12 md:py-24 lg:py-32 bg-muted/50'>
          <div className='container px-4 md:px-6'>
            <div className='grid gap-10 lg:grid-cols-2 lg:gap-16 items-center'>
              <div>
                <div className='space-y-4'>
                  <div className='inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground'>
                    About Us
                  </div>
                  <h1 className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl'>
                    Our Mission & Vision
                  </h1>
                  <p className='text-muted-foreground md:text-xl'>
                    At HealthCare, we're committed to transforming the
                    healthcare experience through innovative technology and
                    patient-centered design. Our platform connects patients with
                    healthcare providers, simplifies appointment booking, and
                    provides secure access to medical records.
                  </p>
                  <p className='text-muted-foreground'>
                    Founded in 2020, our team of healthcare professionals and
                    technology experts has been working to address the
                    challenges faced by patients and providers in the modern
                    healthcare system.
                  </p>
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

        {/* Our Values Section */}
        <section className='w-full py-12 md:py-24 lg:py-32'>
          <div className='container px-4 md:px-6'>
            <div className='flex flex-col items-center justify-center space-y-4 text-center'>
              <div className='space-y-2'>
                <h2 className='text-3xl font-bold tracking-tighter md:text-4xl/tight'>
                  Our Core Values
                </h2>
                <p className='max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed'>
                  These principles guide everything we do as we work to improve
                  healthcare access and outcomes.
                </p>
              </div>
            </div>

            <div className='grid gap-6 mt-12 md:grid-cols-3'>
              <Card className='text-center'>
                <CardHeader>
                  <div className='flex justify-center'>
                    <Users className='h-12 w-12 text-primary' />
                  </div>
                  <CardTitle className='mt-4'>Patient-Centered</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className='text-base'>
                    We design every feature with patients' needs in mind,
                    ensuring that our platform is accessible, intuitive, and
                    empowering for all users.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className='text-center'>
                <CardHeader>
                  <div className='flex justify-center'>
                    <Shield className='h-12 w-12 text-primary' />
                  </div>
                  <CardTitle className='mt-4'>Privacy & Security</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className='text-base'>
                    We maintain the highest standards of data protection and
                    privacy, ensuring that your health information remains
                    secure and confidential.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className='text-center'>
                <CardHeader>
                  <div className='flex justify-center'>
                    <HeartPulse className='h-12 w-12 text-primary' />
                  </div>
                  <CardTitle className='mt-4'>Quality Care</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className='text-base'>
                    We partner with top healthcare providers and institutions to
                    ensure that our users have access to high-quality,
                    evidence-based care.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className='w-full py-12 md:py-24 lg:py-32 bg-muted/50'>
          <div className='container px-4 md:px-6'>
            <div className='flex flex-col items-center justify-center space-y-4 text-center'>
              <div className='space-y-2'>
                <h2 className='text-3xl font-bold tracking-tighter md:text-4xl/tight'>
                  How Our Booking Process Works
                </h2>
                <p className='max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed'>
                  We've simplified the appointment booking process to save you
                  time and reduce stress.
                </p>
              </div>
            </div>

            <div className='grid gap-10 mt-12 md:grid-cols-2 lg:grid-cols-4'>
              <div className='flex flex-col items-center text-center'>
                <div className='flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold'>
                  <span>1</span>
                </div>
                <h3 className='mt-4 text-lg font-medium'>Create an Account</h3>
                <p className='mt-2 text-sm text-muted-foreground'>
                  Sign up for a free account to access our full range of
                  healthcare services and features.
                </p>
              </div>

              <div className='flex flex-col items-center text-center'>
                <div className='flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold'>
                  <span>2</span>
                </div>
                <h3 className='mt-4 text-lg font-medium'>Find a Provider</h3>
                <p className='mt-2 text-sm text-muted-foreground'>
                  Browse our network of healthcare professionals and find the
                  right specialist for your needs.
                </p>
              </div>

              <div className='flex flex-col items-center text-center'>
                <div className='flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold'>
                  <span>3</span>
                </div>
                <h3 className='mt-4 text-lg font-medium'>Select a Time</h3>
                <p className='mt-2 text-sm text-muted-foreground'>
                  Choose from available appointment slots that fit your
                  schedule, up to three weeks in advance.
                </p>
              </div>

              <div className='flex flex-col items-center text-center'>
                <div className='flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold'>
                  <span>4</span>
                </div>
                <h3 className='mt-4 text-lg font-medium'>
                  Attend Your Appointment
                </h3>
                <p className='mt-2 text-sm text-muted-foreground'>
                  Receive reminders and attend your appointment in-person, via
                  video, or by phone.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Technology Section */}
        <section className='w-full py-12 md:py-24 lg:py-32'>
          <div className='container px-4 md:px-6'>
            <div className='grid gap-10 lg:grid-cols-2 lg:gap-16 items-center'>
              <div className='relative order-last lg:order-first'>
                <Image
                  src='/placeholder.svg?height=600&width=600'
                  width={600}
                  height={600}
                  alt='Healthcare technology'
                  className='mx-auto rounded-lg object-cover'
                />
              </div>
              <div>
                <div className='space-y-4'>
                  <div className='inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground'>
                    Our Technology
                  </div>
                  <h2 className='text-3xl font-bold tracking-tighter md:text-4xl/tight'>
                    Secure, Reliable, and User-Friendly
                  </h2>
                  <p className='text-muted-foreground md:text-xl'>
                    Our platform is built using the latest technology to ensure
                    a seamless and secure experience. We employ end-to-end
                    encryption for all sensitive data and comply with all
                    healthcare privacy regulations.
                  </p>
                  <ul className='space-y-2'>
                    <li className='flex items-start'>
                      <CheckCircle className='h-5 w-5 text-primary mr-2 mt-0.5' />
                      <span>HIPAA-compliant data storage and transmission</span>
                    </li>
                    <li className='flex items-start'>
                      <CheckCircle className='h-5 w-5 text-primary mr-2 mt-0.5' />
                      <span>
                        Regular security audits and penetration testing
                      </span>
                    </li>
                    <li className='flex items-start'>
                      <CheckCircle className='h-5 w-5 text-primary mr-2 mt-0.5' />
                      <span>Responsive design that works on all devices</span>
                    </li>
                    <li className='flex items-start'>
                      <CheckCircle className='h-5 w-5 text-primary mr-2 mt-0.5' />
                      <span>
                        Accessibility features for users with disabilities
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className='w-full py-12 md:py-24 lg:py-32 bg-primary/5'>
          <div className='container px-4 md:px-6'>
            <div className='flex flex-col items-center justify-center space-y-4 text-center'>
              <div className='space-y-2'>
                <h2 className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl'>
                  Ready to experience better healthcare?
                </h2>
                <p className='mx-auto max-w-[700px] text-muted-foreground md:text-xl'>
                  Join thousands of patients who have transformed their
                  healthcare experience with our platform.
                </p>
              </div>
              <div className='flex flex-col sm:flex-row gap-4'>
                <Link href='/signup'>
                  <Button size='lg'>Create an Account</Button>
                </Link>
                <Link href='/appointments'>
                  <Button variant='outline' size='lg'>
                    Book an Appointment
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
