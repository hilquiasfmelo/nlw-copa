import { Center, Text, Icon } from 'native-base'
import { Fontisto } from '@expo/vector-icons'

import { Button } from '../components/Button'

import Logo from '../assets/logo.svg'
import { useAuth } from '../hooks/useAuth'

export function SignIn() {
  const { signIn } = useAuth()

  return (
    <Center flex={1} bgColor="gray.900" p={7}>
      <Logo width={212} height={40} />

      <Button 
        leftIcon={<Icon as={Fontisto} name="google" color="white" size="md" />} 
        type='SECONDARY'
        title='ENTRAR COM O GOOGLE' 
        mt="12"
        onPress={signIn}
      />

      <Text color="white" textAlign="center" mt="4">
        Não utilizamos nenhuma informação além {'\n'}
        do seu e-mail para criação da sua conta.
      </Text>
    </Center>
  )
}