import Link from 'next/link'
import { Button } from "@/components/ui/button"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 z-0">
        <svg className="absolute left-0 top-0 h-full w-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path fill="#4F46E5" fillOpacity="0.2" d="M0,32L48,80C96,128,192,224,288,224C384,224,480,128,576,90.7C672,53,768,75,864,96C960,117,1056,139,1152,149.3C1248,160,1344,160,1392,160L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
        <svg className="absolute left-0 bottom-0 h-full w-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path fill="#10B981" fillOpacity="0.2" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,261.3C960,256,1056,224,1152,213.3C1248,203,1344,213,1392,218.7L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>

      {/* Content */}
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl relative z-10">
        <div>
          <h1 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            쓰레기 분류기
          </h1>
          <p className="mt-2 text-center text-sm text-gray-600">
            환경을 보호하고 재활용을 촉진하는 혁신적인 솔루션
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm -space-y-px">
            <Link href="/login" passHref>
              <Button className="w-full group relative flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                로그인
              </Button>
            </Link>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <div className="text-sm">
            <Link href="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
              계정이 없으신가요? 회원가입
            </Link>
          </div>
        </div>
      </div>
      <footer className="mt-8 text-center relative z-10">
        <p className="text-gray-600 text-sm">&copy; 2024 쓰레기 분류기. All rights reserved.</p>
      </footer>
    </div>
  )
}