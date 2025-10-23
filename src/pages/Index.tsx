import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import { MapPin, Users, Tractor, ShoppingBag, CheckCircle, Shield, Sprout } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import heroImage from "@/assets/hero-farm.jpg";
import farmingHands from "@/assets/farming-hands.jpg";
import farmPlots from "@/assets/farm-plots.jpg";
import equipment from "@/assets/equipment.jpg";

const Index = () => {
  const [stats, setStats] = useState({
    activeListings: 0,
    verifiedFarmers: 0,
    availablePlots: 0,
    equipmentItems: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const [produceCount, profilesCount, landCount, equipmentCount] = await Promise.all([
        supabase.from('produce_listings').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('land_listings').select('*', { count: 'exact', head: true }),
        supabase.from('equipment_listings').select('*', { count: 'exact', head: true }),
      ]);

      setStats({
        activeListings: produceCount.count || 0,
        verifiedFarmers: profilesCount.count || 0,
        availablePlots: landCount.count || 0,
        equipmentItems: equipmentCount.count || 0,
      });
    };

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70" />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 text-center text-primary-foreground">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Connect, Cultivate, Community
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto opacity-95">
            Lease land, grow your dreams, and join a thriving local farming community
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" variant="secondary" className="text-lg px-8">
                Start Farming Today
              </Button>
            </Link>
            <Link to="/browse">
              <Button size="lg" variant="outline" className="text-lg px-8 bg-white/10 border-white/30 hover:bg-white/20">
                Browse Plots
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How FarmShare Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A complete ecosystem connecting landowners, hobbyist farmers, and local vendors
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardContent className="pt-8 pb-6 text-center">
                <div className="mb-6 flex justify-center">
                  <div className="p-4 bg-secondary/10 rounded-full">
                    <MapPin className="h-10 w-10 text-secondary" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-3">Find Your Plot</h3>
                <p className="text-muted-foreground">
                  Browse verified land listings with detailed information, photos, and amenities. Filter by location, size, and price.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardContent className="pt-8 pb-6 text-center">
                <div className="mb-6 flex justify-center">
                  <div className="p-4 bg-accent/10 rounded-full">
                    <Users className="h-10 w-10 text-accent" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-3">Get Expert Training</h3>
                <p className="text-muted-foreground">
                  Add optional farmer-led training to your lease. Learn from experienced landowners who know the soil.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardContent className="pt-8 pb-6 text-center">
                <div className="mb-6 flex justify-center">
                  <div className="p-4 bg-primary/10 rounded-full">
                    <Tractor className="h-10 w-10 text-primary" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-3">Rent Equipment</h3>
                <p className="text-muted-foreground">
                  Access quality farming tools and equipment from local vendors. No need to buy expensive tools.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Role-Based Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Join Our Community</h2>
            <p className="text-xl text-muted-foreground">
              Whether you have land, want to farm, or rent equipment
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="group">
              <div className="relative h-64 mb-6 rounded-lg overflow-hidden">
                <img 
                  src={farmingHands} 
                  alt="Hobbyist Farmer" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent" />
                <div className="absolute bottom-4 left-4 text-primary-foreground">
                  <h3 className="text-2xl font-bold">Hobbyist Farmers</h3>
                </div>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-secondary mt-0.5 flex-shrink-0" />
                  <span>Lease verified plots near you</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-secondary mt-0.5 flex-shrink-0" />
                  <span>Get expert training from landowners</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-secondary mt-0.5 flex-shrink-0" />
                  <span>Sell your harvest locally</span>
                </li>
              </ul>
            </div>

            <div className="group">
              <div className="relative h-64 mb-6 rounded-lg overflow-hidden">
                <img 
                  src={farmPlots} 
                  alt="Landowner" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent" />
                <div className="absolute bottom-4 left-4 text-primary-foreground">
                  <h3 className="text-2xl font-bold">Landowners</h3>
                </div>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-secondary mt-0.5 flex-shrink-0" />
                  <span>List your land easily</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-secondary mt-0.5 flex-shrink-0" />
                  <span>Earn from unused plots</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-secondary mt-0.5 flex-shrink-0" />
                  <span>Offer training services</span>
                </li>
              </ul>
            </div>

            <div className="group">
              <div className="relative h-64 mb-6 rounded-lg overflow-hidden">
                <img 
                  src={equipment} 
                  alt="Equipment Vendor" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent" />
                <div className="absolute bottom-4 left-4 text-primary-foreground">
                  <h3 className="text-2xl font-bold">Equipment Vendors</h3>
                </div>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-secondary mt-0.5 flex-shrink-0" />
                  <span>List your rental equipment</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-secondary mt-0.5 flex-shrink-0" />
                  <span>Reach local farmers</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-secondary mt-0.5 flex-shrink-0" />
                  <span>Manage bookings easily</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Safety */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1">
              <Shield className="h-16 w-16 text-secondary mb-6" />
              <h2 className="text-4xl font-bold mb-6">Built on Trust</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Every landowner is verified with documentation. All plots are GPS-validated and confirmed on maps. We ensure a safe, transparent platform for everyone.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-secondary" />
                  <span className="font-medium">Document verification required</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-secondary" />
                  <span className="font-medium">GPS-validated locations</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-secondary" />
                  <span className="font-medium">Secure payments</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-secondary" />
                  <span className="font-medium">Community ratings</span>
                </li>
              </ul>
            </div>
            <div className="flex-1">
              <Card className="p-8">
                <div className="text-center mb-6">
                  <ShoppingBag className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Local Produce Marketplace</h3>
                  <p className="text-muted-foreground">
                    Sell your harvest directly to the community with buyer-pickup
                  </p>
                </div>
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Active Listings</span>
                    <span className="font-bold">{stats.activeListings}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Verified Farmers</span>
                    <span className="font-bold">{stats.verifiedFarmers}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Available Plots</span>
                    <span className="font-bold">{stats.availablePlots}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-muted-foreground">Equipment Items</span>
                    <span className="font-bold">{stats.equipmentItems}</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary to-secondary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Start Your Farming Journey?
          </h2>
          <p className="text-xl mb-8 opacity-95 max-w-2xl mx-auto">
            Join thousands of farmers, landowners, and vendors in our growing community
          </p>
          <Link to="/register">
            <Button size="lg" variant="secondary" className="text-lg px-12">
              Create Free Account
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 font-bold text-xl text-primary mb-4">
                <Sprout className="h-6 w-6" />
                <span>FarmShare</span>
              </div>
              <p className="text-muted-foreground text-sm">
                Connecting communities through sustainable agriculture
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">For Users</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/browse" className="hover:text-foreground">Browse Plots</Link></li>
                <li><Link to="/equipment" className="hover:text-foreground">Rent Equipment</Link></li>
                <li><Link to="/marketplace" className="hover:text-foreground">Buy Produce</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">For Landowners</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/register" className="hover:text-foreground">List Your Land</Link></li>
                <li><a href="#" className="hover:text-foreground">Verification Process</a></li>
                <li><a href="#" className="hover:text-foreground">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Help Center</a></li>
                <li><a href="#" className="hover:text-foreground">Contact Us</a></li>
                <li><a href="#" className="hover:text-foreground">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 FarmShare. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
