import { useState } from "react";
import { Search, SlidersHorizontal, ChevronDown, AlertCircle, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import CustomerBottomNav from "@/components/layout/CustomerBottomNav";
import ProfessionalCard from "@/components/customer/ProfessionalCard";
import CategoryCard from "@/components/customer/CategoryCard";
import { useNavigate } from "react-router-dom";
import { useProfessionals } from "@/hooks/useProfessionals";

const categories = [
  { name: "Architect", icon: "architect" },
  { name: "Project Manager", icon: "project-manager" },
  { name: "Builder", icon: "builder" },
  { name: "Interior Designer", icon: "interior-designer" },
  { name: "Electrical Engineer", icon: "electrical-engineer" },
  { name: "Structural Engineer", icon: "structural-engineer" },
];

const CustomerHome = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "professionals" | "handymen">("all");
  const [sortBy, setSortBy] = useState("Top Rated");
  const [showAllCategories, setShowAllCategories] = useState(false);
  
  const { professionals, loading, fetchProfessionals } = useProfessionals();

  const displayedCategories = showAllCategories ? categories : categories.slice(0, 6);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    fetchProfessionals({ search: value });
  };

  const handleCategoryClick = (categoryName: string) => {
    fetchProfessionals({ profession: categoryName });
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-md mx-auto px-4 py-6">
        <h1 className="text-xl font-bold text-foreground mb-4">Find a Professional</h1>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search for services..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 h-10 bg-muted/50 border-0 rounded-xl"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-4">
          {(["all", "professionals", "handymen"] as const).map((tab) => (
            <Button
              key={tab}
              variant={activeTab === tab ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab(tab)}
              className="capitalize rounded-full"
            >
              {tab === "all" ? "All" : tab}
            </Button>
          ))}
        </div>

        {/* Filters Row */}
        <div className="flex items-center gap-2 mb-4">
          <Button variant="outline" size="sm" className="gap-1">
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </Button>
          <Button variant="outline" size="sm" className="gap-1">
            {sortBy}
            <ChevronDown className="w-4 h-4" />
          </Button>
        </div>

        {/* Urgent Help Banner */}
        <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-destructive mb-1">Need Urgent Help?</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Emergency services available 24/7 for urgent repairs
              </p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate("/customer/hub?tab=emergency")}
                className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
              >
                Get Emergency Help
              </Button>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="mb-6">
          <h2 className="font-semibold text-foreground mb-3">All Categories</h2>
          <div className="grid grid-cols-3 gap-3">
            {displayedCategories.map((category) => (
              <CategoryCard
                key={category.name}
                name={category.name}
                icon={category.icon}
                onClick={() => handleCategoryClick(category.name)}
              />
            ))}
          </div>
          <button
            onClick={() => setShowAllCategories(!showAllCategories)}
            className="w-full text-center text-primary text-sm font-medium mt-3 hover:underline"
          >
            {showAllCategories ? "Show Less" : `Show All Categories (22)`}
          </button>
        </div>

        {/* Top Rated Professionals */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-foreground">Top Rated Professionals</h2>
            <Badge variant="secondary" className="text-xs">
              {professionals.length}
            </Badge>
          </div>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : professionals.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No professionals found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {professionals.map((professional) => (
                <ProfessionalCard
                  key={professional.id}
                  id={professional.id}
                  name={professional.full_name}
                  profession={professional.profession || "Professional"}
                  location={professional.location || "Location not set"}
                  lastActive="Recently"
                  rating={4.8}
                  reviewCount={0}
                  distance=""
                  dailyRate={professional.daily_rate ? parseInt(professional.daily_rate) : 0}
                  variant="compact"
                  onView={() => navigate(`/customer/professional/${professional.id}`)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <CustomerBottomNav />
    </div>
  );
};

export default CustomerHome;
