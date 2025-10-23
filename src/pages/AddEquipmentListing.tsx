import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const AddEquipmentListing = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("id");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    pricePerDay: "",
    location: "",
    condition: "",
    description: "",
  });

  useEffect(() => {
    if (editId) {
      fetchEquipment();
    }
  }, [editId]);

  const fetchEquipment = async () => {
    try {
      const { data, error } = await supabase
        .from("equipment_listings")
        .select("*")
        .eq("id", editId)
        .single();

      if (error) throw error;

      if (data) {
        setFormData({
          name: data.name,
          category: data.category,
          pricePerDay: data.price_per_day.toString(),
          location: data.location || "",
          condition: data.condition || "",
          description: data.description || "",
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
      const equipmentData = {
        name: formData.name,
        category: formData.category,
        price_per_day: parseFloat(formData.pricePerDay),
        location: formData.location,
        condition: formData.condition,
        description: formData.description,
        vendor_id: user.id,
      };

      if (editId) {
        const { error } = await supabase
          .from("equipment_listings")
          .update(equipmentData)
          .eq("id", editId);

        if (error) throw error;

        toast({
          title: "Equipment Updated!",
          description: "Your equipment listing has been updated successfully.",
        });
      } else {
        const { error } = await supabase
          .from("equipment_listings")
          .insert([equipmentData]);

        if (error) throw error;

        toast({
          title: "Equipment Added!",
          description: "Your equipment listing has been created successfully.",
        });
      }

      navigate("/dashboard/vendor");
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
          onClick={() => navigate("/dashboard/vendor")}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>{editId ? "Edit" : "Add"} Equipment</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name">Equipment Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Tiller Machine"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="heavy machinery">Heavy Machinery</SelectItem>
                    <SelectItem value="irrigation">Irrigation</SelectItem>
                    <SelectItem value="tools">Tools</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="pricePerDay">Rental Rate (per day)</Label>
                  <Input
                    id="pricePerDay"
                    type="number"
                    placeholder="e.g., 500"
                    value={formData.pricePerDay}
                    onChange={(e) => setFormData({...formData, pricePerDay: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="e.g., Punjab"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="condition">Condition</Label>
                <Select value={formData.condition} onValueChange={(value) => setFormData({...formData, condition: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="excellent">Excellent</SelectItem>
                    <SelectItem value="good">Good</SelectItem>
                    <SelectItem value="fair">Fair</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your equipment..."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={4}
                  required
                />
              </div>

              <div className="flex gap-4">
                <Button type="button" variant="outline" onClick={() => navigate("/dashboard/vendor")} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" className="flex-1" disabled={loading}>
                  {loading ? "Saving..." : editId ? "Update Equipment" : "Add Equipment"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AddEquipmentListing;
