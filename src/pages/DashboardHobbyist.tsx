import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Tractor, ShoppingBag, Plus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const DashboardHobbyist = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [leases, setLeases] = useState<any[]>([]);
  const [rentals, setRentals] = useState<any[]>([]);
  const [produce, setProduce] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      // Fetch user's plot leases
      const { data: leasesData } = await supabase
        .from("plot_leases")
        .select(`
          *,
          land_listing:land_listings(title, location)
        `)
        .eq("user_id", user?.id)
        .eq("status", "active");

      // Fetch user's equipment rentals
      const { data: rentalsData } = await supabase
        .from("equipment_rentals")
        .select(`
          *,
          equipment:equipment_listings(name, price_per_day)
        `)
        .eq("user_id", user?.id);

      // Fetch user's produce listings
      const { data: produceData } = await supabase
        .from("produce_listings")
        .select("*")
        .eq("farmer_id", user?.id)
        .order("created_at", { ascending: false });

      setLeases(leasesData || []);
      setRentals(rentalsData || []);
      setProduce(produceData || []);
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
          <h1 className="text-4xl font-bold mb-2">Hobbyist Dashboard</h1>
          <p className="text-muted-foreground text-lg">Manage your leases, rentals, and produce listings</p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
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
              <CardTitle className="text-sm font-medium text-muted-foreground">Equipment Rentals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{rentals.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Produce Listings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{produce.filter(p => p.status === 'active').length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Spent</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">₹{(leases.reduce((sum, l) => sum + parseFloat(l.monthly_price), 0) + rentals.reduce((sum, r) => sum + parseFloat(r.total_price), 0)).toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* My Leases */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                My Leased Plots
              </CardTitle>
              <Link to="/browse">
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Browse More
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading ? (
                <p className="text-muted-foreground">Loading...</p>
              ) : leases.length === 0 ? (
                <p className="text-muted-foreground">No active leases yet. Browse plots to get started!</p>
              ) : (
                leases.map((lease) => (
                  <div key={lease.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-bold">{lease.land_listing?.title}</h4>
                        <p className="text-sm text-muted-foreground">{lease.land_listing?.location}</p>
                      </div>
                      <Badge variant="secondary">Active</Badge>
                    </div>
                    <div className="flex gap-4 text-sm mt-3">
                      <div>
                        <span className="text-muted-foreground">Size:</span> {lease.area_sqft} sq ft
                      </div>
                      <div>
                        <span className="text-muted-foreground">Expires:</span> {new Date(lease.end_date).toLocaleDateString()}
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full mt-3" 
                      size="sm"
                      onClick={() => navigate(`/plot-details?id=${lease.land_listing_id}&view=leased`)}
                    >
                      View Details
                    </Button>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Equipment Rentals */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Tractor className="h-5 w-5" />
                Equipment Rentals
              </CardTitle>
              <Link to="/equipment">
                <Button size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-1" />
                  Rent More
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-4">
              {rentals.length === 0 ? (
                <p className="text-muted-foreground">No equipment rentals yet.</p>
              ) : (
                rentals.slice(0, 2).map((rental) => (
                  <div key={rental.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-bold">{rental.equipment?.name}</h4>
                        <p className="text-sm text-muted-foreground">Rental</p>
                      </div>
                      <Badge variant={rental.status === 'active' ? 'default' : 'secondary'}>
                        {rental.status}
                      </Badge>
                    </div>
                    <div className="flex gap-4 text-sm mt-3">
                      <div>
                        <Calendar className="h-3 w-3 inline mr-1" />
                        <span className="text-muted-foreground">Return:</span> {new Date(rental.end_date).toLocaleDateString()}
                      </div>
                      <div>
                        <span className="text-muted-foreground">₹{rental.equipment?.price_per_day}/day</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* My Produce Listings */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" />
                My Produce Listings
              </CardTitle>
              <Button size="sm" onClick={() => navigate("/add-produce-listing")}>
                <Plus className="h-4 w-4 mr-1" />
                Add Listing
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                {produce.length === 0 ? (
                  <p className="text-muted-foreground col-span-3">No produce listings yet. Add your first one!</p>
                ) : (
                  produce.map((item) => (
                    <div key={item.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-bold">{item.name}</h4>
                          <p className="text-2xl font-bold text-primary mt-1">₹{item.price_per_unit}/{item.unit}</p>
                        </div>
                        <Badge variant={item.status === 'active' ? 'secondary' : 'default'}>
                          {item.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Available: {item.quantity_available} {item.unit}
                      </p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={() => navigate(`/add-produce-listing?id=${item.id}`)}
                      >
                        {item.status === 'active' ? 'Edit Listing' : 'Relist'}
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardHobbyist;