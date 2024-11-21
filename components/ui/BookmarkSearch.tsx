import { Search } from 'lucide-react'
import { Input } from "@/components/ui/input"


const BookmarkSearch = () => {
  return (
    <div className="max-w-2xl mx-auto mb-8">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          type="search"
          placeholder="북마크 검색..."
          className="pl-10 pr-4 py-2 w-full"
        />
      </div>
    </div>
  );
};
export default BookmarkSearch;
