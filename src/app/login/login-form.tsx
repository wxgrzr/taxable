"use client"

import { useActionState, useEffect } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { authenticate } from "./actions"

export function LoginForm() {
  const [state, action, pending] = useActionState(authenticate, null)

  useEffect(() => {
    if (state && !state.ok) toast.error(state.error)
  }, [state])

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="tracking-widest uppercase">Taxable</CardTitle>
        <CardDescription>Sign in to your tax reserve.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={action} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              minLength={8}
              required
            />
          </div>
          <div className="flex gap-2">
            <Button
              type="submit"
              name="mode"
              value="sign-in"
              disabled={pending}
              className="flex-1"
            >
              Sign in
            </Button>
            <Button
              type="submit"
              name="mode"
              value="sign-up"
              variant="outline"
              disabled={pending}
              className="flex-1"
            >
              Create account
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
