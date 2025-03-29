import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Search, Filter, Database, Check } from "lucide-react";
import { Tabs, CustomTabsList, CustomTabsTrigger, CustomTabsContent } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { type SearchPublicationParams } from "@shared/schema";

interface SearchPanelProps {
  onSearch: (params: SearchPublicationParams) => void;
}

export default function SearchPanel({ onSearch }: SearchPanelProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [author, setAuthor] = useState("");
  const [university, setUniversity] = useState("");
  const [yearFrom, setYearFrom] = useState<string>("");
  const [yearTo, setYearTo] = useState<string>("");
  const [journal, setJournal] = useState("");
  const [category, setCategory] = useState("");
  const [databases, setDatabases] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("filters");

  const handleDatabaseToggle = (database: string) => {
    setDatabases(prev => 
      prev.includes(database) 
        ? prev.filter(db => db !== database) 
        : [...prev, database]
    );
  };

  const handleSearch = () => {
    const params: SearchPublicationParams = {
      query: searchQuery,
      author: author || undefined,
      university: university || undefined,
      yearFrom: yearFrom ? parseInt(yearFrom, 10) : undefined,
      yearTo: yearTo ? parseInt(yearTo, 10) : undefined,
      journal: journal || undefined,
      category: category === "all" ? undefined : category,
      database: databases.length > 0 ? databases : undefined,
      page: 1,
      limit: 10,
      sortBy: "year",
      sortDirection: "desc"
    };
    onSearch(params);
  };

  return (
    <section className="mb-8 bg-white p-6 rounded-lg shadow-md">
      <div className="mb-6">
        <h2 className="text-xl font-serif font-bold text-primary mb-4">Поиск публикаций</h2>
        
        <div className="relative">
          <Input 
            type="text" 
            placeholder="Введите запрос для поиска..." 
            className="w-full px-4 py-3 pr-12"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button 
            variant="ghost" 
            className="absolute right-12 top-2 h-8 px-4 text-secondary hover:text-secondary-dark hover:bg-transparent"
            onClick={handleSearch}
          >
            Поиск
          </Button>
          <Button 
            variant="ghost" 
            className="absolute right-2 top-2 h-8 w-8 p-0 text-secondary hover:text-secondary-dark hover:bg-transparent"
            onClick={handleSearch}
          >
            <Search className="h-5 w-5" />
            <span className="sr-only">Поиск</span>
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <CustomTabsList className="mb-4">
          <CustomTabsTrigger value="filters">
            <Filter className="h-4 w-4 mr-2" />Фильтры
          </CustomTabsTrigger>
          <CustomTabsTrigger value="databases">
            <Database className="h-4 w-4 mr-2" />Базы данных
          </CustomTabsTrigger>
        </CustomTabsList>
        
        <CustomTabsContent value="filters">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label className="block text-sm font-medium text-neutral-700 mb-1">Автор</Label>
              <Input 
                type="text" 
                className="w-full" 
                placeholder="Имя автора"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
              />
            </div>
            <div>
              <Label className="block text-sm font-medium text-neutral-700 mb-1">Университет</Label>
              <Input 
                type="text" 
                className="w-full" 
                placeholder="Название университета"
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
              />
            </div>
            <div>
              <Label className="block text-sm font-medium text-neutral-700 mb-1">Год публикации</Label>
              <div className="flex space-x-2">
                <Input 
                  type="number" 
                  className="w-full" 
                  placeholder="С"
                  value={yearFrom}
                  onChange={(e) => setYearFrom(e.target.value)}
                />
                <Input 
                  type="number" 
                  className="w-full" 
                  placeholder="По"
                  value={yearTo}
                  onChange={(e) => setYearTo(e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label className="block text-sm font-medium text-neutral-700 mb-1">Журнал</Label>
              <Input 
                type="text" 
                className="w-full" 
                placeholder="Название журнала"
                value={journal}
                onChange={(e) => setJournal(e.target.value)}
              />
            </div>
            <div>
              <Label className="block text-sm font-medium text-neutral-700 mb-1">Категория журнала</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Все категории" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все категории</SelectItem>
                  <SelectItem value="Q1-Q2">Статьи Q1-Q2</SelectItem>
                  <SelectItem value="Q3-Q4">Статьи Q3-Q4</SelectItem>
                  <SelectItem value="ВАК">Статьи ВАК</SelectItem>
                  <SelectItem value="РИНЦ">Статьи РИНЦ</SelectItem>
                  <SelectItem value="Патенты">Патенты</SelectItem>
                  <SelectItem value="Диссертации">Диссертации</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CustomTabsContent>
        
        <CustomTabsContent value="databases">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border rounded-md p-4 hover:shadow-md transition duration-200 cursor-pointer bg-white">
              <div className="flex items-center mb-2">
                <Checkbox 
                  id="scopus" 
                  className="mr-2 h-4 w-4 text-secondary focus:ring-secondary"
                  checked={databases.includes("Scopus")}
                  onCheckedChange={() => handleDatabaseToggle("Scopus")}
                />
                <Label htmlFor="scopus" className="font-medium">Scopus</Label>
              </div>
              <p className="text-sm text-neutral-600">Международная база данных научных публикаций</p>
            </div>
            
            <div className="border rounded-md p-4 hover:shadow-md transition duration-200 cursor-pointer bg-white">
              <div className="flex items-center mb-2">
                <Checkbox 
                  id="google-scholar" 
                  className="mr-2 h-4 w-4 text-secondary focus:ring-secondary"
                  checked={databases.includes("Google Scholar")}
                  onCheckedChange={() => handleDatabaseToggle("Google Scholar")}
                />
                <Label htmlFor="google-scholar" className="font-medium">Google Scholar</Label>
              </div>
              <p className="text-sm text-neutral-600">Поисковая система по научным публикациям</p>
            </div>
            
            <div className="border rounded-md p-4 hover:shadow-md transition duration-200 cursor-pointer bg-white">
              <div className="flex items-center mb-2">
                <Checkbox 
                  id="elibrary" 
                  className="mr-2 h-4 w-4 text-secondary focus:ring-secondary"
                  checked={databases.includes("eLIBRARY")}
                  onCheckedChange={() => handleDatabaseToggle("eLIBRARY")}
                />
                <Label htmlFor="elibrary" className="font-medium">eLIBRARY</Label>
              </div>
              <p className="text-sm text-neutral-600">Российская научная электронная библиотека</p>
            </div>
          </div>
        </CustomTabsContent>
      </Tabs>
      
      <div className="flex justify-end mt-6">
        <Button 
          className="bg-primary hover:bg-primary-dark text-white"
          onClick={handleSearch}
        >
          Применить фильтры
        </Button>
      </div>
    </section>
  );
}
