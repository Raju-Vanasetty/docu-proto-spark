import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Droplet, Home, BookOpen, ArrowLeft } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";

const PlotDetails = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const plotId = searchParams.get("id");

  // Mock data - in real app, fetch based on plotId
  const plot = {
    id: plotId || "1",
    title: "Organic Farm Plot - East Wing",
    location: "Medak, Telangana",
    totalArea: 2000,
    availableArea: 750,
    pricePerSqFt: 24,
    soilType: "Red Soil",
    waterAccess: true,
    toolShed: true,
    fenced: true,
    training: true,
    description: "Premium farmland perfect for organic farming. Located in a peaceful area with excellent water access and facilities. Ideal for growing vegetables, herbs, and seasonal crops. The plot comes with a tool shed and is fully fenced for security.",
    owner: "Ramesh Sharma",
    images: ["🌾", "🌱", "💧"]
  };

  const handleLease = () => {
    navigate(`/payment?type=lease&id=${plot.id}&amount=${plot.pricePerSqFt * 500}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/browse")}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Browse
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <div className="h-64 bg-muted flex items-center justify-center text-8xl">
                {plot.images[0]}
              </div>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">{plot.title}</h1>
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-1" />
                      {plot.location}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-primary">₹{plot.pricePerSqFt}/sq ft</div>
                    <div className="text-sm text-muted-foreground">per month</div>
                  </div>
                </div>

                <div className="flex gap-2 mb-6">
                  {plot.waterAccess && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Droplet className="h-3 w-3" />
                      Water Access
                    </Badge>
                  )}
                  {plot.toolShed && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Home className="h-3 w-3" />
                      Tool Shed
                    </Badge>
                  )}
                  {plot.fenced && (
                    <Badge variant="secondary">Fenced</Badge>
                  )}
                  {plot.training && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <BookOpen className="h-3 w-3" />
                      Training
                    </Badge>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Description</h3>
                    <p className="text-muted-foreground">{plot.description}</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 pt-4 border-t">
                    <div>
                      <div className="text-sm text-muted-foreground">Total Area</div>
                      <div className="text-lg font-semibold">{plot.totalArea} sq ft</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Available Area</div>
                      <div className="text-lg font-semibold">{plot.availableArea} sq ft</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Soil Type</div>
                      <div className="text-lg font-semibold">{plot.soilType}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Owner</div>
                      <div className="text-lg font-semibold">{plot.owner}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="sticky top-4">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Lease this Plot</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-muted-foreground">Minimum Lease</label>
                    <p className="font-semibold">500 sq ft</p>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-muted-foreground">Price (500 sq ft)</span>
                      <span className="font-semibold">₹{plot.pricePerSqFt * 500}/month</span>
                    </div>
                  </div>
                  <Button className="w-full" size="lg" onClick={handleLease}>
                    Proceed to Lease
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    By proceeding, you agree to the terms and conditions
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PlotDetails;
