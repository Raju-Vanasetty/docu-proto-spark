import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const AddProduceListing = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("id");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    unit: "kg",
    quantity: "",
    organic: false,
    description: "",
  });

  useEffect(() => {
    if (editId) {
      fetchProduce();
    }
  }, [editId]);

  const fetchProduce = async () => {
    try {
      const { data, error } = await supabase
        .from("produce_listings")
        .select("*")
        .eq("id", editId)
        .single();

      if (error) throw error;

      if (data) {
        setFormData({
          name: data.name,
          category: data.category,
          price: data.price_per_unit.toString(),
          unit: data.unit,
          quantity: data.quantity_available.toString(),
          organic: data.organic || false,
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
      const produceData = {
        name: formData.name,
        category: formData.category,
        price_per_unit: parseFloat(formData.price),
        unit: formData.unit,
        quantity_available: parseFloat(formData.quantity),
        organic: formData.organic,
        description: formData.description,
        farmer_id: user.id,
        status: 'active',
      };

      if (editId) {
        const { error } = await supabase
          .from("produce_listings")
          .update(produceData)
          .eq("id", editId);

        if (error) throw error;

        toast({
          title: "Listing Updated!",
          description: "Your produce listing has been updated successfully.",
        });
      } else {
        const { error } = await supabase
          .from("produce_listings")
          .insert([produceData]);

        if (error) throw error;

        toast({
          title: "Listing Created!",
          description: "Your produce listing has been created successfully.",
        });
      }

      navigate("/dashboard/user");
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
          onClick={() => navigate("/dashboard/user")}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>{editId ? "Edit" : "Add"} Produce Listing</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Organic Tomatoes"
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
                    <SelectItem value="vegetables">Vegetables</SelectItem>
                    <SelectItem value="fruits">Fruits</SelectItem>
                    <SelectItem value="grains">Grains</SelectItem>
                    <SelectItem value="dairy">Dairy</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="e.g., 80"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="unit">Unit</Label>
                  <Select value={formData.unit} onValueChange={(value) => setFormData({...formData, unit: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kg">per kg</SelectItem>
                      <SelectItem value="liter">per liter</SelectItem>
                      <SelectItem value="dozen">per dozen</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="quantity">Quantity Available</Label>
                  <Input
                    id="quantity"
                    type="number"
                    placeholder="e.g., 25"
                    value={formData.quantity}
                    onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="organic"
                  checked={formData.organic}
                  onCheckedChange={(checked) => 
                    setFormData({...formData, organic: checked as boolean})
                  }
                />
                <Label htmlFor="organic" className="cursor-pointer">Certified Organic</Label>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your produce..."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={4}
                />
              </div>

              <div className="flex gap-4">
                <Button type="button" variant="outline" onClick={() => navigate("/dashboard/user")} className="flex-1">
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

export default AddProduceListing;
