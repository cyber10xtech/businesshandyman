import { useState, useEffect } from "react";
import { Calendar, Heart, AlertCircle, Sparkles, Clock, AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import CustomerBottomNav from "@/components/layout/CustomerBottomNav";
import ProfessionalCard from "@/components/customer/ProfessionalCard";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useProfessionals } from "@/hooks/useProfessionals";
import { useFavorites } from "@/hooks/useFavorites";
import { useCustomerProfile } from "@/hooks/useCustomerProfile";

type HubTab = "bookings" | "favorites" | "emergency";
type DiscoverTab = "discover" | "recent";
type BookingFilter = "all" | "upcoming" | "in_progress" | "completed";


const mockBookings = [
  {
    id: "1",
    number: 1,
    title: "Kitchen Sink Repair",
    professionalName: "Mike Johnson",
    profession: "Plumber",
    date: "Jan 20, 2026",
    time: "14:00",
    location: "123 Main Street, New York, NY",
    price: 130,
    status: "upcoming" as const,
  },
  {
    id: "2",
    number: 2,
    title: "Electrical Outlet Installation",
    professionalName: "Sarah Williams",
    profession: "Electrician",
    date: "Jan 15, 2026",
    time: "10:00",
    location: "123 Main Street, New York, NY",
    price: 150,
    status: "completed" as const,
  },
  {
    id: "3",
    number: 3,
    title: "Cabinet Installation",
    professionalName: "David Chen",
    profession: "Carpenter",
    date: "Jan 25, 2026",
    time: "09:00",
    location: "123 Main Street, New York, NY",
    price: 800,
    status: "pending" as const,
  },
  {
    id: "4",
    number: 4,
    title: "Bathroom Plumbing",
    professionalName: "Mike Johnson",
    profession: "Plumber",
    date: "Jan 10, 2026",
    time: "11:00",
    location: "123 Main Street, New York, NY",
    price: 195,
    status: "completed" as const,
  },
  {
    id: "5",
    number: 5,
    title: "Interior Painting",
    professionalName: "Lisa Brown",
    profession: "Painter",
    date: "Jan 18, 2026",
    time: "08:00",
    location: "123 Main Street, New York, NY",
    price: 760,
    status: "in_progress" as const,
  },
];

