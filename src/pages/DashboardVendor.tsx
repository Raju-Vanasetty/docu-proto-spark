import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tractor, Package, TrendingUp, Plus, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const DashboardVendor = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [equipment, setEquipment] = useState<any[]>([]);
  const [rentals, setRentals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      // Fetch equipment listings
      const { data: equipmentData } = await supabase
        .from("equipment_listings")
        .select("*")
        .eq("vendor_id", user?.id)
        .order("created_at", { ascending: false });

      // Fetch rentals for these equipment
      const { data: rentalsData } = await supabase
        .from("equipment_rentals")
        .select(`
          *,
          equipment:equipment_listings(name),
          user:profiles(full_name)
        `)
        .in("equipment_id", equipmentData?.map(e => e.id) || [])
        .eq("status", "active");

      setEquipment(equipmentData || []);
      setRentals(rentalsData || []);
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
          <h1 className="text-4xl font-bold mb-2">Vendor Dashboard</h1>
          <p className="text-muted-foreground text-lg">Manage your equipment listings and rentals</p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Equipment Listed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{equipment.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Rentals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{rentals.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">₹{rentals.reduce((sum, r) => sum + parseFloat(r.total_price), 0).toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Earned</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">₹{(rentals.reduce((sum, r) => sum + parseFloat(r.total_price), 0) * 5).toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* My Equipment */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                My Equipment
              </CardTitle>
              <Button size="sm" onClick={() => navigate("/add-equipment-listing")}>
                <Plus className="h-4 w-4 mr-1" />
                Add Equipment
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading ? (
                <p className="text-muted-foreground">Loading...</p>
              ) : equipment.length === 0 ? (
                <p className="text-muted-foreground">No equipment listed yet. Add your first one!</p>
              ) : (
                equipment.map((item) => (
                  <div key={item.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-bold">{item.name}</h4>
                        <p className="text-sm text-muted-foreground">{item.category}</p>
                      </div>
                      <Badge variant={item.availability_status === 'available' ? 'secondary' : 'default'}>
                        {item.availability_status}
                      </Badge>
                    </div>
                    <div className="flex gap-4 text-sm mt-3">
                      <div>
                        <span className="text-muted-foreground">Rate:</span> ₹{item.price_per_day}/day
                      </div>
                      <div>
                        <span className="text-muted-foreground">Condition:</span> {item.condition}
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => navigate(`/add-equipment-listing?id=${item.id}`)}
                      >
                        Edit
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => navigate(`/add-equipment-listing?id=${item.id}`)}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Active Rentals */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tractor className="h-5 w-5" />
                Active Rentals
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {rentals.length === 0 ? (
                <p className="text-muted-foreground">No active rentals yet.</p>
              ) : (
                rentals.map((rental) => (
                  <div key={rental.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-bold">{rental.user?.full_name || 'Unknown User'}</h4>
                        <p className="text-sm text-muted-foreground">{rental.equipment?.name}</p>
                      </div>
                      <Badge>Active</Badge>
                    </div>
                    <div className="flex gap-4 text-sm mt-3">
                      <div>
                        <Calendar className="h-3 w-3 inline mr-1" />
                        <span className="text-muted-foreground">Started:</span> {new Date(rental.start_date).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex gap-4 text-sm mt-2">
                      <div>
                        <span className="text-muted-foreground">Return:</span> {new Date(rental.end_date).toLocaleDateString()}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Total:</span> ₹{parseFloat(rental.total_price).toLocaleString()}
                      </div>
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
                  <div className="text-2xl font-bold text-primary">₹45,000</div>
                  <div className="text-xs text-muted-foreground mt-1">4 active rentals</div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="text-sm text-muted-foreground mb-1">Last Month</div>
                  <div className="text-2xl font-bold">₹38,000</div>
                  <div className="text-xs text-muted-foreground mt-1">3 active rentals</div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="text-sm text-muted-foreground mb-1">Total Earned</div>
                  <div className="text-2xl font-bold">₹2,15,000</div>
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

export default DashboardVendor;