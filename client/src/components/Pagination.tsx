import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

export default function Pagination({ currentPage, totalPages, onPageChange, isLoading = false }: PaginationProps) {
  // Если страниц нет или всего одна страница, не показываем пагинацию
  if (totalPages <= 1) return null;

  // Определяем, какие страницы показывать
  const getPageNumbers = () => {
    const pageNumbers: (number | string)[] = [];
    
    if (totalPages <= 7) {
      // Если страниц немного, показываем все
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Всегда показываем первую страницу
      pageNumbers.push(1);
      
      if (currentPage > 3) {
        pageNumbers.push('...');
      }
      
      // Показываем страницу до текущей, текущую и страницу после текущей
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
      
      if (currentPage < totalPages - 2) {
        pageNumbers.push('...');
      }
      
      // Всегда показываем последнюю страницу
      pageNumbers.push(totalPages);
    }
    
    return pageNumbers;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex justify-center mb-8">
      <nav className="inline-flex rounded-md shadow-sm -space-x-px">
        <Button
          variant="outline"
          className="px-3 py-2 rounded-l-md border border-neutral-300 bg-white text-neutral-500 hover:bg-neutral-50"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        {pageNumbers.map((page, index) => {
          if (typeof page === 'string') {
            return (
              <span 
                key={`ellipsis-${index}`}
                className="px-3 py-2 border border-neutral-300 bg-white text-neutral-700"
              >
                {page}
              </span>
            );
          }
          
          return (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              className={`px-3 py-2 border border-neutral-300 ${
                currentPage === page 
                  ? "bg-primary text-white hover:bg-primary-dark" 
                  : "bg-white text-neutral-700 hover:bg-neutral-50"
              }`}
              onClick={() => onPageChange(page)}
            >
              {page}
            </Button>
          );
        })}
        
        <Button
          variant="outline"
          className="px-3 py-2 rounded-r-md border border-neutral-300 bg-white text-neutral-500 hover:bg-neutral-50"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </nav>
    </div>
  );
}
