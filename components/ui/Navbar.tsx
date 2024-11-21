import Link from 'next/link';
import { Bookmark, User } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { clickSignUp } from './LoginService';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface NavbarProps {
  isLoggedIn:boolean
  onStateChange: (isAuthenticated: boolean, userId: number | null) => void
}

const Navbar = ( {isLoggedIn, onStateChange} : NavbarProps ) => {
  

  return (
    <nav className="bg-white shadow-sm">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center">
                <Link href="/" className="flex items-center no-underline">
                    <Bookmark className="h-6 w-6 text-blue-600 mr-2" />
                    <span className="text-xl font-bold text-gray-900">Booker</span>
                </Link>
              </div>
              <div className="flex space-x-4">
                <Link href="#" passHref>
                  <Button variant="ghost">카테고리</Button>
                </Link>
                {/* <Link href="/bookmarks" passHref>
                  <Button variant="ghost">북마크</Button>
                </Link> */}
              </div>
              <div>
                {isLoggedIn ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <User className="h-5 w-5" />
                        <span className="sr-only">사용자 메뉴</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>내 계정</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Link href="/profile">프로필</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Link href="/settings">설정</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onStateChange(false, 1)}>
                        로그아웃
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <div className="space-x-2">
                    <Button variant="ghost" onClick={() => clickSignUp()}>로그인</Button>
                    
                  </div>  
                )}
              </div>
            </div>
          </div>
        </nav>
  );
};

export default Navbar;