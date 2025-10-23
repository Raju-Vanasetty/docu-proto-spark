import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const AddLandListing = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("id");
  const [loading, setLoading] = useState(false);
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

  useEffect(() => {
    if (editId) {
      fetchListing();
    }
  }, [editId]);

  const fetchListing = async () => {
    try {
      const { data, error } = await supabase
        .from("land_listings")
        .select("*")
        .eq("id", editId)
        .single();

      if (error) throw error;

      if (data) {
        const amenities = data.amenities || [];
        setFormData({
          title: data.title,
          location: data.location,
          totalArea: data.total_area_sqft.toString(),
          pricePerSqFt: data.price_per_sqft_monthly.toString(),
          soilType: data.soil_type || "",
          description: data.description || "",
          waterAccess: data.water_access || false,
          toolShed: amenities.includes("tool_shed"),
          fenced: amenities.includes("fenced"),
          training: amenities.includes("training"),
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const amenities = [];
      if (formData.toolShed) amenities.push("tool_shed");
      if (formData.fenced) amenities.push("fenced");
      if (formData.training) amenities.push("training");

      const listingData = {
        title: formData.title,
        location: formData.location,
        total_area_sqft: parseFloat(formData.totalArea),
        available_area_sqft: editId ? undefined : parseFloat(formData.totalArea),
        price_per_sqft_monthly: parseFloat(formData.pricePerSqFt),
        soil_type: formData.soilType,
        description: formData.description,
        water_access: formData.waterAccess,
        amenities,
        farmer_id: user.id,
      };

      if (editId) {
        const { error } = await supabase
          .from("land_listings")
          .update(listingData)
          .eq("id", editId);

        if (error) throw error;

        toast({
          title: "Listing Updated!",
          description: "Your land listing has been updated successfully.",
        });
      } else {
        const { error } = await supabase
          .from("land_listings")
          .insert([listingData]);

        if (error) throw error;

        toast({
          title: "Listing Created!",
          description: "Your land listing has been created successfully.",
        });
      }

      navigate("/dashboard/farmer");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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
            <CardTitle>{editId ? "Edit" : "Add"} Land Listing</CardTitle>
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
                <Button type="submit" className="flex-1" disabled={loading}>
                  {loading ? "Saving..." : editId ? "Update Listing" : "Create Listing"}
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
