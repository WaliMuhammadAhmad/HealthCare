import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, Clock, MapPin } from "lucide-react";
import Link from "next/link";

export function BookingSection() {
  return (
    <section id='booking' className='w-full py-12 md:py-24 lg:py-32'>
      <div className='container px-4 md:px-6'>
        <div className='flex flex-col items-center justify-center space-y-4 text-center'>
          <div className='space-y-2'>
            <div className='inline-block rounded-lg px-3 py-1 text-sm text-primary-background'>
              / Appointment Booking /
            </div>
            <h2 className='text-3xl font-bold tracking-tighter md:text-4xl/tight'>
              Book your appointment in minutes
            </h2>
            <p className='max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed'>
              Our streamlined booking process makes it easy to find the right
              healthcare provider and schedule your visit.
            </p>
          </div>
        </div>

        <div className='grid gap-6 mt-12 md:grid-cols-3'>
          <Card className='border-0 shadow-md'>
            <CardHeader className='pb-2'>
              <Calendar className='h-6 w-6 text-primary mb-2' />
              <CardTitle>Choose a Date & Time</CardTitle>
              <CardDescription>
                Select from available slots up to 3 weeks in advance
              </CardDescription>
            </CardHeader>
            <CardContent className='text-sm text-muted-foreground'>
              Our calendar shows real-time availability, so you can find a time
              that works for your schedule.
            </CardContent>
          </Card>

          <Card className='border-0 shadow-md'>
            <CardHeader className='pb-2'>
              <MapPin className='h-6 w-6 text-primary mb-2' />
              <CardTitle>Select Visit Type</CardTitle>
              <CardDescription>
                In-person, video, or phone consultations
              </CardDescription>
            </CardHeader>
            <CardContent className='text-sm text-muted-foreground'>
              Choose the type of appointment that best suits your needs and
              comfort level.
            </CardContent>
          </Card>

          <Card className='border-0 shadow-md'>
            <CardHeader className='pb-2'>
              <Clock className='h-6 w-6 text-primary mb-2' />
              <CardTitle>Instant Confirmation</CardTitle>
              <CardDescription>
                Receive immediate confirmation and reminders
              </CardDescription>
            </CardHeader>
            <CardContent className='text-sm text-muted-foreground'>
              Get email and text reminders to help you prepare for your
              appointment.
            </CardContent>
          </Card>
        </div>

        <div className='flex justify-center mt-12'>
          <Link href='/appointments'>
            <Button size='lg'>Book an Appointment</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
