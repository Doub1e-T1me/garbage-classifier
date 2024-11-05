'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { format, subDays } from 'date-fns'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/components/ui/use-toast"
import { getUser } from '../actions/getUser'
import { logout } from '../actions/logout'
import { deleteData } from '../actions/deleteDate'

export default function DashboardPage() {
  const [user, setUser] = useState<{ name: string } | null>(null)
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [filteredPhotos, setFilteredPhotos] = useState<any[]>([])
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    async function fetchUser() {
      const userData = await getUser()
      if (userData) {
        setUser(userData)
      } else {
        router.push('/login')
      }
    }
    fetchUser()
  }, [router])

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const response = await fetch('/api/dashboard')
        const data = await response.json()
        console.log('Fetched data:', data)
        setDashboardData(data)
        setFilteredPhotos(data.photos || []) 
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      }
    }

    fetchDashboardData()
  }, [router])

  useEffect(() => {
    if (dashboardData && date) {
      const selectedDate = format(date, 'yyyy-MM-dd');
      setFilteredPhotos(
        dashboardData.photos.filter((photo: any) => {
          const photoDate = format(new Date(photo.date), 'yyyy-MM-dd');
          return photoDate === selectedDate;
        })
      );
    } else {
      setFilteredPhotos(dashboardData?.photos || []);
    }
  }, [date, dashboardData]);

  const renderDate = (dateString: string) => {
    const localDate = new Date(dateString)
    return localDate.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  }

  const handleDeleteData = async () => {
    const result = await deleteData()
    if (result.success) {
      toast({
        title: "데이터 삭제 성공",
        description: result.message,
      })
    } else {
      toast({
        title: "데이터 삭제 실패",
        description: result.message,
        variant: "destructive",
      })
    }
    setIsDeleteDialogOpen(false)
  }

  const handleLogout = async () => {
    await logout()
    router.push('/')
  }

  if (!user || !dashboardData) {
    return <div>로딩 중...</div>
  }

  const { totalClassified, categories, dailyClassifications } = dashboardData  // API에서 가져온 데이터 사용

  const groupedData = dailyClassifications.reduce((acc: any, cur: any) => {
    const date = format(new Date(cur.date), 'yyyy-MM-dd');
    if (!acc[date]) {
      acc[date] = { date, total: 0, plastic: 0, paper: 0, metal: 0, glass: 0 };
    }
    acc[date].total += cur.total;
    acc[date][cur.category] = cur.total;
    return acc;
  }, {});

  const chartData = Object.values(groupedData);

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-2xl font-bold text-indigo-600">쓰레기 분류기</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">{user.name}</span>
              <Button onClick={() => setIsDeleteDialogOpen(true)} variant="destructive">
                데이터 삭제
              </Button>
              <Button onClick={handleLogout} variant="outline">
                로그아웃
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">대시보드</h1>
          
          <Tabs defaultValue="photos" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="photos">📷 사진</TabsTrigger>
              <TabsTrigger value="statistics">📊 통계</TabsTrigger>
            </TabsList>
            <TabsContent value="photos">
              <div className="mb-4">
                <Popover>
                  <PopoverTrigger asChild>
                  <Button
                      variant={"outline"}
                      className={cn(
                        "w-[280px] justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                   )}
                  >
                    📅 {date ? format(date, 'yyyy-MM-dd') : <span>날짜 선택</span>}
                  </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      defaultMonth={date}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
  {filteredPhotos.map((photo) => (
    <Card key={photo.id}>
      <CardContent className="p-0">
        <img
          src={photo.image_url || '/default-image.jpg'}  // DB에서 가져온 image_url 사용, 없으면 기본 이미지 사용
          alt={`${photo.category} 쓰레기`}
          className="w-full h-48 object-cover rounded-t-lg"
        />
      </CardContent>
      <CardHeader>
        <CardTitle className="text-sm font-medium">{photo.category}</CardTitle>
        <p className="text-sm text-muted-foreground">{renderDate(photo.date)}</p>  {/* 날짜를 로컬 시간대로 표시 */}
      </CardHeader>
    </Card>
  ))}
</div>
            </TabsContent>
            <TabsContent value="statistics">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">총 분류된 쓰레기</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">{totalClassified}</p>  {/* 총 분류된 쓰레기 */}
                  </CardContent>
                </Card>
                {Object.entries(categories).map(([category, count]) => (
                  <Card key={category}>
                    <CardHeader>
                      <CardTitle className="text-sm font-medium capitalize">{category}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">{count}</p>  {/* 카테고리별 분류된 쓰레기 */}
                    </CardContent>
                  </Card>
                ))}
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>일일 분류 통계</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={chartData}  // 일일 분류 통계 데이터
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="date"
                          tickFormatter={(date) => format(new Date(date), 'yyyy-MM-dd')}
                        />
                        <YAxis />
                        <Tooltip
                          labelFormatter={(label) => format(new Date(label), 'yyyy-MM-dd HH:mm')}
                        />
                        <Legend />
                        <Line type="monotone" dataKey="total" name="총계" stroke="#8884d8" strokeWidth={2} />
                        <Line type="monotone" dataKey="plastic" name="플라스틱" stroke="#82ca9d" />
                        <Line type="monotone" dataKey="paper" name="종이" stroke="#ffc658" />
                        <Line type="monotone" dataKey="metal" name="금속" stroke="#ff7300" />
                        <Line type="monotone" dataKey="glass" name="유리" stroke="#0088fe" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>모든 데이터를 삭제하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>
              이 작업은 되돌릴 수 없습니다. 모든 분류된 쓰레기 데이터가 영구적으로 삭제됩니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteData}>삭제</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
