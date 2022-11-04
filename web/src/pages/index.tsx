import { FormEvent, useCallback, useState } from 'react'
import Image from 'next/image'

import { API } from '../lib/axios'

import appPreviewImg from '../assets/app-nlw-copa-preview.png'
import userAvatarExampleImg from '../assets/users-avatar-example.png'
import logoNlwCopaImg from '../assets/logo.svg'
import iconCheckImg from '../assets/icon-check.svg'

interface HomeProps {
  poolCount: number
  guessCount: number
  userCount: number
}

interface HomeResponse {
  code: string
}

export default function Home({ poolCount, guessCount, userCount }: HomeProps) {
  const [poolTitle, setPoolTitle] = useState('')

  const handleCreatePool = useCallback(
    async (event: FormEvent) => {
      event.preventDefault()

      try {
        const response = await API.post<HomeResponse>('/pools', {
          title: poolTitle,
        })

        const { code } = response.data

        await navigator.clipboard.writeText(code)

        setPoolTitle('')

        alert(
          `Bolão criado com sucesso, o código ${code} foi copiado para a área de transferência!`,
        )
      } catch (err) {
        console.log(err)
        alert('Falha ao criar o bolão, tente novamente!')
      }
    },
    [poolTitle],
  )

  return (
    <div className="max-w-[1124px] h-screen mx-auto grid grid-cols-2 items-center gap-28">
      <main>
        <Image src={logoNlwCopaImg} alt="NLW COPA" quality={100} />

        <h1 className="mt-14 text-white text-5xl font-bold leading-tight">
          Crie seu próprio bolão da copa e compartilhe entre amigos!
        </h1>

        <div className="mt-10 flex items-center gap-2">
          <Image src={userAvatarExampleImg} alt="" quality={100} />
          <strong className="text-gray-100 text-xl">
            <span className="text-ignite-500">+{userCount}</span> pessoas estão
            usando
          </strong>
        </div>

        <form onSubmit={handleCreatePool} className="mt-10 flex gap-2">
          <input
            className="flex-1 px-6 py-4 rounded bg-gray-800 border border-gray-600 text-sm text-gray-200"
            type="text"
            placeholder="Qual nome do seu bolão?"
            value={poolTitle}
            onChange={(event) => setPoolTitle(event.target.value)}
            required
          />
          <button
            className="bg-yellow-500 px-6 py-4 rounded text-gray-900 font-bold text-sm uppercase transition hover:bg-yellow-700"
            type="submit"
          >
            Criar meu bolão
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-300 leading-relaxed">
          Após criar seu bolão, você receberá um código único que poderá usar
          para convidar outras pessoas.🚀
        </p>

        <div className="mt-10 pt-10 border-t border-gray-600 flex items-center justify-between text-gray-100">
          <div className="flex items-center gap-6">
            <Image src={iconCheckImg} alt="" quality={100} />
            <div className="flex flex-col">
              <span className="font-bold text-2xl">+{poolCount}</span>
              <span>Bolões criados</span>
            </div>
          </div>

          <div className="w-px h-14 bg-gray-600" />

          <div className="flex items-center gap-6">
            <Image src={iconCheckImg} alt="" quality={100} />
            <div className="flex flex-col">
              <span className="font-bold text-2xl">+{guessCount}</span>
              <span>Palpites enviados</span>
            </div>
          </div>
        </div>
      </main>

      <Image
        src={appPreviewImg}
        alt="Dois celulares mostrando um prévia da aplicação móvel do NLW COPA"
        quality={100}
      />
    </div>
  )
}

export const getServerSideProps = async () => {
  const [poolCountResponse, guessCountResponse, userCountResponse] =
    await Promise.all([
      API.get('/pools/count'),
      API.get('/guesses/count'),
      API.get('/users/count'),
    ])

  return {
    props: {
      poolCount: poolCountResponse.data.count,
      guessCount: guessCountResponse.data.count,
      userCount: userCountResponse.data.count,
    },
  }
}
