import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Calendar,
  ClipboardList,
  Clock,
  Users,
  Shield,
  HeartPulse,
} from "lucide-react";

export function FeatureSection() {
  return (
    <section
      id='features'
      className='w-full py-12 md:py-24 lg:py-32 bg-muted/50'>
      <div className='container px-4 md:px-6'>
        <div className='flex flex-col items-center justify-center space-y-4 text-center'>
          <div className='space-y-2'>
            <div className='inline-block rounded-lg px-3 py-1 text-sm text-primary-background'>
              / Features /
            </div>
            <h2 className='text-3xl font-bold tracking-tighter md:text-4xl/tight'>
              Everything you need for better healthcare
            </h2>
            <p className='max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed'>
              Our platform provides a comprehensive suite of tools to manage
              your healthcare needs efficiently and effectively.
            </p>
          </div>
        </div>
        <div className='mx-auto grid max-w-5xl items-center gap-6 py-12 md:grid-cols-2 lg:grid-cols-3'>
          <Card>
            <CardHeader className='pb-2'>
              <Calendar className='h-6 w-6 text-primary mb-2' />
              <CardTitle>Appointment Scheduling</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Book appointments with healthcare providers in just a few
                clicks. Receive reminders and manage your schedule easily.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='pb-2'>
              <ClipboardList className='h-6 w-6 text-primary mb-2' />
              <CardTitle>Medical Records</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Access your complete medical history, test results, and
                prescriptions in one secure location.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='pb-2'>
              <Clock className='h-6 w-6 text-primary mb-2' />
              <CardTitle>Medication Reminders</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Never miss a dose with customizable medication reminders and
                refill notifications.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='pb-2'>
              <Users className='h-6 w-6 text-primary mb-2' />
              <CardTitle>Provider Network</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Find and connect with top-rated healthcare professionals
                specializing in your specific needs.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='pb-2'>
              <HeartPulse className='h-6 w-6 text-primary mb-2' />
              <CardTitle>Health Monitoring</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Track vital signs, symptoms, and health metrics to monitor your
                progress over time.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='pb-2'>
              <Shield className='h-6 w-6 text-primary mb-2' />
              <CardTitle>Secure & Private</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Your health data is protected with enterprise-grade security and
                strict privacy controls.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
