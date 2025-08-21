// src/pages/AuthPage.tsx
import { Routes, Route, useNavigate } from 'react-router-dom'
import { LoginForm } from '@/components/auth/LoginForm'
import { RegisterForm } from '@/components/auth/RegisterForm'
import { DoctorRegisterForm } from '@/components/auth/DoctorRegisterForm'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { PawPrintIcon } from './LandingPage' 
import { toast } from 'sonner'

export function AuthPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Navigation Bar - Consistent with LandingPage */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div 
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <PawPrintIcon className="h-6 w-6 text-blue-600" />
            <span className="text-lg font-bold">PetTrack</span>
          </div>
          
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost"
              onClick={() => navigate('/')}
            >
              Back to Home
            </Button>
          </div>
        </div>
      </header>

      {/* Auth Content */}
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
        <Routes>
          <Route path="login" element={
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle className="text-2xl">Login to PetTrack</CardTitle>
              </CardHeader>
              <CardContent>
                <LoginForm onSuccess={() => navigate('/owner')} />
              </CardContent>
              <CardFooter className="flex flex-col items-start gap-2">
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{' '}
                  <Button 
                    variant="link" 
                    className="h-auto p-0"
                    onClick={() => navigate('/auth/register')}
                  >
                    Sign up
                  </Button>
                </p>
              </CardFooter>
            </Card>
          } />
          
          <Route path="register" element={
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle className="text-2xl">Create an Account</CardTitle>
              </CardHeader>
              <CardContent>
                <RegisterForm onSuccess={() => {
                  toast.success('Registration successful! Please login');
                  navigate('/auth/login');
                }} />
              </CardContent>
              <CardFooter className="flex flex-col items-start gap-2">
                <p className="text-sm text-muted-foreground">
                  Already have an account?{' '}
                  <Button 
                    variant="link" 
                    className="h-auto p-0"
                    onClick={() => navigate('/auth/login')}
                  >
                    Login
                  </Button>
                </p>
                <Button 
                  variant="outline" 
                  className="w-full mt-4"
                  onClick={() => navigate('/auth/register/doctor')}
                >
                  I'm a Veterinarian
                </Button>
              </CardFooter>
            </Card>
          } />
          
          <Route path="register/doctor" element={
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle className="text-2xl">Veterinarian Registration</CardTitle>
              </CardHeader>
              <CardContent>
                <DoctorRegisterForm onSuccess={() => {
                  toast.success('Registration successful! Please login');
                  navigate('/auth/login');
                }} />
              </CardContent>
              <CardFooter className="flex flex-col items-start gap-2">
                <p className="text-sm text-muted-foreground">
                  Already have an account?{' '}
                  <Button 
                    variant="link" 
                    className="h-auto p-0"
                    onClick={() => navigate('/auth/login')}
                  >
                    Login
                  </Button>
                </p>
                <Button 
                  variant="outline" 
                  className="w-full mt-4"
                  onClick={() => navigate('/auth/register')}
                >
                  I'm a Pet Owner
                </Button>
              </CardFooter>
            </Card>
          } />
        </Routes>
      </div>
    </div>
  )
}