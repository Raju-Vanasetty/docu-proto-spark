import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tractor, Package, TrendingUp, Plus, Calendar } from "lucide-react";

const DashboardVendor = () => {
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
              <div className="text-3xl font-bold">8</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Rentals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">4</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">₹45,000</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Earned</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">₹2,15,000</div>
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
              <Button size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Add Equipment
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-bold">Tiller Machine</h4>
                    <p className="text-sm text-muted-foreground">Heavy Machinery</p>
                  </div>
                  <Badge>Rented</Badge>
                </div>
                <div className="flex gap-4 text-sm mt-3">
                  <div>
                    <span className="text-muted-foreground">Rate:</span> ₹500/day
                  </div>
                  <div>
                    <span className="text-muted-foreground">Return:</span> 2 days
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
                    <h4 className="font-bold">Irrigation Pump</h4>
                    <p className="text-sm text-muted-foreground">Irrigation</p>
                  </div>
                  <Badge variant="secondary">Available</Badge>
                </div>
                <div className="flex gap-4 text-sm mt-3">
                  <div>
                    <span className="text-muted-foreground">Rate:</span> ₹300/day
                  </div>
                  <div>
                    <span className="text-muted-foreground">Status:</span> Ready
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
                    <h4 className="font-bold">Harvester</h4>
                    <p className="text-sm text-muted-foreground">Heavy Machinery</p>
                  </div>
                  <Badge>Rented</Badge>
                </div>
                <div className="flex gap-4 text-sm mt-3">
                  <div>
                    <span className="text-muted-foreground">Rate:</span> ₹1,200/day
                  </div>
                  <div>
                    <span className="text-muted-foreground">Return:</span> 5 days
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

          {/* Active Rentals */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tractor className="h-5 w-5" />
                Active Rentals
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-bold">Rajesh Kumar</h4>
                    <p className="text-sm text-muted-foreground">Tiller Machine</p>
                  </div>
                  <Badge>Active</Badge>
                </div>
                <div className="flex gap-4 text-sm mt-3">
                  <div>
                    <Calendar className="h-3 w-3 inline mr-1" />
                    <span className="text-muted-foreground">Started:</span> 3 days ago
                  </div>
                </div>
                <div className="flex gap-4 text-sm mt-2">
                  <div>
                    <span className="text-muted-foreground">Return:</span> 2 days
                  </div>
                  <div>
                    <span className="text-muted-foreground">Total:</span> ₹2,500
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-bold">Priya Sharma</h4>
                    <p className="text-sm text-muted-foreground">Harvester</p>
                  </div>
                  <Badge>Active</Badge>
                </div>
                <div className="flex gap-4 text-sm mt-3">
                  <div>
                    <Calendar className="h-3 w-3 inline mr-1" />
                    <span className="text-muted-foreground">Started:</span> 1 day ago
                  </div>
                </div>
                <div className="flex gap-4 text-sm mt-2">
                  <div>
                    <span className="text-muted-foreground">Return:</span> 5 days
                  </div>
                  <div>
                    <span className="text-muted-foreground">Total:</span> ₹7,200
                  </div>
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