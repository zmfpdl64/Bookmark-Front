"use client"
import { useState }  from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from 'next/image'; // Next.js의 Image 컴포넌트를 가져옵니다.
import { Bookmark, ExternalLink, Edit, Trash2 } from 'lucide-react'
import BookmarkItem from '@/components/ui/BookmarkItem'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
  } from "@/components/ui/dialog"


function BookmarkCard({ bookmark, onUpdate, onDelete }: { 
    bookmark: BookmarkItem, 
    onUpdate: (bookmark: BookmarkItem) => Promise<void>,
    onDelete: (bookmark: BookmarkItem) => void
  }) {
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [editedBookmark, setEditedBookmark] = useState(bookmark)
  
    const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>, callback: () => Promise<void>) => {
        if (e.key === 'Enter') {
            await callback(); // Enter 키 누를 때 createCategory 함수 실행
        }
      };

    const handleUpdate = async () => {
      await onUpdate(editedBookmark)
      setIsEditDialogOpen(false)
    }
  
    return (
      <Card className="overflow-hidden">
        <CardHeader className="p-0">
          <div className="relative h-40 w-full">
            {bookmark.imageUrl ? (
              <Image
                src={bookmark.imageUrl}
                alt={bookmark.title}
                layout="fill"
                objectFit="cover"
              />
            ) : (
              <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                <Bookmark className="h-12 w-12 text-gray-400" />
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <CardTitle className="text-lg mb-2">{bookmark.title}</CardTitle>
          <p className="text-sm text-gray-500 mb-4 truncate">{bookmark.link}</p>
          <div className="flex justify-between items-center">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">자세히 보기</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{bookmark.title}</DialogTitle>
                  <DialogDescription>{bookmark.link}</DialogDescription>
                </DialogHeader>
                <div className="mt-4">
                  <div className="relative h-60 w-full mb-4">
                    {bookmark.imageUrl ? (
                      <Image
                        src={bookmark.imageUrl}
                        alt={bookmark.title}
                        layout="fill"
                        objectFit="cover"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                        <Bookmark className="h-16 w-16 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <Button className="w-full" onClick={() => window.open(bookmark.link, '_blank')}>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    사이트 방문하기
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => setIsEditDialogOpen(true)}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => onDelete(bookmark)}>
                <Trash2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => window.open(bookmark.link, '_blank')}>
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>북마크 수정</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-title" className="text-right">
                  제목
                </Label>
                <Input
                  id="edit-title"
                  value={editedBookmark.title}
                  onChange={(e) => setEditedBookmark({...editedBookmark, title: e.target.value})}
                  onKeyDown={e => handleKeyDown(e, handleUpdate)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-url" className="text-right">
                  URL
                </Label>
                <Input
                  id="edit-url"
                  value={editedBookmark.link}
                  onChange={(e) => setEditedBookmark({...editedBookmark, link: e.target.value})}
                  onKeyDown={e => handleKeyDown(e, () => onUpdate(bookmark))}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-imageUrl" className="text-right">
                  이미지 URL
                </Label>
                <Input
                  id="edit-imageUrl"
                  value={editedBookmark.imageUrl || ''}
                  onChange={(e) => setEditedBookmark({...editedBookmark, imageUrl: e.target.value})}
                  onKeyDown={e => handleKeyDown(e, () => onUpdate(bookmark))}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleUpdate}>저장</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Card>
    )
  }
  export default BookmarkCard;