-- Create role enum
CREATE TYPE public.app_role AS ENUM ('user', 'farmer', 'vendor', 'admin');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  location TEXT,
  bio TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create user_roles table (separate for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Create land_listings table
CREATE TABLE public.land_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  location TEXT NOT NULL,
  total_area_sqft DECIMAL NOT NULL,
  price_per_sqft_monthly DECIMAL NOT NULL,
  available_area_sqft DECIMAL NOT NULL,
  soil_type TEXT,
  water_access BOOLEAN DEFAULT false,
  amenities TEXT[],
  images TEXT[],
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'full')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create plot_leases table
CREATE TABLE public.plot_leases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  land_listing_id UUID REFERENCES public.land_listings(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  area_sqft DECIMAL NOT NULL,
  monthly_price DECIMAL NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create equipment_listings table
CREATE TABLE public.equipment_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  price_per_day DECIMAL NOT NULL,
  condition TEXT,
  availability_status TEXT NOT NULL DEFAULT 'available' CHECK (availability_status IN ('available', 'rented', 'maintenance')),
  images TEXT[],
  location TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create equipment_rentals table
CREATE TABLE public.equipment_rentals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  equipment_id UUID REFERENCES public.equipment_listings(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  total_price DECIMAL NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create produce_listings table
CREATE TABLE public.produce_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  price_per_unit DECIMAL NOT NULL,
  unit TEXT NOT NULL,
  quantity_available DECIMAL NOT NULL,
  organic BOOLEAN DEFAULT false,
  harvest_date DATE,
  images TEXT[],
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'sold_out', 'inactive')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create orders table
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  produce_id UUID REFERENCES public.produce_listings(id) ON DELETE CASCADE NOT NULL,
  buyer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  quantity DECIMAL NOT NULL,
  total_price DECIMAL NOT NULL,
  delivery_address TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'delivered', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.land_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plot_leases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipment_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipment_rentals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.produce_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Profiles RLS policies
CREATE POLICY "Users can view all profiles"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- User roles RLS policies
CREATE POLICY "Users can view all roles"
  ON public.user_roles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own roles during signup"
  ON public.user_roles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Land listings RLS policies
CREATE POLICY "Anyone can view active land listings"
  ON public.land_listings FOR SELECT
  USING (true);

CREATE POLICY "Farmers can create land listings"
  ON public.land_listings FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'farmer'));

CREATE POLICY "Farmers can update own listings"
  ON public.land_listings FOR UPDATE
  USING (farmer_id = auth.uid());

CREATE POLICY "Farmers can delete own listings"
  ON public.land_listings FOR DELETE
  USING (farmer_id = auth.uid());

-- Plot leases RLS policies
CREATE POLICY "Users can view own leases"
  ON public.plot_leases FOR SELECT
  USING (user_id = auth.uid() OR EXISTS (
    SELECT 1 FROM public.land_listings 
    WHERE id = plot_leases.land_listing_id AND farmer_id = auth.uid()
  ));

CREATE POLICY "Users can create leases"
  ON public.plot_leases FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own leases"
  ON public.plot_leases FOR UPDATE
  USING (user_id = auth.uid());

-- Equipment listings RLS policies
CREATE POLICY "Anyone can view available equipment"
  ON public.equipment_listings FOR SELECT
  USING (true);

CREATE POLICY "Vendors can create equipment listings"
  ON public.equipment_listings FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'vendor'));

CREATE POLICY "Vendors can update own equipment"
  ON public.equipment_listings FOR UPDATE
  USING (vendor_id = auth.uid());

CREATE POLICY "Vendors can delete own equipment"
  ON public.equipment_listings FOR DELETE
  USING (vendor_id = auth.uid());

-- Equipment rentals RLS policies
CREATE POLICY "Users can view own rentals"
  ON public.equipment_rentals FOR SELECT
  USING (user_id = auth.uid() OR EXISTS (
    SELECT 1 FROM public.equipment_listings 
    WHERE id = equipment_rentals.equipment_id AND vendor_id = auth.uid()
  ));

CREATE POLICY "Users can create rentals"
  ON public.equipment_rentals FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own rentals"
  ON public.equipment_rentals FOR UPDATE
  USING (user_id = auth.uid());

-- Produce listings RLS policies
CREATE POLICY "Anyone can view active produce"
  ON public.produce_listings FOR SELECT
  USING (true);

CREATE POLICY "Farmers can create produce listings"
  ON public.produce_listings FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'farmer'));

CREATE POLICY "Farmers can update own produce"
  ON public.produce_listings FOR UPDATE
  USING (farmer_id = auth.uid());

CREATE POLICY "Farmers can delete own produce"
  ON public.produce_listings FOR DELETE
  USING (farmer_id = auth.uid());

-- Orders RLS policies
CREATE POLICY "Users can view own orders"
  ON public.orders FOR SELECT
  USING (buyer_id = auth.uid() OR EXISTS (
    SELECT 1 FROM public.produce_listings 
    WHERE id = orders.produce_id AND farmer_id = auth.uid()
  ));

CREATE POLICY "Users can create orders"
  ON public.orders FOR INSERT
  WITH CHECK (buyer_id = auth.uid());

CREATE POLICY "Buyers can update own orders"
  ON public.orders FOR UPDATE
  USING (buyer_id = auth.uid());

-- Create trigger function for updating timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Add update triggers for all tables with updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_land_listings_updated_at BEFORE UPDATE ON public.land_listings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_plot_leases_updated_at BEFORE UPDATE ON public.plot_leases
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_equipment_listings_updated_at BEFORE UPDATE ON public.equipment_listings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_equipment_rentals_updated_at BEFORE UPDATE ON public.equipment_rentals
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_produce_listings_updated_at BEFORE UPDATE ON public.produce_listings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger to auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    NEW.email
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();