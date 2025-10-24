import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, CreditCard, Wallet } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const Payment = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const type = searchParams.get("type");
  const amount = searchParams.get("amount");
  const itemId = searchParams.get("id");
  const cartData = searchParams.get("cart");
  const address = searchParams.get("address");
  
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [processing, setProcessing] = useState(false);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setProcessing(true);
    try {
      if (type === "lease" && itemId) {
        // Create plot lease
        const { data: plot } = await supabase
          .from("land_listings")
          .select("*")
          .eq("id", itemId)
          .single();

        if (plot) {
          const { error } = await supabase.from("plot_leases").insert({
            land_listing_id: itemId,
            user_id: user.id,
            area_sqft: plot.available_area_sqft,
            monthly_price: parseFloat(amount || "0"),
            start_date: new Date().toISOString().split("T")[0],
            end_date: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          });

          if (error) throw error;

          // Update available area
          await supabase
            .from("land_listings")
            .update({ available_area_sqft: 0, status: "leased" })
            .eq("id", itemId);
        }
      } else if (type === "equipment" && itemId) {
        // Create equipment rental
        const { error } = await supabase.from("equipment_rentals").insert({
          equipment_id: itemId,
          user_id: user.id,
          start_date: new Date().toISOString().split("T")[0],
          end_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          total_price: parseFloat(amount || "0"),
        });

        if (error) throw error;

        // Update equipment status
        await supabase
          .from("equipment_listings")
          .update({ availability_status: "rented" })
          .eq("id", itemId);
      } else if (type === "marketplace" && cartData) {
        // Create orders from cart
        const items = JSON.parse(decodeURIComponent(cartData));
        
        for (const item of items) {
          const { error } = await supabase.from("orders").insert({
            produce_id: item.produceId,
            buyer_id: user.id,
            quantity: item.quantity,
            total_price: item.price * item.quantity,
            delivery_address: address || "",
          });

          if (error) throw error;

          // Update produce quantity
          const { data: produce } = await supabase
            .from("produce_listings")
            .select("quantity_available")
            .eq("id", item.produceId)
            .single();

          if (produce) {
            const newQuantity = produce.quantity_available - item.quantity;
            await supabase
              .from("produce_listings")
              .update({ 
                quantity_available: newQuantity,
                status: newQuantity <= 0 ? 'sold_out' : 'active'
              })
              .eq("id", item.produceId);
          }
        }
      }

      toast({
        title: "Payment Successful!",
        description: `Your payment of ₹${amount} has been processed successfully.`,
      });
      
      setTimeout(() => {
        navigate("/dashboard/user");
      }, 1500);
    } catch (error: any) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Payment Details</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePayment} className="space-y-6">
                  <div>
                    <Label className="mb-3 block">Payment Method</Label>
                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                      <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:border-primary">
                        <RadioGroupItem value="card" id="card" />
                        <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer flex-1">
                          <CreditCard className="h-4 w-4" />
                          Credit / Debit Card
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:border-primary">
                        <RadioGroupItem value="upi" id="upi" />
                        <Label htmlFor="upi" className="flex items-center gap-2 cursor-pointer flex-1">
                          <Wallet className="h-4 w-4" />
                          UPI
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {paymentMethod === "card" && (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input
                          id="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="cardName">Cardholder Name</Label>
                        <Input
                          id="cardName"
                          placeholder="John Doe"
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="expiry">Expiry Date</Label>
                          <Input
                            id="expiry"
                            placeholder="MM/YY"
                            value={expiryDate}
                            onChange={(e) => setExpiryDate(e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="cvv">CVV</Label>
                          <Input
                            id="cvv"
                            placeholder="123"
                            type="password"
                            maxLength={3}
                            value={cvv}
                            onChange={(e) => setCvv(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === "upi" && (
                    <div>
                      <Label htmlFor="upiId">UPI ID</Label>
                      <Input
                        id="upiId"
                        placeholder="yourname@upi"
                        required
                      />
                    </div>
                  )}

                  <Button type="submit" className="w-full" size="lg" disabled={processing}>
                    {processing ? "Processing..." : `Pay ₹${amount}`}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {type === "lease" ? "Plot Lease" : type === "equipment" ? "Equipment Rental" : "Products"}
                  </span>
                  <span className="font-semibold">₹{amount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Platform Fee</span>
                  <span className="font-semibold">₹50</span>
                </div>
                <div className="border-t pt-4 flex justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="text-xl font-bold text-primary">₹{Number(amount) + 50}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Payment;
