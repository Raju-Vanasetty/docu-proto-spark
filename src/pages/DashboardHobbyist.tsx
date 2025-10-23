import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Tractor, ShoppingBag, Plus } from "lucide-react";
import { Link } from "react-router-dom";

const DashboardHobbyist = () => {
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
              <div className="text-3xl font-bold">2</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Equipment Rentals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">3</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Produce Listings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">5</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Spent</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">₹42,000</div>
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
              <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-bold">Organic Farm Plot - East</h4>
                    <p className="text-sm text-muted-foreground">Medak, Telangana</p>
                  </div>
                  <Badge variant="secondary">Active</Badge>
                </div>
                <div className="flex gap-4 text-sm mt-3">
                  <div>
                    <span className="text-muted-foreground">Size:</span> 500 sq ft
                  </div>
                  <div>
                    <span className="text-muted-foreground">Expires:</span> 4 months
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-3" size="sm">
                  View Details
                </Button>
              </div>

              <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-bold">Riverside Farming Land</h4>
                    <p className="text-sm text-muted-foreground">Nizamabad, Telangana</p>
                  </div>
                  <Badge variant="secondary">Active</Badge>
                </div>
                <div className="flex gap-4 text-sm mt-3">
                  <div>
                    <span className="text-muted-foreground">Size:</span> 750 sq ft
                  </div>
                  <div>
                    <span className="text-muted-foreground">Expires:</span> 5 months
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-3" size="sm">
                  View Details
                </Button>
              </div>
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
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-bold">Tiller Machine</h4>
                    <p className="text-sm text-muted-foreground">Green Tools Vendor</p>
                  </div>
                  <Badge>In Use</Badge>
                </div>
                <div className="flex gap-4 text-sm mt-3">
                  <div>
                    <Calendar className="h-3 w-3 inline mr-1" />
                    <span className="text-muted-foreground">Return:</span> 2 days
                  </div>
                  <div>
                    <span className="text-muted-foreground">₹500/day</span>
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-bold">Irrigation Pump</h4>
                    <p className="text-sm text-muted-foreground">Farm Equipment Co.</p>
                  </div>
                  <Badge variant="secondary">Returned</Badge>
                </div>
                <div className="flex gap-4 text-sm mt-3">
                  <div>
                    <span className="text-muted-foreground">Used:</span> 5 days
                  </div>
                  <div>
                    <span className="text-muted-foreground">₹300/day</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* My Produce Listings */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" />
                My Produce Listings
              </CardTitle>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Add Listing
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-bold">Organic Tomatoes</h4>
                      <p className="text-2xl font-bold text-primary mt-1">₹80/kg</p>
                    </div>
                    <Badge variant="secondary">Active</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">Available: 25 kg</p>
                  <Button variant="outline" size="sm" className="w-full">
                    Edit Listing
                  </Button>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-bold">Fresh Spinach</h4>
                      <p className="text-2xl font-bold text-primary mt-1">₹60/kg</p>
                    </div>
                    <Badge variant="secondary">Active</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">Available: 15 kg</p>
                  <Button variant="outline" size="sm" className="w-full">
                    Edit Listing
                  </Button>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-bold">Carrots</h4>
                      <p className="text-2xl font-bold text-primary mt-1">₹50/kg</p>
                    </div>
                    <Badge>Sold Out</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">Sold: 30 kg</p>
                  <Button variant="outline" size="sm" className="w-full">
                    Relist
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardHobbyist;