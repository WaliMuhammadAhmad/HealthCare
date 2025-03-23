import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Mail, Phone, MapPin } from "lucide-react";

export function ContactSection() {
  return (
    <section
      id='contact'
      className='w-full py-12 md:py-24 lg:py-32 bg-muted/50'>
      <div className='container px-4 md:px-6'>
        <div className='flex flex-col items-center justify-center space-y-4 text-center'>
          <div className='space-y-2'>
            <div className='inline-block rounded-lg px-3 py-1 text-sm text-primary-background'>
              / Contact Us /
            </div>
            <h2 className='text-3xl font-bold tracking-tighter md:text-4xl/tight'>
              Get in touch with our team
            </h2>
            <p className='max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed'>
              Have questions or need assistance? We're here to help you navigate
              your healthcare journey.
            </p>
          </div>
        </div>

        <div className='grid gap-8 mt-12 md:grid-cols-2'>
          <Card>
            <CardHeader>
              <CardTitle>Send us a message</CardTitle>
              <CardDescription>
                Fill out the form below and we'll get back to you as soon as
                possible.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className='space-y-4'>
                <div className='grid gap-4 sm:grid-cols-2'>
                  <div className='space-y-2'>
                    <Label htmlFor='first-name'>First name</Label>
                    <Input id='first-name' placeholder='John' />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='last-name'>Last name</Label>
                    <Input id='last-name' placeholder='Doe' />
                  </div>
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='email'>Email</Label>
                  <Input
                    id='email'
                    type='email'
                    placeholder='john@example.com'
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='subject'>Subject</Label>
                  <Input id='subject' placeholder='How can we help you?' />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='message'>Message</Label>
                  <Textarea
                    id='message'
                    placeholder='Please provide details about your inquiry...'
                    className='min-h-[120px]'
                  />
                </div>
              </form>
            </CardContent>
            <CardFooter>
              <Button className='w-full'>Send Message</Button>
            </CardFooter>
          </Card>

          <div className='flex flex-col justify-center space-y-8'>
            <div className='flex items-start space-x-4'>
              <div className='bg-primary/10 p-3 rounded-full'>
                <Mail className='h-6 w-6 text-primary' />
              </div>
              <div>
                <h3 className='font-medium'>Email Us</h3>
                <p className='text-muted-foreground mt-1'>
                  support@healthcareapp.com
                </p>
                <p className='text-muted-foreground'>info@healthcareapp.com</p>
              </div>
            </div>

            <div className='flex items-start space-x-4'>
              <div className='bg-primary/10 p-3 rounded-full'>
                <Phone className='h-6 w-6 text-primary' />
              </div>
              <div>
                <h3 className='font-medium'>Call Us</h3>
                <p className='text-muted-foreground mt-1'>+1 (555) 123-4567</p>
                <p className='text-muted-foreground'>
                  Monday-Friday, 8am-6pm EST
                </p>
              </div>
            </div>

            <div className='flex items-start space-x-4'>
              <div className='bg-primary/10 p-3 rounded-full'>
                <MapPin className='h-6 w-6 text-primary' />
              </div>
              <div>
                <h3 className='font-medium'>Visit Us</h3>
                <p className='text-muted-foreground mt-1'>
                  123 Healthcare Avenue
                </p>
                <p className='text-muted-foreground'>New York, NY 10001</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
