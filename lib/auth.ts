import type { NextRequest } from "next/server"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret"

interface AuthResult {
  isAuthenticated: boolean
  message: string
  status: number
  user?: {
    username: string
    role: string
  }
}

export function verifyAuth(request: NextRequest): AuthResult {
  try {
    const authHeader = request.headers.get("authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return {
        isAuthenticated: false,
        message: "Authorization header missing or invalid",
        status: 401,
      }
    }

    const token = authHeader.split(" ")[1]

    if (!token) {
      return {
        isAuthenticated: false,
        message: "Token missing",
        status: 401,
      }
    }

    const decoded = jwt.verify(token, JWT_SECRET) as {
      username: string
      role: string
    }

    if (decoded.role !== "admin") {
      return {
        isAuthenticated: false,
        message: "Insufficient permissions",
        status: 403,
      }
    }

    return {
      isAuthenticated: true,
      message: "Authentication successful",
      status: 200,
      user: decoded,
    }
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return {
        isAuthenticated: false,
        message: "Invalid token",
        status: 401,
      }
    }

    if (error instanceof jwt.TokenExpiredError) {
      return {
        isAuthenticated: false,
        message: "Token expired",
        status: 401,
      }
    }

    return {
      isAuthenticated: false,
      message: "Authentication error",
      status: 500,
    }
  }
}
