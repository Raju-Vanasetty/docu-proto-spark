import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { MapPin, Search, Droplets, Home, Shield, Star } from "lucide-react";
import farmPlots from "@/assets/farm-plots.jpg";
import { supabase } from "@/integrations/supabase/client";

const Browse = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [district, setDistrict] = useState("all");
  const [size, setSize] = useState("all");
  const [sortBy, setSortBy] = useState("recommended");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [plots, setPlots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlots();
  }, []);

  const fetchPlots = async () => {
    try {
      const { data, error } = await supabase
        .from("land_listings")
        .select("*")
        .eq("status", "active")
        .gt("available_area_sqft", 0);

      if (error) throw error;

      setPlots(data || []);
    } catch (error) {
      console.error("Error fetching plots:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFilter = (filter: string) => {
    setSelectedFilters(prev =>
      prev.includes(filter)
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  const filteredAndSortedPlots = useMemo(() => {
    let filtered = plots.filter(plot => {
      const matchesSearch = plot.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          plot.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDistrict = district === "all" || plot.location.toLowerCase().includes(district.toLowerCase());
      const matchesSize = size === "all" || 
        (size === "small" && plot.total_area_sqft < 500) ||
        (size === "medium" && plot.total_area_sqft >= 500 && plot.total_area_sqft <= 750) ||
        (size === "large" && plot.total_area_sqft > 750);
      const matchesFilters = selectedFilters.length === 0 || 
        selectedFilters.every(filter => {
          if (filter === "Offers Training") return plot.amenities?.includes("training");
          if (filter === "Water Access") return plot.water_access;
          if (filter === "Tool Shed") return plot.amenities?.includes("tool_shed");
          if (filter === "Fenced") return plot.amenities?.includes("fenced");
          return false;
        });

      return matchesSearch && matchesDistrict && matchesSize && matchesFilters;
    });

    if (sortBy === "price-low") {
      filtered.sort((a, b) => a.price_per_sqft_monthly - b.price_per_sqft_monthly);
    } else if (sortBy === "price-high") {
      filtered.sort((a, b) => b.price_per_sqft_monthly - a.price_per_sqft_monthly);
    } else if (sortBy === "size") {
      filtered.sort((a, b) => b.total_area_sqft - a.total_area_sqft);
    }

    return filtered;
  }, [plots, searchTerm, district, size, sortBy, selectedFilters]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Browse Available Plots</h1>
          <p className="text-muted-foreground text-lg">
            Find the perfect plot for your farming journey
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search by location or keyword..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              <Select value={district} onValueChange={setDistrict}>
                <SelectTrigger>
                  <SelectValue placeholder="District" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Districts</SelectItem>
                  <SelectItem value="medak">Medak</SelectItem>
                  <SelectItem value="nizamabad">Nizamabad</SelectItem>
                  <SelectItem value="ranga-reddy">Ranga Reddy</SelectItem>
                  <SelectItem value="karimnagar">Karimnagar</SelectItem>
                </SelectContent>
              </Select>

              <Select value={size} onValueChange={setSize}>
                <SelectTrigger>
                  <SelectValue placeholder="Size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sizes</SelectItem>
                  <SelectItem value="small">Under 500 sq ft</SelectItem>
                  <SelectItem value="medium">500-750 sq ft</SelectItem>
                  <SelectItem value="large">Over 750 sq ft</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              <Badge 
                variant={selectedFilters.includes("Water Access") ? "default" : "outline"} 
                className="cursor-pointer hover:bg-muted"
                onClick={() => toggleFilter("Water Access")}
              >
                <Droplets className="h-3 w-3 mr-1" />
                Water Access
              </Badge>
              <Badge 
                variant={selectedFilters.includes("Tool Shed") ? "default" : "outline"} 
                className="cursor-pointer hover:bg-muted"
                onClick={() => toggleFilter("Tool Shed")}
              >
                <Home className="h-3 w-3 mr-1" />
                Tool Shed
              </Badge>
              <Badge 
                variant={selectedFilters.includes("Fenced") ? "default" : "outline"} 
                className="cursor-pointer hover:bg-muted"
                onClick={() => toggleFilter("Fenced")}
              >
                <Shield className="h-3 w-3 mr-1" />
                Fenced
              </Badge>
              <Badge 
                variant={selectedFilters.includes("Offers Training") ? "default" : "outline"} 
                className="cursor-pointer hover:bg-muted"
                onClick={() => toggleFilter("Offers Training")}
              >
                Offers Training
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-muted-foreground">{filteredAndSortedPlots.length} plots available</p>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recommended">Recommended</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="size">Size</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Plot Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <p className="text-muted-foreground col-span-full text-center py-8">Loading plots...</p>
          ) : filteredAndSortedPlots.length === 0 ? (
            <p className="text-muted-foreground col-span-full text-center py-8">No plots found</p>
          ) : (
            filteredAndSortedPlots.map((plot) => {
              const amenitiesList = [];
              if (plot.water_access) amenitiesList.push("Water Access");
              if (plot.amenities?.includes("tool_shed")) amenitiesList.push("Tool Shed");
              if (plot.amenities?.includes("fenced")) amenitiesList.push("Fenced");
              if (plot.amenities?.includes("training")) amenitiesList.push("Training");

              const monthlyPrice = Math.round(plot.total_area_sqft * plot.price_per_sqft_monthly);

              return (
                <Card key={plot.id} className="group hover:shadow-lg transition-shadow overflow-hidden">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={plot.images?.[0] || farmPlots}
                      alt={plot.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <Badge className="absolute top-3 right-3 bg-secondary">
                      <Shield className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                    {plot.amenities?.includes("training") && (
                      <Badge className="absolute top-3 left-3 bg-primary">
                        Training Available
                      </Badge>
                    )}
                  </div>

                  <CardContent className="pt-4">
                    <h3 className="font-bold text-lg mb-2 line-clamp-1">{plot.title}</h3>
                    
                    <div className="flex items-center text-sm text-muted-foreground mb-3">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{plot.location}</span>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {amenitiesList.slice(0, 3).map((amenity, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {amenity}
                        </Badge>
                      ))}
                      {amenitiesList.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{amenitiesList.length - 3} more
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-end justify-between mb-4">
                      <div>
                        <div className="text-sm text-muted-foreground">Size</div>
                        <div className="font-bold">{plot.total_area_sqft} sq ft</div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">₹{monthlyPrice}</div>
                        <div className="text-xs text-muted-foreground">per month</div>
                      </div>
                    </div>

                    <Button className="w-full" onClick={() => navigate(`/plot-details?id=${plot.id}`)}>View Details</Button>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Browse;
