import { useState, useEffect } from 'react';
import BookmarkItem from '@/components/ui/BookmarkItem'
import BookmarkCard from 'components/ui/BookmarkCard'
import { Plus } from 'lucide-react'
import { bookmarkService } from '@/components/ui/BookmarkService';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    // DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
  } from "@/components/ui/dialog"
interface BookmarksProps {
  inCategoryName:string
  inUserId:number 
  inCategoryId:number
}

function BookmarkCards({inCategoryName, inUserId, inCategoryId} : BookmarksProps) {
  const[categoryTitle] = useState<string>(inCategoryName);
  const[userId] = useState<number>(inUserId);
  const[categoryId] = useState<number>(inCategoryId);
    useEffect(() => {

    },[])

    const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([])
    const [newBookmark, setNewBookmark] = useState<any>({
      title: '',
      link: '',
      imageUrl: ''
    });
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    // const [searchTerm] = useState("")
    // const [editedBookmark, setEditedBookmark] = useState<BookmarkItem | null>(null); // 수정된 북마크 상태 추가
    const [viewMode, setViewMode] = useState<'card' | 'list'>('card')
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
    const baseUrl = 'https://kbookmark.co.kr/api/bookmark'

    const createBookmark = async () : Promise<void> => {
        const bookmark = newBookmark;
        // 실제로는 서버에 POST 요청을 보내야 합니다.
        console.log(bookmark);
        const response = await fetch(`${baseUrl}`, {
          method: 'POST',
          headers: {'Content-Type' :'application/json'},
          body: JSON.stringify ({
            categoryId: categoryId,
            userId: userId,
            title: bookmark.title,
            link: bookmark.link
          })
        });
        const addedBookmark = await response.json();
        console.log(addedBookmark);
        setBookmarks([...bookmarks, addedBookmark]);
        setIsCreateDialogOpen(false);
      }
      
      const updateBookmark = async (updateBookmark: BookmarkItem): Promise<void> => {
        // 실제로는 서버에 PUT 요청을 보내야 합니다.
        console.log(updateBookmark);

        const response =  await fetch(`${baseUrl}`, {
          method: 'PUT',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            userId: updateBookmark.userId,
            bookmarkId: updateBookmark.id,
            title: updateBookmark.title,
            link: updateBookmark.link
          })
        })

        const updatedBookmark = await response.json();
        setBookmarks(
          bookmarks.map( bm => bm.id === updateBookmark.id ? updatedBookmark : bm
        ));
      }
      
      const deleteBookmark = async (deleteBookmark: BookmarkItem): Promise<void> => {
        // 실제로는 서버에 PUT 요청을 보내야 합니다.
        console.log(deleteBookmark);

        const response =  await fetch(`${baseUrl}`, {
          method: 'DELETE',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            userId: deleteBookmark.userId,
            bookmarkId: deleteBookmark.id
          })
        })

        await response.json();

        setBookmarks(
          bookmarks.filter(bookmark => bookmark.id !== deleteBookmark.id
        )) ;
        

      }

    useEffect(() => {
      console.log(categoryTitle)
    if (!userId || !categoryId) return
    getBookmarks()
  }, [userId, categoryId])
  
  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>, callback: () => Promise<void>) => {
    if (e.key === 'Enter') {
        await callback(); // Enter 키 누를 때 createCategory 함수 실행
    }
  };

  const getBookmarks = async () => {
    try {
      console.log(userId, categoryId);
      setLoading(true)
      const data = await bookmarkService.fetchBookmarkByuserIdAndCategoryId(Number(userId), Number(categoryId)) // 메서드 이름 수정
      setBookmarks(data as unknown as BookmarkItem[]) // 타입 변환을 'unknown'을 통해 수행
    } catch (err) {
      setError('북마크를 불러오는 중 오류가 발생했습니다.')
      setBookmarks([])
      console.error(err);
    } finally {
      setLoading(false)
    }
  }
  const handleButtonClick = (link:string) => {
        window.open(link, "_blank", "noopener,noreferrer"); // 새 탭에서 링크 열기
    };

  // const filteredBookmarks = bookmarks.filter(bookmark =>
  //   bookmark.title.toLowerCase().includes(searchTerm.toLowerCase())
  // )

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-xl font-semibold text-gray-600">로딩 중...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-xl font-semibold text-red-600">{error}</p>
      </div>
    )
  }
    return (
        
        <div >
            <main className="container mx-auto px-4 py-8">
            
            <div className="flex flex-col items-end">
              <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1 mb-2">
                  <button
                    className={`inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium ${
                      viewMode === 'card'
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => setViewMode('card')}
                  >
                    <svg
                      className="mr-2 h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                      />
                    </svg>
                    카드
                  </button>
                  <button
                    className={`inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium ${
                      viewMode === 'list'
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => setViewMode('list')}
                  >
                    <svg
                      className="mr-2 h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 10h16M4 14h16M4 18h16"
                      />
                    </svg>
                    리스트
                  </button>
                
                  
                  </div>
              <Dialog>
                <DialogTrigger>
                  <Button onClick={() => setIsCreateDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    새 북마크
                  </Button>
                </DialogTrigger>
                {isCreateDialogOpen && (
                  <>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>새 북마크 추가</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="title" className="text-right">
                            제목
                          </Label>
                          <Input
                            id="title"
                            value={newBookmark.title}
                            onChange={(e) => setNewBookmark({...newBookmark, title: e.target.value})}
                            onKeyDown={e => handleKeyDown(e, createBookmark)}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="url" className="text-right">
                            URL
                          </Label>
                          <Input
                            id="url"
                            value={newBookmark.link}
                            onChange={(e) => setNewBookmark({...newBookmark, link: e.target.value})}
                            onKeyDown={e => handleKeyDown(e, createBookmark)}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="imageUrl" className="text-right">
                            이미지 URL
                          </Label>
                          <Input
                            id="imageUrl"
                            value={newBookmark.imageUrl || ''}
                            onChange={(e) => setNewBookmark({...newBookmark, imageUrl: e.target.value || null})}
                            onKeyDown={e => handleKeyDown(e, createBookmark)}
                            className="col-span-3"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit" onClick={createBookmark}>저장</Button>
                      </DialogFooter>
                    </DialogContent>
                    </>
                    )}
                  </Dialog>
                </div>
                
              
                <h1 className="text-4xl text-center font-bold text-gray-900 mb-8">{categoryTitle} 북마크</h1>
                  <div className={viewMode === 'card' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
                    {bookmarks.map((bookmark) => (
                    <BookmarkCard 
                        key={bookmark.id} 
                        bookmark={bookmark} 
                        onUpdate={updateBookmark}
                        onDelete={() => deleteBookmark(bookmark)}
                    />
                    ))}
                  </div>
            </main>
            <div className={viewMode === 'card' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
          </div>
        </div>
    );
  }
  export default BookmarkCards;
