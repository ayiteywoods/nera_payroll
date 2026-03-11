'use server'

import { LoginSchema,LoginFormState } from "../schemas/loginSchema"
import { redirect } from "next/navigation"


// Dummy user for demonstration purposes
  const dummyUser = [
    {
      email: "admin@nera.com",
      password: "password123",
      role : "admin",
    }
  ]

export async function loginAction(
 state: LoginFormState,
 formData: FormData    
) : Promise<LoginFormState> {

    // Validate fields with Zod
    const validatedFields = LoginSchema.safeParse({
        email: formData.get("email"),
        password: formData.get("password"),
    })

    // If validation fails, return errors
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Please correct the errors and try again.",
        }
    }

    const { email, password } = validatedFields.data

    // Check credentials against dummy user
    const user = dummyUser.find(

        (u) => u.email === email && u.password === password)

    if (!user) {
        return {
            message: "Invalid email or password.",
        }
    }

    redirect("/admin")
}
