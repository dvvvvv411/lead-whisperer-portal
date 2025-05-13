
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Search, X } from "lucide-react";
import { format } from "date-fns";
import { de } from "date-fns/locale";

interface TradeArchiveFilterBarProps {
  filters: {
    dateRange: {
      from: Date | undefined;
      to: Date | undefined;
    };
    asset: string;
    botStrategy: string;
    action: "all" | "buy" | "sell"; // Changed from "" to "all"
  };
  onFiltersChange: (filters: any) => void;
}

const TradeArchiveFilterBar = ({ filters, onFiltersChange }: TradeArchiveFilterBarProps) => {
  // Handle date range changes
  const handleDateChange = (field: 'from' | 'to', value: Date | undefined) => {
    onFiltersChange({
      ...filters,
      dateRange: {
        ...filters.dateRange,
        [field]: value
      }
    });
  };
  
  // Handle input field changes
  const handleInputChange = (field: string, value: string) => {
    onFiltersChange({
      ...filters,
      [field]: value
    });
  };
  
  // Clear all filters
  const clearFilters = () => {
    onFiltersChange({
      dateRange: {
        from: undefined,
        to: undefined
      },
      asset: "",
      botStrategy: "",
      action: "all" // Changed from "" to "all"
    });
  };
  
  return (
    <div className="bg-casino-highlight/20 rounded-md p-4 space-y-4">
      <div className="flex flex-col md:flex-row gap-3 items-start md:items-center justify-between">
        <h3 className="font-medium text-white">Filter</h3>
        
        <div className="flex flex-wrap gap-3 items-center">
          {/* Date Range Picker - From */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={`h-10 ${filters.dateRange.from ? 'text-white' : 'text-muted-foreground'}`}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.dateRange.from ? (
                  format(filters.dateRange.from, "dd.MM.yyyy", { locale: de })
                ) : (
                  "Von Datum"
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={filters.dateRange.from}
                onSelect={(date) => handleDateChange('from', date)}
                initialFocus
                locale={de}
              />
            </PopoverContent>
          </Popover>
          
          {/* Date Range Picker - To */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={`h-10 ${filters.dateRange.to ? 'text-white' : 'text-muted-foreground'}`}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.dateRange.to ? (
                  format(filters.dateRange.to, "dd.MM.yyyy", { locale: de })
                ) : (
                  "Bis Datum"
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={filters.dateRange.to}
                onSelect={(date) => handleDateChange('to', date)}
                initialFocus
                locale={de}
              />
            </PopoverContent>
          </Popover>
          
          {/* Asset Filter */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Asset"
              className="h-10 pl-9 pr-4 bg-background/50"
              value={filters.asset}
              onChange={(e) => handleInputChange('asset', e.target.value)}
            />
          </div>
          
          {/* Bot Strategy Filter */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Bot Strategie"
              className="h-10 pl-9 pr-4 bg-background/50"
              value={filters.botStrategy}
              onChange={(e) => handleInputChange('botStrategy', e.target.value)}
            />
          </div>
          
          {/* Action Type Select */}
          <Select
            value={filters.action}
            onValueChange={(value) => handleInputChange('action', value as "all" | "buy" | "sell")}
          >
            <SelectTrigger className="h-10 w-[110px] bg-background/50">
              <SelectValue placeholder="Aktion" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle</SelectItem>
              <SelectItem value="buy">Kauf</SelectItem>
              <SelectItem value="sell">Verkauf</SelectItem>
            </SelectContent>
          </Select>
          
          {/* Clear Filters Button */}
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10"
            onClick={clearFilters}
            title="Filter zurücksetzen"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Applied Filters Summary (visible when filters are applied) */}
      {(filters.dateRange.from || filters.dateRange.to || filters.asset || filters.botStrategy || filters.action !== "all") && (
        <div className="flex flex-wrap gap-2">
          {filters.dateRange.from && (
            <div className="bg-accent1/20 text-accent1-light rounded-full px-3 py-1 text-xs flex items-center">
              Von: {format(filters.dateRange.from, "dd.MM.yyyy", { locale: de })}
              <button 
                className="ml-2" 
                onClick={() => handleDateChange('from', undefined)}
                aria-label="Von Datum Filter entfernen"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
          
          {filters.dateRange.to && (
            <div className="bg-accent1/20 text-accent1-light rounded-full px-3 py-1 text-xs flex items-center">
              Bis: {format(filters.dateRange.to, "dd.MM.yyyy", { locale: de })}
              <button 
                className="ml-2" 
                onClick={() => handleDateChange('to', undefined)}
                aria-label="Bis Datum Filter entfernen"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
          
          {filters.asset && (
            <div className="bg-accent1/20 text-accent1-light rounded-full px-3 py-1 text-xs flex items-center">
              Asset: {filters.asset}
              <button 
                className="ml-2" 
                onClick={() => handleInputChange('asset', '')}
                aria-label="Asset Filter entfernen"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
          
          {filters.botStrategy && (
            <div className="bg-accent1/20 text-accent1-light rounded-full px-3 py-1 text-xs flex items-center">
              Bot: {filters.botStrategy}
              <button 
                className="ml-2" 
                onClick={() => handleInputChange('botStrategy', '')}
                aria-label="Bot Filter entfernen"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
          
          {filters.action !== "all" && (
            <div className="bg-accent1/20 text-accent1-light rounded-full px-3 py-1 text-xs flex items-center">
              Aktion: {filters.action === 'buy' ? 'Kauf' : 'Verkauf'}
              <button 
                className="ml-2" 
                onClick={() => handleInputChange('action', 'all')}
                aria-label="Aktions Filter entfernen"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TradeArchiveFilterBar;
