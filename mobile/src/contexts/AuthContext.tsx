import { createContext, ReactNode, useEffect, useState } from "react";
import * as Google from 'expo-auth-session/providers/google'
import * as AuthSession from 'expo-auth-session'
import * as WebBrowser from 'expo-web-browser'

WebBrowser.maybeCompleteAuthSession();

interface UserProps {
  name: string
  avatarUrl: string
}

export interface AuthContextDataProps {
  user: UserProps
  isUserLoading: boolean
  signIn: () => Promise<void>
}

interface AuthContextProviderProps {
  children: ReactNode
}

export const AuthContext = createContext({} as AuthContextDataProps)

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [user, setUser] = useState<UserProps>({} as UserProps)
  const [isUserLoading, setIsUserLoading] = useState(false)

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: '213839502643-j84cv0lnneqeq0pbeaakt1am8gfl9o5p.apps.googleusercontent.com',
    redirectUri: AuthSession.makeRedirectUri({ useProxy: true }),
    scopes: ['profile', 'email']
  })

  async function signIn() {
    try {
      setIsUserLoading(true)
      // Start no fluxo de autenticação
      await promptAsync()

    } catch (err) {
      console.log(err)
      throw err
    } finally {
      setIsUserLoading(false)
    }
  }

  async function singInWithGoogle(access_token: string) {
    console.log(`New authentication token is ${access_token}`)
  }

  useEffect(() => {
    if (response?.type === 'success' && response.authentication?.accessToken) {
      singInWithGoogle(response.authentication.accessToken)
    }
  }, [response])

  return (
    <AuthContext.Provider value={{
      isUserLoading,
      signIn,
      user
    }}>
      {children}
    </AuthContext.Provider>
  )
}