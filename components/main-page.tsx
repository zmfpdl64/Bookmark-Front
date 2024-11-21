  "use client"

  import { useState, useEffect } from 'react'
  import { Button } from "@/components/ui/button"
  import Navbar from './ui/Navbar'
  import BookmarkSearch from './ui/BookmarkSearch'
  import { CategoryCards } from './ui/CategoryCards' // 변경: 기본 내보내기에서 명명된 내보내기로 수정
  import BookmarkCards from './ui/BookmarkCards' // Bookmarks 컴포넌트 추가
  import Login from './ui/Login'
  import { fetchAuthCode } from './ui/LoginService'
  

  export function MainPageComponent() {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [selectedCategory, setSelectedCategory] = useState<number>(null) // 선택된 카테고리 ID 상태 추가
    const [categoryTitle, setCategoryTitle] = useState<string>(null);
    const [categoryId, setCategoryId] = useState<number>(null);
    const [userId, setUserId] = useState<number>(null);

    useEffect(() => {
      console.log(window.location.href);
      const urlParams = new URLSearchParams(window.location.search);
      const authCode = urlParams.get('code'); // 리디렉션 URL에서 코드 가져오기
      const token = localStorage.getItem('token');

      const handleAuth = () => {
        if (authCode && token === null) {
          fetchAuthCode(clickLogin); // 비동기 함수 호출
        } else if (token !== null) {
          setIsLoggedIn(true);
          setUserId(Number(localStorage.getItem("userId")))
          setSelectedCategory(1);
        }
        setIsLoading(false); // 로딩 상태를 false로 설정
      };

      handleAuth(); // 인증 처리 함수 호출

      return () => {
        setCategoryId(1);
      }
    }, []); // 빈 배열을 의존성 배열로 사용하여 컴포넌트 마운트 시 한 번만 실행

    

    
    const clickCategory = (categoryTitle:string, categoryId: number) => {
      setCategoryId(categoryId); // 클릭한 categoryId로 상태 업데이트
      setCategoryTitle(categoryTitle);
      setSelectedCategory(2);
    };
    const backToOrigin = () => {
      setSelectedCategory(1);
    };
    const clickLogin = (isLoggedIn : boolean, userId : number) => {
      console.log(`isLoggedIn: ${isLoggedIn} , userId: ${userId}`)
      setIsLoggedIn(isLoggedIn);
      setUserId(userId);
      setSelectedCategory(1);
    }
    const loginLogout = (isLoggedIn : boolean, userId : number | null) => {
      setIsLoggedIn(isLoggedIn);
      if(isLoggedIn === true) {
        setSelectedCategory(1);
        console.log(`userId: ${userId}`)
        if(userId !== null) {
          setUserId(userId);
        }
      }else{
        console.log(`로그인 X`)
        setSelectedCategory(0);
        window.localStorage.removeItem('token');
        window.localStorage.removeItem('userId');
        // setUserId(userId);
      }
    }

    // if(typeof window !== 'undefined' && isLoading === false) {
    //   if(window.localStorage.getItem("token") !== null){
    //     setIsLoggedIn(true);
    //   }
    // }
    

if(isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <p className="text-xl font-semibold text-gray-600 animate-pulse">로딩 중...</p>
          </div>
        </div>
      </div>
    )
  }

    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar isLoggedIn={isLoggedIn} onStateChange={loginLogout} />
        
        <main className="flex-grow container mx-auto px-4 py-8">
        {isLoggedIn ? (
          <div className="space-y-6">
          <BookmarkSearch />
            {selectedCategory === 1 && (
              <>
                <CategoryCards inUserId={userId} onStateChange={clickCategory} />
              </>
            )}
            
            {selectedCategory === 2 && (
              <>
                <Button
                  variant="outline"
                  className="mb-4 w-full flex items-center text-gray-600 hover:text-gray-800 transition-colors duration-200"
                  onClick={backToOrigin}
                >
                  뒤로가기
                </Button>
                <BookmarkCards inCategoryName={categoryTitle} inUserId={userId} inCategoryId={categoryId} />
              </>
            )}
          </div>
        ) : (
          <div className="mt-8">
            <Login />
          </div>
        )}
      </main>
      </div>
    )
  }
