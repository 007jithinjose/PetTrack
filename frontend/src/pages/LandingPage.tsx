//src/pages/LandingPage.tsx
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink } from "@/components/ui/navigation-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useNavigate } from "react-router-dom"

export function LandingPage() {
    const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Navigation Bar */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4 mx-auto max-w-7xl 2xl:max-w-[1800px]">
          <div 
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <PawPrintIcon className="h-6 w-6 text-blue-600" />
            <span className="text-lg font-bold">PetTrack</span>
          </div>
          
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink href="#features" className="px-4 py-2 font-medium text-sm md:text-base">
                  Features
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink href="#testimonials" className="px-4 py-2 font-medium text-sm md:text-base">
                  Testimonials
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          
          <div className="flex items-center gap-2 md:gap-4">
            <Button 
              variant="ghost"
              onClick={() => navigate('/auth/login')}
              className="text-sm md:text-base"
            >
              Login
            </Button>
            <Button 
              onClick={() => navigate('/auth/register')}
              className="text-sm md:text-base"
            >
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container flex flex-col items-center justify-center gap-6 py-12 md:py-20 text-center mx-auto max-w-7xl 2xl:max-w-[1800px] px-4">
        <div className="flex items-center gap-2 rounded-full bg-blue-100 px-4 py-1 text-sm font-medium text-blue-600">
          <span>🐾</span>
          <span>Track your pets with ease</span>
        </div>
        
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
          Comprehensive Pet Care <br className="hidden sm:block" />
          <span className="text-blue-600">Management System</span>
        </h1>
        
        <p className="max-w-2xl text-base md:text-lg text-muted-foreground">
          PetTrack helps pet owners and veterinarians manage pet health records, appointments, 
          and vaccinations all in one place.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto justify-center">
          <Button size="lg" className="w-full sm:w-auto">Get Started</Button>
          <Button size="lg" variant="outline" className="w-full sm:w-auto">
            Learn More
          </Button>
        </div>
        
        <div className="mt-8 w-full max-w-4xl mx-auto overflow-hidden rounded-xl border shadow-lg">
          <img
            src="images/pet-dashboard-screenshot.jpg"
            alt="PetTrack Dashboard"
            className="w-full h-auto"
            width={1200}
            height={800}
          />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container py-12 md:py-20 mx-auto max-w-7xl 2xl:max-w-[1800px] px-4">
        <h2 className="mb-8 md:mb-12 text-center text-2xl md:text-3xl font-bold">Key Features</h2>
        
        <div className="grid gap-6 md:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            icon={<CalendarIcon className="h-6 w-6" />}
            title="Appointment Scheduling"
            description="Easily book and manage vet appointments with our intuitive calendar system."
          />
          <FeatureCard
            icon={<MedicalIcon className="h-6 w-6" />}
            title="Health Records"
            description="Keep all your pet's medical history and vaccination records in one secure place."
          />
          <FeatureCard
            icon={<NotificationIcon className="h-6 w-6" />}
            title="Reminders"
            description="Never miss a vaccination or medication dose with our smart reminder system."
          />
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="bg-blue-50 py-12 md:py-20">
        <div className="container mx-auto max-w-7xl 2xl:max-w-[1800px] px-4">
          <h2 className="mb-8 md:mb-12 text-center text-2xl md:text-3xl font-bold">What Our Users Say</h2>
          
          <div className="grid gap-6 md:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            <TestimonialCard
              name="Sarah Johnson"
              role="Pet Owner"
              avatar="/avatars/sarah.jpeg"
              content="PetTrack has simplified my life as a pet parent. I can track all my dogs' vaccinations and appointments in one place!"
            />
            <TestimonialCard
              name="Dr. Michael Chen"
              role="Veterinarian"
              avatar="/avatars/michael.jpeg"
              content="This platform has transformed how we manage patient records at our clinic. Highly recommended for veterinary practices."
            />
            <TestimonialCard
              name="Emma Wilson"
              role="Pet Sitter"
              avatar="/avatars/emma.jpeg"
              content="As a professional pet sitter, I can easily coordinate with all my clients through PetTrack."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-12 md:py-20 mx-auto max-w-7xl 2xl:max-w-[1800px] px-4">
        <Card className="mx-auto w-full max-w-4xl bg-gradient-to-r from-blue-600 to-blue-800 text-white">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl">Ready to Simplify Pet Care?</CardTitle>
            <CardDescription className="text-blue-100">
              Join thousands of pet owners and professionals using PetTrack today.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="flex-1 space-y-2">
                <Label htmlFor="email" className="text-white">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  className="bg-white/20 text-white placeholder:text-blue-200"
                />
              </div>
              <Button
                size="lg"
                className="mt-auto bg-white text-blue-600 hover:bg-blue-50 whitespace-nowrap"
              >
                Sign Up Free
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white py-8 md:py-12">
        <div className="container mx-auto max-w-7xl 2xl:max-w-[1800px] px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            <div>
              <h3 className="mb-3 md:mb-4 text-sm md:text-base font-semibold">Product</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm md:text-base text-muted-foreground hover:text-foreground">Features</a></li>
                <li><a href="#" className="text-sm md:text-base text-muted-foreground hover:text-foreground">Pricing</a></li>
                <li><a href="#" className="text-sm md:text-base text-muted-foreground hover:text-foreground">API</a></li>
              </ul>
            </div>
            <div>
              <h3 className="mb-3 md:mb-4 text-sm md:text-base font-semibold">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm md:text-base text-muted-foreground hover:text-foreground">About</a></li>
                <li><a href="#" className="text-sm md:text-base text-muted-foreground hover:text-foreground">Careers</a></li>
                <li><a href="#" className="text-sm md:text-base text-muted-foreground hover:text-foreground">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="mb-3 md:mb-4 text-sm md:text-base font-semibold">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm md:text-base text-muted-foreground hover:text-foreground">Blog</a></li>
                <li><a href="#" className="text-sm md:text-base text-muted-foreground hover:text-foreground">Help Center</a></li>
                <li><a href="#" className="text-sm md:text-base text-muted-foreground hover:text-foreground">Community</a></li>
              </ul>
            </div>
            <div>
              <h3 className="mb-3 md:mb-4 text-sm md:text-base font-semibold">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm md:text-base text-muted-foreground hover:text-foreground">Privacy</a></li>
                <li><a href="#" className="text-sm md:text-base text-muted-foreground hover:text-foreground">Terms</a></li>
                <li><a href="#" className="text-sm md:text-base text-muted-foreground hover:text-foreground">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 md:mt-12 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <PawPrintIcon className="h-6 w-6 text-blue-600" />
              <span className="font-bold">PetTrack</span>
            </div>
            <p className="text-xs md:text-sm text-muted-foreground">© 2023 PetTrack. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

// Component for Feature Cards
function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <h3 className="mb-2 text-base md:text-lg font-semibold">{title}</h3>
        <p className="text-sm md:text-base text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}

// Component for Testimonials
function TestimonialCard({ name, role, avatar, content }: { 
  name: string, 
  role: string, 
  avatar: string, 
  content: string 
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <p className="mb-4 text-sm md:text-base italic text-muted-foreground">"{content}"</p>
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarImage src={avatar} />
            <AvatarFallback>{name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm md:text-base font-medium">{name}</p>
            <p className="text-xs md:text-sm text-muted-foreground">{role}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Icons (you can replace these with actual icons from react-icons)
export function PawPrintIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="4" r="2" />
      <circle cx="18" cy="8" r="2" />
      <circle cx="20" cy="16" r="2" />
      <circle cx="9" cy="21" r="2" />
      <path d="M19 16c-.6-1.3-1.6-2-2.7-2-1.1 0-2.1.7-2.7 2-.6-1.3-1.6-2-2.7-2-1.1 0-2.1.7-2.7 2M9 5c-.6-1.3-1.5-2-2.7-2C5.1 3 4 3.7 3.4 5c-.6 1.3-.5 2.7.3 3.7 1 1.3 2.4 2 4.1 2 1.8 0 3.3-.8 4.2-2.1.8-1.1.9-2.5.3-3.6z" />
    </svg>
  )
}

function CalendarIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  )
}

function MedicalIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2v20M2 12h20" />
      <path d="M2 6h4v4H2zM18 6h4v4h-4zM2 14h4v4H2zM18 14h4v4h-4z" />
    </svg>
  )
}

function NotificationIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  )
}