-- Allow hobbyists (user role) to create produce listings
DROP POLICY IF EXISTS "Farmers can create produce listings" ON produce_listings;
CREATE POLICY "Users and farmers can create produce listings" 
ON produce_listings 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'farmer'::app_role) OR has_role(auth.uid(), 'user'::app_role));

-- Allow hobbyists to update their own produce
DROP POLICY IF EXISTS "Farmers can update own produce" ON produce_listings;
CREATE POLICY "Users can update own produce" 
ON produce_listings 
FOR UPDATE 
USING (farmer_id = auth.uid());

-- Allow hobbyists to delete their own produce
DROP POLICY IF EXISTS "Farmers can delete own produce" ON produce_listings;
CREATE POLICY "Users can delete own produce" 
ON produce_listings 
FOR DELETE 
USING (farmer_id = auth.uid());

-- Insert default land listings (2 examples)
INSERT INTO land_listings (
  id, farmer_id, title, location, total_area_sqft, available_area_sqft, 
  price_per_sqft_monthly, soil_type, water_access, amenities, description, status
) VALUES 
(
  '11111111-1111-1111-1111-111111111111',
  (SELECT id FROM auth.users LIMIT 1),
  'Organic Farm Plot - East District',
  'Medak, Telangana',
  500,
  500,
  24,
  'Red Soil',
  true,
  ARRAY['tool_shed', 'fenced'],
  'Perfect plot for organic farming with excellent water access and tools',
  'active'
),
(
  '22222222-2222-2222-2222-222222222222',
  (SELECT id FROM auth.users LIMIT 1),
  'Riverside Farming Land',
  'Nizamabad, Telangana',
  750,
  750,
  24,
  'Black Soil',
  true,
  ARRAY['fenced'],
  'Premium riverside plot with natural irrigation access',
  'active'
)
ON CONFLICT (id) DO NOTHING;

-- Insert default equipment listings (2 examples)
INSERT INTO equipment_listings (
  id, vendor_id, name, category, price_per_day, condition, location, 
  availability_status, description
) VALUES 
(
  '33333333-3333-3333-3333-333333333333',
  (SELECT id FROM auth.users LIMIT 1),
  'John Deere Tractor',
  'Heavy Machinery',
  2500,
  'Excellent',
  'Punjab',
  'available',
  'Powerful tractor suitable for all farming operations'
),
(
  '44444444-4444-4444-4444-444444444444',
  (SELECT id FROM auth.users LIMIT 1),
  'Irrigation Pump',
  'Irrigation',
  800,
  'Good',
  'Haryana',
  'available',
  'High-efficiency water pump for irrigation'
)
ON CONFLICT (id) DO NOTHING;

-- Insert default produce listings (2 examples)
INSERT INTO produce_listings (
  id, farmer_id, name, category, price_per_unit, unit, quantity_available,
  organic, description, status
) VALUES 
(
  '55555555-5555-5555-5555-555555555555',
  (SELECT id FROM auth.users LIMIT 1),
  'Organic Tomatoes',
  'vegetables',
  80,
  'kg',
  100,
  true,
  'Fresh organic tomatoes from our farm',
  'active'
),
(
  '66666666-6666-6666-6666-666666666666',
  (SELECT id FROM auth.users LIMIT 1),
  'Fresh Milk',
  'dairy',
  60,
  'liter',
  50,
  false,
  'Pure farm-fresh dairy milk',
  'active'
)
ON CONFLICT (id) DO NOTHING;