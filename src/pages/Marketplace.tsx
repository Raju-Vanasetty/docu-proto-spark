import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, ShoppingCart } from "lucide-react";
import { useState, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";
import { useNavigate } from "react-router-dom";

const Marketplace = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all");
  const [location, setLocation] = useState("all");
  const { toast } = useToast();
  const { addToCart, items } = useCart();

  const products = [
    {
      id: 1,
      name: "Organic Tomatoes",
      category: "Vegetables",
      price: "₹60/kg",
      farmer: "Rajesh Kumar",
      location: "Punjab",
      image: "🍅",
      inStock: true,
    },
    {
      id: 2,
      name: "Fresh Wheat",
      category: "Grains",
      price: "₹25/kg",
      farmer: "Priya Sharma",
      location: "Haryana",
      image: "🌾",
      inStock: true,
    },
    {
      id: 3,
      name: "Organic Milk",
      category: "Dairy",
      price: "₹70/liter",
      farmer: "Amit Patel",
      location: "Gujarat",
      image: "🥛",
      inStock: true,
    },
    {
      id: 4,
      name: "Fresh Carrots",
      category: "Vegetables",
      price: "₹40/kg",
      farmer: "Sunita Devi",
      location: "Uttar Pradesh",
      image: "🥕",
      inStock: false,
    },
  ];

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = category === "all" || product.category.toLowerCase() === category;
      const matchesLocation = location === "all" || product.location.toLowerCase() === location;

      return matchesSearch && matchesCategory && matchesLocation;
    });
  }, [searchTerm, category, location]);

  const handleAddToCart = (product: typeof products[0]) => {
    const priceNum = parseInt(product.price.replace(/[^0-9]/g, ''));
    addToCart({
      id: product.id.toString(),
      name: product.name,
      price: priceNum,
      unit: "kg",
      farmer: product.farmer,
    });
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart!`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold mb-2">Farm Marketplace</h1>
            <p className="text-muted-foreground">Buy fresh produce directly from farmers</p>
          </div>
          <Button onClick={() => navigate("/cart")} variant="outline" className="relative">
            <ShoppingCart className="h-5 w-5 mr-2" />
            Cart
            {items.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full h-5 w-5 flex items-center justify-center text-xs">
                {items.length}
              </span>
            )}
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search products..." 
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
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="vegetables">Vegetables</SelectItem>
              <SelectItem value="grains">Grains</SelectItem>
              <SelectItem value="dairy">Dairy</SelectItem>
              <SelectItem value="fruits">Fruits</SelectItem>
            </SelectContent>
          </Select>
          <Select value={location} onValueChange={setLocation}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              <SelectItem value="punjab">Punjab</SelectItem>
              <SelectItem value="haryana">Haryana</SelectItem>
              <SelectItem value="gujarat">Gujarat</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 bg-muted flex items-center justify-center text-6xl">
                {product.image}
              </div>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{product.name}</CardTitle>
                    <CardDescription>{product.category}</CardDescription>
                  </div>
                  {product.inStock ? (
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">In Stock</span>
                  ) : (
                    <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">Out of Stock</span>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Farmer</span>
                    <span className="font-medium">{product.farmer}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Location</span>
                    <span className="font-medium">{product.location}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Price</span>
                    <span className="font-bold text-primary">{product.price}</span>
                  </div>
                  <Button 
                    className="w-full" 
                    disabled={!product.inStock}
                    onClick={() => handleAddToCart(product)}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {product.inStock ? "Add to Cart" : "Out of Stock"}
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

export default Marketplace;
