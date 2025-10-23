import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import Index from "./pages/Index";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Browse from "./pages/Browse";
import Equipment from "./pages/Equipment";
import Marketplace from "./pages/Marketplace";
import DashboardHobbyist from "./pages/DashboardHobbyist";
import DashboardLandowner from "./pages/DashboardLandowner";
import DashboardVendor from "./pages/DashboardVendor";
import PlotDetails from "./pages/PlotDetails";
import Payment from "./pages/Payment";
import Cart from "./pages/Cart";
import AddLandListing from "./pages/AddLandListing";
import AddEquipmentListing from "./pages/AddEquipmentListing";
import AddProduceListing from "./pages/AddProduceListing";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <CartProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/browse" element={<Browse />} />
            <Route path="/plot-details" element={<PlotDetails />} />
            <Route path="/equipment" element={<Equipment />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/dashboard/user" element={<DashboardHobbyist />} />
            <Route path="/dashboard/farmer" element={<DashboardLandowner />} />
            <Route path="/dashboard/vendor" element={<DashboardVendor />} />
            <Route path="/add-land-listing" element={<AddLandListing />} />
            <Route path="/add-equipment-listing" element={<AddEquipmentListing />} />
            <Route path="/add-produce-listing" element={<AddProduceListing />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </CartProvider>
  </QueryClientProvider>
);

export default App;
