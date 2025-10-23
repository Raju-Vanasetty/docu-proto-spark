import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, TrendingUp, Plus } from "lucide-react";

const DashboardLandowner = () => {
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
              <div className="text-3xl font-bold">3</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Leases</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">5</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">₹65,000</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Earned</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">₹3,25,000</div>
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
              <Button size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Add Listing
              </Button>
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
                    <span className="text-muted-foreground">Size:</span> 2000 sq ft
                  </div>
                  <div>
                    <span className="text-muted-foreground">Leased:</span> 1250 sq ft
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <Button variant="outline" size="sm" className="flex-1">
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    View Details
                  </Button>
                </div>
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
                    <span className="text-muted-foreground">Size:</span> 3000 sq ft
                  </div>
                  <div>
                    <span className="text-muted-foreground">Leased:</span> 2250 sq ft
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <Button variant="outline" size="sm" className="flex-1">
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    View Details
                  </Button>
                </div>
              </div>
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
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-bold">Rajesh Kumar</h4>
                    <p className="text-sm text-muted-foreground">Organic Farm Plot - East</p>
                  </div>
                  <Badge>Active</Badge>
                </div>
                <div className="flex gap-4 text-sm mt-3">
                  <div>
                    <span className="text-muted-foreground">Area:</span> 500 sq ft
                  </div>
                  <div>
                    <span className="text-muted-foreground">Monthly:</span> ₹12,000
                  </div>
                </div>
                <div className="text-sm text-muted-foreground mt-2">
                  Expires: 4 months
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-bold">Priya Sharma</h4>
                    <p className="text-sm text-muted-foreground">Riverside Farming Land</p>
                  </div>
                  <Badge>Active</Badge>
                </div>
                <div className="flex gap-4 text-sm mt-3">
                  <div>
                    <span className="text-muted-foreground">Area:</span> 750 sq ft
                  </div>
                  <div>
                    <span className="text-muted-foreground">Monthly:</span> ₹18,000
                  </div>
                </div>
                <div className="text-sm text-muted-foreground mt-2">
                  Expires: 5 months
                </div>
              </div>
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
                  <div className="text-2xl font-bold text-primary">₹65,000</div>
                  <div className="text-xs text-muted-foreground mt-1">5 active leases</div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="text-sm text-muted-foreground mb-1">Last Month</div>
                  <div className="text-2xl font-bold">₹58,000</div>
                  <div className="text-xs text-muted-foreground mt-1">4 active leases</div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="text-sm text-muted-foreground mb-1">Total Earned</div>
                  <div className="text-2xl font-bold">₹3,25,000</div>
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