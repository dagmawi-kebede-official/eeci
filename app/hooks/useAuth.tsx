"use client";

import {
  createContext,
  useCallback,
  useContext,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials extends LoginCredentials {
  name: string;
}

interface AuthResponse {
  user: User;
  message?: string;
}

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  register: (credentials: RegisterCredentials) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

interface BetterAuthUser {
  id: string | number;
  email: string;
  name: string;
}

const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

function toAppUser(user: BetterAuthUser): User {
  return {
    id: String(user.id),
    email: user.email,
    name: user.name,
  };
}

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();

  const {
    data: session,
    isPending,
    refetch,
  } = authClient.useSession();

  const user = session?.user
    ? toAppUser(session.user)
    : null;

  const checkAuth = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const login = useCallback(
    async (
      credentials: LoginCredentials
    ): Promise<AuthResponse> => {
      const result = await authClient.signIn.email({
        email: credentials.email.trim(),
        password: credentials.password,
      });

      if (result.error) {
        throw new Error(
          result.error.message || "Login failed."
        );
      }

      if (!result.data?.user) {
        throw new Error("Login did not return a user.");
      }

      await refetch();

      return {
        user: toAppUser(result.data.user),
        message: "Login successful",
      };
    },
    [refetch]
  );

  const register = useCallback(
    async (
      credentials: RegisterCredentials
    ): Promise<AuthResponse> => {
      const result = await authClient.signUp.email({
        name: credentials.name.trim(),
        email: credentials.email.trim(),
        password: credentials.password,
      });

      if (result.error) {
        throw new Error(
          result.error.message || "Registration failed."
        );
      }

      if (!result.data?.user) {
        throw new Error("Registration did not return a user.");
      }

      await refetch();

      return {
        user: toAppUser(result.data.user),
        message: "User registered successfully",
      };
    },
    [refetch]
  );

  const logout = useCallback(async () => {
    const result = await authClient.signOut();

    if (result.error) {
      throw new Error(
        result.error.message || "Logout failed."
      );
    }

    await refetch();
    router.replace("/login");
  }, [refetch, router]);

  const value: AuthContextType = {
    user,
    isAuthenticated: Boolean(user),
    isLoading: isPending,
    login,
    register,
    logout,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used within an AuthProvider"
    );
  }

  return context;
}
