'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signup } from '../actions/signup'

export default function SignupPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      const result = await signup(name, email, password)
      if (result.success) {
        router.push('/login')
      } else {
        setError(result.error || '회원가입에 실패했습니다.')
      }
    } catch (err) {
      setError('회원가입 중 오류가 발생했습니다.')
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md">
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <h2 className="mb-6 text-2xl font-bold text-center">회원가입</h2>
          {error && <p className="mb-4 text-red-500 text-center">{error}</p>}
          <div className="mb-4">
            <Label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
              이름
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="이름을 입력하세요"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
              이메일
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="이메일을 입력하세요"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <Label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
              비밀번호
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <Button type="submit" className="w-full">
              가입하기
            </Button>
          </div>
        </form>
        <p className="text-center text-gray-500 text-xs">
          이미 계정이 있으신가요? <Link href="/login" className="text-blue-500 hover:text-blue-700">로그인</Link>
        </p>
      </div>
    </div>
  )
}