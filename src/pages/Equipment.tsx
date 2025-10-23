import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Tractor, Hammer, Droplet } from "lucide-react";
import { useState, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";

const Equipment = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const { toast } = useToast();

  const equipmentList = [
    {
      id: 1,
      name: "John Deere Tractor",
      category: "Heavy Machinery",
      price: "₹2,500/day",
      location: "Punjab",
      image: "🚜",
      available: true,
    },
    {
      id: 2,
      name: "Irrigation Pump",
      category: "Irrigation",
      price: "₹800/day",
      location: "Haryana",
      image: "💧",
      available: true,
    },
    {
      id: 3,
      name: "Harvester Machine",
      category: "Heavy Machinery",
      price: "₹3,500/day",
      location: "Maharashtra",
      image: "🌾",
      available: false,
    },
  ];

  const filteredEquipment = useMemo(() => {
    return equipmentList.filter(equipment => {
      const matchesSearch = equipment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          equipment.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !category || category === "all" || equipment.category.toLowerCase() === category;
      const matchesLocation = !location || location === "all" || equipment.location.toLowerCase() === location;

      return matchesSearch && matchesCategory && matchesLocation;
    });
  }, [searchTerm, category, location]);

  const handleRentNow = (equipmentName: string) => {
    toast({
      title: "Rent Equipment",
      description: `Rental request for ${equipmentName} submitted successfully!`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Equipment Rental</h1>
          <p className="text-muted-foreground">Rent farming equipment from verified vendors</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search equipment..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Categories</SelectItem>
              <SelectItem value="heavy machinery">Heavy Machinery</SelectItem>
              <SelectItem value="irrigation">Irrigation</SelectItem>
              <SelectItem value="tools">Tools</SelectItem>
            </SelectContent>
          </Select>
          <Select value={location} onValueChange={setLocation}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Locations</SelectItem>
              <SelectItem value="punjab">Punjab</SelectItem>
              <SelectItem value="haryana">Haryana</SelectItem>
              <SelectItem value="maharashtra">Maharashtra</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEquipment.map((equipment) => (
            <Card key={equipment.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 bg-muted flex items-center justify-center text-6xl">
                {equipment.image}
              </div>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{equipment.name}</CardTitle>
                    <CardDescription>{equipment.category}</CardDescription>
                  </div>
                  {equipment.available ? (
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">Available</span>
                  ) : (
                    <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">Rented</span>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Location</span>
                    <span className="font-medium">{equipment.location}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Rental Rate</span>
                    <span className="font-bold text-primary">{equipment.price}</span>
                  </div>
                  <Button 
                    className="w-full" 
                    disabled={!equipment.available}
                    onClick={() => handleRentNow(equipment.name)}
                  >
                    {equipment.available ? "Rent Now" : "Not Available"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Equipment;
