import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState, useEffect } from 'react'
import Category from './Category'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Bookmark, Pencil, Trash, Plus } from 'lucide-react'
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"

interface CategoryProps {
    inUserId:number
    onStateChange:(categornName:string, categoryId:number) => void
}

export function CategoryCards({inUserId, onStateChange}: CategoryProps) {
    const baseUrl = 'https://kbookmark.co.kr/api/category'
    const [userId, setUserId] = useState<number>(inUserId);
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [updateCategoryName, setUpdateCategoryName] = useState('');
    const [newCategoryName, setnewCategoryName] = useState('');
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        readCategory();
    }, [])
    
    const createCategory = async () => {
        if (newCategoryName.trim()) {
          // 서버에 새로운 카테고리 추가 요청
          const newCategory = { "userId": userId, "title": newCategoryName.trim() }; // userId는 상황에 맞게 설정
          const response = await fetch(baseUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newCategory),
          });
          const addedCategory = await response.json();
          console.log(addedCategory)
          setCategories([...categories, addedCategory]);
          setnewCategoryName('');
        }
    };

    const updateCategory = async (categoryId:number) => {
        if (updateCategoryName.trim()) {
          // 서버에 새로운 카테고리 추가 요청
          const updateCategory = { "userId": userId, "categoryId": categoryId, "title": editingCategory.title }; // userId는 상황에 맞게 설정
          const response = await fetch(baseUrl, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(
                updateCategory
            ),
          });
          const updatedCategory = await response.json();
          
          setCategories(
            categories.map(category => 
                category.id === categoryId ? updatedCategory : category
            )
          );
          setIsDialogOpen(false);
          setUpdateCategoryName('');
          console.log(categories);
          console.log("카테고리 수정");
          console.log(updatedCategory)
        }
    };

    const readCategory = async () => {
        try {
          const response = await fetch(baseUrl+'/'+userId);
          if (!response.ok) {
            throw new Error('카테고리 가져오기 실패');
          }
          const data: Category[] = await response.json();
          setCategories(data);
          // setSelectedCategory(2); 
        } catch (error) {
          console.error('카테고리 가져오기 오류:', error);
        } 
      };

      
      const deleteCategory = async (categoryId: number) => {
          // 서버에 카테고리 삭제 요청
          console.log(`카테고리 삭제 userId:${userId} , categoryId:${categoryId}`)
          if (window.confirm("정말로 카테고리를 삭제하시겠습니까?")) { // 확인 대화 상자 추가
            const response = await fetch(`${baseUrl}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: userId,
                    categoryId: categoryId
                })
            });
            if (response.ok) {
                setCategories(categories.filter(category => category.id !== categoryId)); // 삭제된 카테고리 제외
            }
        }
          
      }
      const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>, callback: () => Promise<void>) => {
        if (e.key === 'Enter') {
            await callback(); // Enter 키 누를 때 createCategory 함수 실행
        }
      };
  

    return <Card>
    <CardHeader>
        <CardTitle className="text-center">내 카테고리</CardTitle>
    </CardHeader>

    <CardContent>
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories?.map((category) => (
            <li key={category.id} className="flex items-center space-x-2">
            <Button variant="outline" className="w-full justify-start" onClick={() => onStateChange(category.title, category.id)}>
                <Bookmark className="mr-2 h-4 w-4" />
                {category.title}
            </Button>
            
            <Dialog onOpenChange={setIsDialogOpen} >
            <DialogTrigger asChild>
            {/* 수정버튼 */}
            <Button variant="ghost" size="icon" className="mr-2" onClick={() => {
                setEditingCategory(category); // 수정할 카테고리 설정
                setUpdateCategoryName(category.title); // 입력 필드에 카테고리 제목 설정
                setIsDialogOpen(true); // 다이얼로그 열기
            }}>
                <Pencil className="h-4 w-4" />
            </Button>
            </DialogTrigger>
            {isDialogOpen === true && (
                <>
                <DialogContent>
            <DialogHeader>
                <DialogTitle>카테고리 수정</DialogTitle>
                <DialogDescription>
                카테고리 이름을 변경합니다.
                </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                    이름
                </Label>
                <Input
                    id="name"
                    value={editingCategory?.title || ''}
                    onChange={(e) => setEditingCategory({ ...editingCategory!, title: e.target.value })}
                    onKeyDown={(e) => handleKeyDown(e, () => updateCategory(category.id))}
                    className="col-span-3"
                />
                </div>
            </div>
            <DialogFooter>
                <Button onClick={()=> {
                    updateCategory(category.id);
                }}>저장</Button>
            </DialogFooter>
            </DialogContent>
                </>
            )}
            
        </Dialog>
            <Button size="icon" variant="ghost" onClick={() => {
                deleteCategory(category.id);
            }}>
                <Trash className="h-4 w-4" />
            </Button>   
            
            </li>
        ))}
        </ul>
        <div className="mt-4 flex space-x-2">
              <Input
                value={newCategoryName}
                onChange={(e) => setnewCategoryName(e.target.value)}
                placeholder="새 카테고리 이름"
                onKeyDown={(e) => handleKeyDown(e, createCategory)}
                className="flex-grow"
              />
              <Button onClick={createCategory}>
                <Plus className="mr-2 h-4 w-4" />
                추가
              </Button>
        </div>
    </CardContent>
</Card>
}
export default CategoryCards;