const CustomerHub = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialTab = (searchParams.get("tab") as HubTab) || "bookings";
  
  const [activeHubTab, setActiveHubTab] = useState<HubTab>(initialTab);
  const [discoverTab, setDiscoverTab] = useState<DiscoverTab>("discover");

  const { professionals, loading: professionalsLoading } = useProfessionals();
  const { profile: customerProfile } = useCustomerProfile();
  const { favorites, loading: favoritesLoading, addFavorite, removeFavorite, isFavorite } = useFavorites();

  const handleToggleFavorite = async (professionalId: string) => {
    if (isFavorite(professionalId)) {
      await removeFavorite(professionalId);
    } else {
      await addFavorite(professionalId);
    }
  };

  // Filter emergency professionals (those with certain professions)
  const emergencyProfessions = ["Plumber", "Electrician", "HVAC", "Locksmith"];
  const emergencyProfessionals = professionals.filter(p => 
    emergencyProfessions.some(ep => p.profession?.toLowerCase().includes(ep.toLowerCase()))
  );

  const hubTabs = [
    { id: "bookings" as const, label: "My Bookings", icon: Calendar },
    { id: "favorites" as const, label: "Favorites", icon: Heart },
    { id: "emergency" as const, label: "Emergency", icon: AlertCircle },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-md mx-auto px-4 py-6">
        <h1 className="text-xl font-bold text-foreground mb-4">Hub</h1>

        {/* Hub Tabs */}
        <div className="flex gap-2 mb-4">
          {hubTabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeHubTab === tab.id ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveHubTab(tab.id)}
              className="flex-1 gap-1"
            >
              <tab.icon className="w-4 h-4" />
              {tab.label.split(" ")[1] || tab.label}
            </Button>
          ))}
        </div>

        {/* Content based on active tab */}
        {activeHubTab === "bookings" && (
          <>
            {/* Discover Toggle */}
            <div className="flex gap-2 mb-4">
              <Button
                variant={discoverTab === "discover" ? "default" : "outline"}
                size="sm"
                onClick={() => setDiscoverTab("discover")}
                className="gap-1"
              >
                <Sparkles className="w-4 h-4" />
                Discover Handymen
              </Button>
              <Button
                variant={discoverTab === "recent" ? "default" : "outline"}
                size="sm"
                onClick={() => setDiscoverTab("recent")}
                className="gap-1"
              >
                <Clock className="w-4 h-4" />
                Recently Connected
              </Button>
            </div>

            {professionalsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : discoverTab === "discover" ? (
              <>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-semibold text-foreground">Explore New Professionals</h2>
                  <span className="text-sm text-muted-foreground">{professionals.length} available</span>
                </div>
                {professionals.length === 0 ? (
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
                        weeklyRate={professional.contract_rate ? parseInt(professional.contract_rate) : 0}
                        bio={professional.bio || ""}
                        variant="detailed"
                        onView={() => navigate(`/customer/professional/${professional.id}`)}
                      />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-semibold text-foreground">Your Connections</h2>
                  <span className="text-sm text-muted-foreground">0 connections</span>
                </div>
                <div className="text-center py-8 text-muted-foreground">
                  <p>No connections yet. Book a professional to connect!</p>
                </div>
              </>
            )}
          </>
        )}

        {activeHubTab === "favorites" && (
          <>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-foreground">Favorites</h2>
              <span className="text-sm text-muted-foreground">{favorites.length} saved professionals</span>
            </div>
            {favoritesLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : favorites.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No favorites yet. Heart a professional to save them!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {favorites.map((fav) => (
                  <ProfessionalCard
                    key={fav.id}
                    id={fav.professional_id}
                    name={fav.professional?.full_name || "Professional"}
                    profession={fav.professional?.profession || "Professional"}
                    location={fav.professional?.location || "Location not set"}
                    lastActive="Recently"
                    rating={4.8}
                    reviewCount={0}
                    distance=""
                    dailyRate={fav.professional?.daily_rate ? parseInt(fav.professional.daily_rate) : 0}
                    variant="favorite"
                    isFavorite={true}
                    onBook={() => navigate(`/customer/professional/${fav.professional_id}`)}
                    onFavoriteToggle={() => handleToggleFavorite(fav.professional_id)}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {activeHubTab === "emergency" && (
          <>
            {/* Emergency Header */}
            <div className="bg-destructive rounded-xl p-4 mb-4">
              <div className="flex items-center gap-2 mb-1">
                <AlertCircle className="w-5 h-5 text-destructive-foreground" />
                <h2 className="font-semibold text-destructive-foreground">Emergency Services</h2>
              </div>
              <p className="text-sm text-destructive-foreground/80">
                Available 24/7 for urgent repairs
              </p>
            </div>

            {/* Warning Banner */}
            <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-3 mb-4">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-destructive">For immediate assistance</p>
                  <p className="text-xs text-muted-foreground">
                    These professionals offer emergency services and can respond quickly to urgent situations.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-foreground">Available Now</h3>
              <span className="text-sm text-muted-foreground">({emergencyProfessionals.length})</span>
            </div>

            {professionalsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : emergencyProfessionals.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No emergency professionals available</p>
              </div>
            ) : (
              <div className="space-y-3">
                {emergencyProfessionals.map((professional) => (
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
                    variant="emergency"
                    onView={() => navigate(`/customer/professional/${professional.id}`)}
                    onCall={() => window.open(`tel:${professional.phone_number}`, '_self')}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <CustomerBottomNav />
    </div>
  );
};

export default CustomerHub;
