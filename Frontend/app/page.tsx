"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChevronRight } from "lucide-react"
import Link from "next/link"

export default function AuthPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      window.location.href = "/dashboard"
    }, 1000)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Content Moderation Platform</h1>
          <p className="text-muted-foreground mt-2">Manage and moderate content efficiently</p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>Enter your credentials to access your account</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={handleSubmit}>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="name@example.com" required />
                  </div>
                  <div className="space-y-2 mt-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      <Link href="#" className="text-sm text-primary hover:underline">
                        Forgot password?
                      </Link>
                    </div>
                    <Input id="password" type="password" required />
                  </div>
                  <Button className="w-full mt-6" type="submit" disabled={isLoading}>
                    {isLoading ? "Logging in..." : "Login"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="register">
            <Card>
              <CardHeader>
                <CardTitle>Create an account</CardTitle>
                <CardDescription>Enter your information to create an account</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First name</Label>
                      <Input id="firstName" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last name</Label>
                      <Input id="lastName" required />
                    </div>
                  </div>
                  <div className="space-y-2 mt-4">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="name@example.com" required />
                  </div>
                  <div className="space-y-2 mt-4">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" required />
                  </div>
                  <div className="space-y-2 mt-4">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input id="confirmPassword" type="password" required />
                  </div>
                  <Button className="w-full mt-6" type="submit" disabled={isLoading}>
                    {isLoading ? "Creating account..." : "Create account"}
                  </Button>
                </form>
              </CardContent>
              <CardFooter className="flex justify-center text-sm text-muted-foreground">
                By creating an account, you agree to our Terms of Service and Privacy Policy
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-6 text-center">
          <Link href="/dashboard" className="text-primary hover:underline inline-flex items-center">
            View demo dashboard <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
      </div>
    </div>
  )
}

