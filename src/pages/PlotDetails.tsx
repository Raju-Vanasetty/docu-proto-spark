import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Droplet, Home, BookOpen, ArrowLeft } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const PlotDetails = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const plotId = searchParams.get("id");
  const viewMode = searchParams.get("view"); // 'leased' if viewing own lease
  const [plot, setPlot] = useState<any>(null);
  const [isLeased, setIsLeased] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (plotId) {
      fetchPlot();
    }
  }, [plotId, user]);

  const fetchPlot = async () => {
    try {
      const { data: plotData, error } = await supabase
        .from("land_listings")
        .select(`
          *,
          farmer:profiles!farmer_id(full_name)
        `)
        .eq("id", plotId)
        .single();

      if (error) throw error;

      setPlot(plotData);

      // Check if current user already leased this plot
      if (user) {
        const { data: leaseData } = await supabase
          .from("plot_leases")
          .select("id")
          .eq("land_listing_id", plotId)
          .eq("user_id", user.id)
          .eq("status", "active")
          .single();

        setIsLeased(!!leaseData);
      }
    } catch (error: any) {
      console.error("Error fetching plot:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLease = () => {
    if (!plot) return;
    navigate(`/payment?type=lease&id=${plot.id}&amount=${plot.price_per_sqft_monthly * 500}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <p>Loading...</p>
        </main>
      </div>
    );
  }

  if (!plot) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <p>Plot not found</p>
          <Button onClick={() => navigate("/browse")} className="mt-4">
            Back to Browse
          </Button>
        </main>
      </div>
    );
  }

  const amenities = plot.amenities || [];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate(viewMode === 'leased' ? "/dashboard/user" : "/browse")}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {viewMode === 'leased' ? 'Back to Dashboard' : 'Back to Browse'}
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <div className="h-64 bg-muted flex items-center justify-center text-8xl">
                🌾
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
                    <div className="text-3xl font-bold text-primary">₹{plot.price_per_sqft_monthly}/sq ft</div>
                    <div className="text-sm text-muted-foreground">per month</div>
                  </div>
                </div>

                <div className="flex gap-2 mb-6">
                  {plot.water_access && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Droplet className="h-3 w-3" />
                      Water Access
                    </Badge>
                  )}
                  {amenities.includes('tool_shed') && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Home className="h-3 w-3" />
                      Tool Shed
                    </Badge>
                  )}
                  {amenities.includes('fenced') && (
                    <Badge variant="secondary">Fenced</Badge>
                  )}
                  {amenities.includes('training') && (
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
                      <div className="text-lg font-semibold">{plot.total_area_sqft} sq ft</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Available Area</div>
                      <div className="text-lg font-semibold">{plot.available_area_sqft} sq ft</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Soil Type</div>
                      <div className="text-lg font-semibold">{plot.soil_type}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Owner</div>
                      <div className="text-lg font-semibold">{plot.farmer?.full_name || 'Unknown'}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            {!isLeased && viewMode !== 'leased' && (
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
                        <span className="font-semibold">₹{plot.price_per_sqft_monthly * 500}/month</span>
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
            )}
            {isLeased && (
              <Card className="sticky top-4">
                <CardContent className="p-6">
                  <Badge className="mb-4">Already Leased</Badge>
                  <p className="text-muted-foreground">You already have an active lease for this plot.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default PlotDetails;
