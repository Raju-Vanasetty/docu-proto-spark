import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { MapPin, Search, Droplets, Home, Shield, Star } from "lucide-react";
import farmPlots from "@/assets/farm-plots.jpg";

const Browse = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data for demonstration
  const plots = [
    {
      id: 1,
      title: "Organic Farm Plot - East District",
      location: "Medak, Telangana",
      size: "500 sq ft",
      price: "₹12,000",
      term: "6 months",
      amenities: ["Water Access", "Fenced", "Organic", "Tool Shed"],
      rating: 4.8,
      reviews: 24,
      image: farmPlots,
      verified: true,
      training: true,
    },
    {
      id: 2,
      title: "Riverside Farming Land",
      location: "Nizamabad, Telangana",
      size: "750 sq ft",
      price: "₹18,000",
      term: "6 months",
      amenities: ["Water Access", "Organic", "Irrigation"],
      rating: 4.9,
      reviews: 31,
      image: farmPlots,
      verified: true,
      training: true,
    },
    {
      id: 3,
      title: "Community Garden Plot",
      location: "Ranga Reddy, Telangana",
      size: "400 sq ft",
      price: "₹10,000",
      term: "6 months",
      amenities: ["Water Access", "Tool Shed", "Fenced"],
      rating: 4.7,
      reviews: 18,
      image: farmPlots,
      verified: true,
      training: false,
    },
    {
      id: 4,
      title: "Hilltop Farm Plot",
      location: "Karimnagar, Telangana",
      size: "600 sq ft",
      price: "₹15,000",
      term: "6 months",
      amenities: ["Water Access", "Organic", "Fenced", "Tool Shed"],
      rating: 4.6,
      reviews: 15,
      image: farmPlots,
      verified: true,
      training: true,
    },
  ];

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
              
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="District" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="medak">Medak</SelectItem>
                  <SelectItem value="nizamabad">Nizamabad</SelectItem>
                  <SelectItem value="ranga-reddy">Ranga Reddy</SelectItem>
                  <SelectItem value="karimnagar">Karimnagar</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Under 500 sq ft</SelectItem>
                  <SelectItem value="medium">500-750 sq ft</SelectItem>
                  <SelectItem value="large">Over 750 sq ft</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              <Badge variant="outline" className="cursor-pointer hover:bg-muted">
                <Droplets className="h-3 w-3 mr-1" />
                Water Access
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-muted">
                <Home className="h-3 w-3 mr-1" />
                Tool Shed
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-muted">
                <Shield className="h-3 w-3 mr-1" />
                Fenced
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-muted">
                Offers Training
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-muted-foreground">{plots.length} plots available</p>
          <Select defaultValue="recommended">
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
          {plots.map((plot) => (
            <Card key={plot.id} className="group hover:shadow-lg transition-shadow overflow-hidden">
              <div className="relative h-48 overflow-hidden">
                <img
                  src={plot.image}
                  alt={plot.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {plot.verified && (
                  <Badge className="absolute top-3 right-3 bg-secondary">
                    <Shield className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                )}
                {plot.training && (
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

                <div className="flex items-center gap-1 mb-3">
                  <Star className="h-4 w-4 fill-secondary text-secondary" />
                  <span className="font-medium">{plot.rating}</span>
                  <span className="text-sm text-muted-foreground">({plot.reviews} reviews)</span>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {plot.amenities.slice(0, 3).map((amenity, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {amenity}
                    </Badge>
                  ))}
                  {plot.amenities.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{plot.amenities.length - 3} more
                    </Badge>
                  )}
                </div>

                <div className="flex items-end justify-between mb-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Size</div>
                    <div className="font-bold">{plot.size}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">{plot.price}</div>
                    <div className="text-xs text-muted-foreground">for {plot.term}</div>
                  </div>
                </div>

                <Button className="w-full">View Details</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Browse;
