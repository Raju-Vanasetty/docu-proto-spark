import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const AddLandListing = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    totalArea: "",
    pricePerSqFt: "",
    soilType: "",
    description: "",
    waterAccess: false,
    toolShed: false,
    fenced: false,
    training: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Listing Created!",
      description: "Your land listing has been created successfully.",
    });
    navigate("/dashboard/farmer");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/dashboard/farmer")}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Add Land Listing</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="title">Property Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Organic Farm Plot - East Wing"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                />
              </div>

              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="e.g., Medak, Telangana"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="totalArea">Total Area (sq ft)</Label>
                  <Input
                    id="totalArea"
                    type="number"
                    placeholder="e.g., 2000"
                    value={formData.totalArea}
                    onChange={(e) => setFormData({...formData, totalArea: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="pricePerSqFt">Price per sq ft (monthly)</Label>
                  <Input
                    id="pricePerSqFt"
                    type="number"
                    placeholder="e.g., 24"
                    value={formData.pricePerSqFt}
                    onChange={(e) => setFormData({...formData, pricePerSqFt: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="soilType">Soil Type</Label>
                <Input
                  id="soilType"
                  placeholder="e.g., Red Soil, Black Soil"
                  value={formData.soilType}
                  onChange={(e) => setFormData({...formData, soilType: e.target.value})}
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your property..."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-3">
                <Label>Amenities</Label>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="waterAccess"
                    checked={formData.waterAccess}
                    onCheckedChange={(checked) => 
                      setFormData({...formData, waterAccess: checked as boolean})
                    }
                  />
                  <Label htmlFor="waterAccess" className="cursor-pointer">Water Access</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="toolShed"
                    checked={formData.toolShed}
                    onCheckedChange={(checked) => 
                      setFormData({...formData, toolShed: checked as boolean})
                    }
                  />
                  <Label htmlFor="toolShed" className="cursor-pointer">Tool Shed</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="fenced"
                    checked={formData.fenced}
                    onCheckedChange={(checked) => 
                      setFormData({...formData, fenced: checked as boolean})
                    }
                  />
                  <Label htmlFor="fenced" className="cursor-pointer">Fenced</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="training"
                    checked={formData.training}
                    onCheckedChange={(checked) => 
                      setFormData({...formData, training: checked as boolean})
                    }
                  />
                  <Label htmlFor="training" className="cursor-pointer">Offers Training</Label>
                </div>
              </div>

              <div className="flex gap-4">
                <Button type="button" variant="outline" onClick={() => navigate("/dashboard/farmer")} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  Create Listing
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AddLandListing;
