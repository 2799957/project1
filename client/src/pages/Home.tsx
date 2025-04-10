import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import SearchPanel from "@/components/SearchPanel";
import PublicationCard from "@/components/PublicationCard";
import SelectedPublications from "@/components/SelectedPublications";
import Pagination from "@/components/Pagination";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { SearchPublicationParams, Publication } from "@shared/schema";

export default function Home() {
  const [searchParams, setSearchParams] = useState<SearchPublicationParams>({
    page: 1,
    limit: 10,
    sortBy: "year",
    sortDirection: "desc",
  });
  const [selectedPublications, setSelectedPublications] = useState<Publication[]>([]);
  const [sortBy, setSortBy] = useState<string>("date-desc");

  // Query для загрузки публикаций
  const { data, isLoading, isError } = useQuery({
    queryKey: ["/api/publications", searchParams],
    queryFn: async ({ queryKey }) => {
      const [_, params] = queryKey;
      
      // Формируем URL с параметрами
      const queryParams = new URLSearchParams();
      Object.entries(params as Record<string, any>).forEach(([key, value]) => {
        if (value !== undefined) {
          if (Array.isArray(value)) {
            value.forEach(val => queryParams.append(key, val));
          } else {
            queryParams.append(key, String(value));
          }
        }
      });
      
      const response = await fetch(`/api/publications?${queryParams}`);
      if (!response.ok) {
        throw new Error("Ошибка загрузки публикаций");
      }
      return response.json();
    },
  });

  // Обработка смены страницы
  const handlePageChange = (page: number) => {
    setSearchParams(prev => ({ ...prev, page }));
  };

  // Обработка поиска и фильтрации
  const handleSearch = (params: SearchPublicationParams) => {
    setSearchParams(prev => ({ ...prev, ...params, page: 1 }));
  };

  // Обработка сортировки
  const handleSortChange = (value: string) => {
    setSortBy(value);
    
    let sortBy = "year";
    let sortDirection = "desc";
    
    switch (value) {
      case "date-desc":
        sortBy = "year";
        sortDirection = "desc";
        break;
      case "date-asc":
        sortBy = "year";
        sortDirection = "asc";
        break;
      case "title":
        sortBy = "title";
        sortDirection = "asc";
        break;
      case "journal":
        sortBy = "journal";
        sortDirection = "asc";
        break;
    }
    
    setSearchParams(prev => ({ ...prev, sortBy, sortDirection }));
  };

  // Управление выбранными публикациями
  const handleSelectPublication = (id: number, isSelected: boolean) => {
    if (isSelected) {
      const publication = data?.data.find((pub: Publication) => pub.id === id);
      if (publication && !selectedPublications.some((p: Publication) => p.id === id)) {
        setSelectedPublications(prev => [...prev, publication]);
      }
    } else {
      setSelectedPublications(prev => prev.filter((pub: Publication) => pub.id !== id));
    }
  };

  const handleRemoveSelected = (id: number) => {
    setSelectedPublications(prev => prev.filter((pub: Publication) => pub.id !== id));
  };

  const handleClearSelected = () => {
    setSelectedPublications([]);
  };

  // Вычисление общего количества страниц
  const totalPages = data ? Math.ceil(data.total / searchParams.limit) : 0;

  return (
    <div className="bg-neutral-50 min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <SearchPanel onSearch={handleSearch} />
        
        <Tabs defaultValue="search" className="mt-6">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="search" className="text-base">Результаты поиска</TabsTrigger>
            <TabsTrigger value="selected" className="text-base">
              Выбранные публикации
              {selectedPublications.length > 0 && (
                <span className="ml-2 bg-primary text-white rounded-full px-2 py-0.5 text-xs">
                  {selectedPublications.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="search" className="mt-0">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div className="mb-4 md:mb-0">
                <h2 className="text-xl font-serif font-bold text-primary">Результаты поиска</h2>
                <p className="text-neutral-600">
                  Найдено: {isLoading ? (
                    <span className="inline-flex items-center">
                      <span className="animate-pulse">...</span>
                      <span className="ml-2 text-xs text-blue-500">Загрузка данных</span>
                    </span>
                  ) : (
                    <span>{data?.total || 0}</span>
                  )} публикаций
                </p>
              </div>
              
              <div className="flex items-center">
                <span className="mr-2 text-neutral-700">Сортировать по:</span>
                <Select value={sortBy} onValueChange={handleSortChange}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Сортировка" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date-desc">Дате (сначала новые)</SelectItem>
                    <SelectItem value="date-asc">Дате (сначала старые)</SelectItem>
                    <SelectItem value="title">Названию</SelectItem>
                    <SelectItem value="journal">Журналу</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {isLoading ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Скелетоны карточек для отображения во время загрузки (имитируем 6 карточек) */}
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden p-5">
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-3/4">
                        <Skeleton className="h-6 w-full mb-2" />
                        <Skeleton className="h-6 w-3/4" />
                      </div>
                      <Skeleton className="h-5 w-5 rounded" />
                    </div>
                    <Skeleton className="h-4 w-2/3 mb-3" />
                    <Skeleton className="h-4 w-1/2 mb-3" />
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Skeleton className="h-6 w-16 rounded-full" />
                      <Skeleton className="h-6 w-16 rounded-full" />
                      <Skeleton className="h-6 w-16 rounded-full" />
                    </div>
                    <Skeleton className="h-4 w-3/4 mb-4" />
                    <div className="flex justify-end">
                      <Skeleton className="h-10 w-24 mr-2" />
                      <Skeleton className="h-10 w-24" />
                    </div>
                  </div>
                ))}
              </div>
            ) : isError ? (
              <div className="py-10 text-center text-red-500">
                Ошибка при загрузке публикаций. Пожалуйста, попробуйте позже.
              </div>
            ) : data.data.length === 0 ? (
              <div className="py-10 text-center text-neutral-500">
                Публикации не найдены. Попробуйте изменить параметры поиска.
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {data.data.map((publication: Publication) => (
                  <PublicationCard 
                    key={publication.id}
                    publication={publication}
                    isSelected={selectedPublications.some((p: Publication) => p.id === publication.id)}
                    onSelect={handleSelectPublication}
                  />
                ))}
              </div>
            )}
            
            <Pagination 
              currentPage={searchParams.page || 1} 
              totalPages={totalPages}
              onPageChange={handlePageChange}
              isLoading={isLoading}
            />
          </TabsContent>
          
          <TabsContent value="selected" className="mt-0">
            <SelectedPublications 
              publications={selectedPublications}
              onRemove={handleRemoveSelected}
              onClear={handleClearSelected}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
