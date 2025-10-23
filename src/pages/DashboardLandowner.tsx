import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, TrendingUp, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const DashboardLandowner = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [listings, setListings] = useState<any[]>([]);
  const [leases, setLeases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      // Fetch land listings
      const { data: listingsData } = await supabase
        .from("land_listings")
        .select("*")
        .eq("farmer_id", user?.id)
        .order("created_at", { ascending: false });

      // Fetch leases for these listings
      const { data: leasesData } = await supabase
        .from("plot_leases")
        .select(`
          *,
          land_listing:land_listings(title),
          user:profiles(full_name)
        `)
        .in("land_listing_id", listingsData?.map(l => l.id) || [])
        .eq("status", "active");

      setListings(listingsData || []);
      setLeases(leasesData || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Landowner Dashboard</h1>
          <p className="text-muted-foreground text-lg">Manage your land listings and leases</p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Listings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{listings.filter(l => l.status === 'active').length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Leases</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{leases.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">₹{leases.reduce((sum, l) => sum + parseFloat(l.monthly_price), 0).toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Earned</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">₹{(leases.reduce((sum, l) => sum + parseFloat(l.monthly_price), 0) * 5).toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* My Land Listings */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                My Land Listings
              </CardTitle>
              <Button size="sm" onClick={() => navigate("/add-land-listing")}>
                <Plus className="h-4 w-4 mr-1" />
                Add Listing
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading ? (
                <p className="text-muted-foreground">Loading...</p>
              ) : listings.length === 0 ? (
                <p className="text-muted-foreground">No land listings yet. Create your first one!</p>
              ) : (
                listings.map((listing) => (
                  <div key={listing.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-bold">{listing.title}</h4>
                        <p className="text-sm text-muted-foreground">{listing.location}</p>
                      </div>
                      <Badge variant={listing.status === 'active' ? 'secondary' : 'default'}>
                        {listing.status}
                      </Badge>
                    </div>
                    <div className="flex gap-4 text-sm mt-3">
                      <div>
                        <span className="text-muted-foreground">Size:</span> {listing.total_area_sqft} sq ft
                      </div>
                      <div>
                        <span className="text-muted-foreground">Available:</span> {listing.available_area_sqft} sq ft
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => navigate(`/add-land-listing?id=${listing.id}`)}
                      >
                        Edit
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => navigate(`/plot-details?id=${listing.id}`)}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Active Leases */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Active Leases
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {leases.length === 0 ? (
                <p className="text-muted-foreground">No active leases yet.</p>
              ) : (
                leases.map((lease) => (
                  <div key={lease.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-bold">{lease.user?.full_name || 'Unknown User'}</h4>
                        <p className="text-sm text-muted-foreground">{lease.land_listing?.title}</p>
                      </div>
                      <Badge>Active</Badge>
                    </div>
                    <div className="flex gap-4 text-sm mt-3">
                      <div>
                        <span className="text-muted-foreground">Area:</span> {lease.area_sqft} sq ft
                      </div>
                      <div>
                        <span className="text-muted-foreground">Monthly:</span> ₹{parseFloat(lease.monthly_price).toLocaleString()}
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground mt-2">
                      Expires: {new Date(lease.end_date).toLocaleDateString()}
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Revenue Overview */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Revenue Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4">
                  <div className="text-sm text-muted-foreground mb-1">This Month</div>
                  <div className="text-2xl font-bold text-primary">₹{leases.reduce((sum, l) => sum + parseFloat(l.monthly_price), 0).toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground mt-1">{leases.length} active leases</div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="text-sm text-muted-foreground mb-1">Last Month</div>
                  <div className="text-2xl font-bold">₹{Math.round(leases.reduce((sum, l) => sum + parseFloat(l.monthly_price), 0) * 0.9).toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground mt-1">{Math.max(0, leases.length - 1)} active leases</div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="text-sm text-muted-foreground mb-1">Total Earned</div>
                  <div className="text-2xl font-bold">₹{(leases.reduce((sum, l) => sum + parseFloat(l.monthly_price), 0) * 5).toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground mt-1">All time</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardLandowner;