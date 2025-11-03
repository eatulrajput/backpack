// src/pages/SignUp.tsx
import { SignUpInput } from "@/components/ui/SignUpInput"
import { Button } from "@/components/ui/button"
import { GoogleLogin } from "@react-oauth/google"
import { Mail, Lock, ShieldCheck, Eye, EyeOff, CheckCircle, XCircle } from "lucide-react"
import { Link } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { SignUpSchema, SignUpFormData } from "@/validations/signup-schema"
import { useState, useEffect, useMemo } from "react"
import debounce from "lodash.debounce"

export default function SignUp() {

  const { register,
    handleSubmit,
    watch,
    formState: { errors }, } = useForm<SignUpFormData>({
      resolver: zodResolver(SignUpSchema),
    })

  const updatePasswordStrength = useMemo(() => {
    return debounce((password: string) => {
      setPasswordStrength(getPasswordStrength(password))
    }, 300)
  }, [])

  useEffect(() => {
    return () => {
      updatePasswordStrength.cancel(); // Cleanup debounce timer on unmount
    }
  }, [updatePasswordStrength])

  // State to hold password strength
  const [passwordStrength, setPasswordStrength] = useState<"Weak" | "Medium" | "Strong" | "">("")

  // Handle form submission
  const onSubmit = (data: SignUpFormData) => {
    console.log("Form Submitted", data)
    // You can add your sign-up logic here (e.g., API call), send this data to your backend
    try {
      // Example: await api.signUp(data)
      console.log("User signed up successfully")
    } catch (error) {
      console.error("Sign-up error", error)
    }

  }

  // Watch password field for strength checker
  const passwordValue = watch("password")

  // Update password strength in real-time
  const getPasswordStrength = (password: string): typeof passwordStrength => {
    if (!password) return ""
    const lengthScore = password.length >= 8
    const hasUpper = /[A-Z]/.test(password)
    const hasLower = /[a-z]/.test(password)
    const hasNumber = /[0-9]/.test(password)
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password)

    const score = [lengthScore, hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length

    if (score <= 1) return "Weak"
    if (score === 2 || score === 3) return "Medium"
    return "Strong"
  }

  // Update password strength whenever passwordValue changes
  useEffect(() => {
    updatePasswordStrength(passwordValue || "");
  }, [passwordValue, updatePasswordStrength])

  // Component to display password requirement with checkmark
  const PasswordRequirement = ({
    label,
    isValid,
  }: {
    label: string
    isValid: boolean
  }) => (
    <div className={`flex items-center gap-2 ${isValid ? "text-green-500" : "text-red-500"}`}>
      {isValid ? (
        <CheckCircle className="h-4 w-4" />
      ) : (
        <XCircle className="h-4 w-4" />
      )}
      <span className="text-sm">{label}</span>

    </div>
  )

  // Add state to toggle password visibility
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)



  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Image Section */}
      <div className="w-1/2 hidden lg:block">
        <img
          src="/library.webp"
          alt="Library"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right Form Section */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-6 sm:px-10 py-12">
        <div className="w-full max-w-md">
          {/* Top login link */}
          <div className="text-sm text-gray-500 text-right mb-4">
            Already have an account?{" "}
            <Link to="/login" className="text-green-600 hover:underline font-medium">
              Login
            </Link>
          </div>

          {/* Logo */}
          <h1 className="text-center text-4xl font-medium text-green-500 tracking-wide mb-2">
            &lt;ASTRA/&gt;
          </h1>

          {/* Title */}
          <p className="text-center text-xl text-gray-800 font-medium mb-8">
            Create Your Account
          </p>


          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            {/* Email */}
            <div>
              <div className="flex items-center border border-gray-300 rounded-lg px-4 py-3 shadow-sm focus-within:ring-2 focus-within:ring-green-400 transition">

                <Mail className="text-green-500 mr-3 h-5 w-5" />
                <SignUpInput
                  type="email"
                  placeholder="Email address"
                  aria-label="Email address"
                  {...register("email")}
                  className="flex-1 border-none outline-none bg-transparent placeholder-gray-400 text-sm text-black focus-visible:outline-none focus-visible:shadow-none"

                />

              </div>

              {errors.email && (
                <p className="text-sm text-red-500 mt-1 ml-1">
                  {errors.email.message}
                </p>
              )}
            </div>


            {/* Password */}
            <div>
              <div className="flex items-center border border-gray-300 rounded-lg px-4 py-3 shadow-sm focus-within:ring-2 focus-within:ring-green-400 transition relative">
                <Lock className="text-green-500 mr-3 h-5 w-5" />
                {(() => {
                  const { onChange, ...rest } = register("password");
                  return (
                    <SignUpInput
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      onChange={e => {
                        onChange(e);
                        updatePasswordStrength(e.target.value); // Use debounced function
                      }}
                      {...rest}
                      className="flex-1 border-none outline-none bg-transparent placeholder-gray-400 text-sm text-black"
                    />
                  );
                })()}
                <button
                  type="button"
                  title={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword(prev => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 text-gray-400 hover:text-gray-600 transition"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>

              {errors.password && (
                <p className="text-sm text-red-500 mt-1 ml-1">
                  {errors.password.message}
                </p>
              )}

              {/* Password Strength Meter */}
              {passwordStrength && (
                <div className="mt-1 ml-1 flex items-center text-sm">
                  <ShieldCheck className="h-4 w-4 mr-1 text-gray-400" />
                  <span
                    className={`${passwordStrength === "Weak" ? "text-red-500"
                      : passwordStrength === "Medium" ? "text-yellow-500"
                        : "text-green-500"
                      }`}>
                    Password Strength: {passwordStrength}
                  </span>
                </div>
              )}
            </div>
            {passwordValue && (
              <div className="mt-3 ml-1 space-y-1 text-sm">
                <PasswordRequirement
                  label="At least 8 characters"
                  isValid={passwordValue.length >= 8}
                />
                <PasswordRequirement
                  label="Contains an uppercase letter"
                  isValid={/[A-Z]/.test(passwordValue)}
                />
                <PasswordRequirement
                  label="Contains a lowercase letter"
                  isValid={/[a-z]/.test(passwordValue)}
                />
                <PasswordRequirement
                  label="Contains a number"
                  isValid={/[0-9]/.test(passwordValue)}
                />
                <PasswordRequirement
                  label="Contains a special character"
                  isValid={/[!@#$%^&*(),.?":{}|<>]/.test(passwordValue)}
                />
              </div>
            )}

            {/* Confirm Password */}
            <div>
              <div className="flex items-center border border-gray-300 rounded-lg px-4 py-3 shadow-sm focus-within:ring-2 focus-within:ring-green-400 transition relative">
                <Lock className="text-green-500 mr-3 h-5 w-5" />
                <SignUpInput
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  {...register("confirmPassword")}
                  className="flex-1 border-none outline-none bg-transparent text-sm text-black" />

                <button
                  type="button"
                  title={showConfirmPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowConfirmPassword(prev => !prev)}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 text-gray-400 hover:text-gray-600 transition">
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>

              {errors.confirmPassword && (
                <p className="text-sm text-red-500 mt-1 ml-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>


            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-green-500 text-white font-semibold hover:bg-green-600 transition duration-200 py-3 rounded-lg">
              Sign Up
            </Button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center justify-center">
            <span className="text-sm text-gray-500 px-4 bg-white">or</span>
          </div>

          {/* Google Login */}
          <div className="w-full flex justify-center">
            <GoogleLogin
              onSuccess={(cred) => console.log("Google Success", cred)}
              onError={() => console.log("Google Error")}
              width="320"
              shape="pill"
              theme="outline"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
