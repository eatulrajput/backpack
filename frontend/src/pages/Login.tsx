// src/pages/Login.tsx
import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { GoogleLogin } from "@react-oauth/google"
import { Mail, Lock } from "lucide-react"
import { Link } from "react-router-dom"
import { jwtDecode } from "jwt-decode"
import { SignUpInput } from "@/components/ui/SignUpInput"
import { Eye, EyeOff } from "lucide-react"


interface GoogleJwt {
  name: string
  email: string
  picture: string
}

interface CredentialResponse {
  credential: string
}



export default function Login() {

  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<{ email?: string; password?: string }>({})
  const [loading, setLoading] = useState(false)

  const handleLoginSuccess = (credentialResponse: CredentialResponse) => {
    if (credentialResponse.credential) {
      const decoded: GoogleJwt = jwtDecode(credentialResponse.credential)
      console.log("User info:", decoded)
    }
  }

  const validate = () => {
    const errors: typeof error = {}
    if (!email) errors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(email)) errors.email = "Invalid email address"
    if (!password) errors.password = "Password is required"
    setError(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      alert("Logged in!") // Replace with real login logic
    }, 1500)
  }

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Image Section */}
      <div className="w-1/2 hidden lg:block">
        <img
          src="/background02.webp"
          alt="Library"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right Form Section */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-6 sm:px-10 py-12">
        <div className="w-full max-w-md">
          {/* Top sign up link */}
          <div className="text-sm text-gray-500 text-right mb-4">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-green-600 hover:underline font-medium">
              Sign up
            </Link>
          </div>

          {/* Logo */}
          <h1 className="text-center text-4xl font-medium text-green-500 tracking-wide mb-2">
            &lt;ASTRA/&gt;
          </h1>

          {/* Title */}
          <p className="text-center text-xl text-gray-800 font-medium mb-8">
            Welcome back! Please login to your account.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Email */}
            <div>
              <div className={`flex items-center border rounded-lg px-4 py-3 shadow-sm focus-within:ring-2 focus-within:ring-green-400 transition ${error.email ? "border-red-500" : "border-gray-300"}`}>
                <Mail className="text-green-500 mr-3 h-5 w-5" />
                <SignUpInput
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 border-none outline-none bg-transparent placeholder-gray-400 text-sm text-gray-800"
                />

              </div>
              {error.email && <p id="email-error" className="text-sm text-red-500 mt-1 ml-1">{error.email}</p>}
            </div>

            {/* Password */}
            <div>
              <div
                className={`flex items-center border rounded-lg px-4 py-3 shadow-sm focus-within:ring-2 focus-within:ring-green-400 transition ${error.password ? "border-red-500" : "border-gray-300"
                  }`}
              >
                <Lock className="text-green-500 mr-3 h-5 w-5" />
                <SignUpInput
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="flex-1 border-none outline-none bg-transparent placeholder-gray-400 text-sm text-gray-800"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => !prev)}
                  className="text-gray-400 hover:text-gray-600 transition"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {error.password && (
                <p id="password-error" className="text-sm text-red-500 mt-1 ml-1">
                  {error.password}
                </p>
              )}
            </div>



            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className={`w-full bg-green-500 text-white font-semibold hover:bg-green-600 transition duration-200 py-3 rounded-lg ${loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
            >
              {loading ? (
                <svg
                  className="animate-spin h-5 w-5 text-white mx-auto"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
              ) : (
                "Login"
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center justify-center">
            <span className="text-sm text-gray-500 px-4 bg-white">or</span>
          </div>

          {/* Google Login */}
          <div className="w-full flex justify-center">
            <GoogleLogin
              onSuccess={handleLoginSuccess}
              onError={() => console.log("Google login failed")}
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
