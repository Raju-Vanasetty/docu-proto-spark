import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Sprout, User, Tractor as TractorIcon, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<string>("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!role) {
      toast({
        title: "Role required",
        description: "Please select your role to continue",
        variant: "destructive",
      });
      return;
    }

    // In a real app, this would call the backend
    toast({
      title: "Account created!",
      description: "Welcome to FarmShare. Redirecting to your dashboard...",
    });

    setTimeout(() => {
      navigate(`/dashboard/${role}`);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Sprout className="h-10 w-10 text-primary" />
            </div>
          </div>
          <CardTitle className="text-3xl">Join FarmShare</CardTitle>
          <CardDescription className="text-base">
            Create your account and start your farming journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="space-y-3">
              <Label>I am a...</Label>
              <RadioGroup value={role} onValueChange={setRole}>
                <Card className={`cursor-pointer transition-all ${role === 'user' ? 'border-primary border-2 bg-primary/5' : ''}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="user" id="user" />
                      <Label htmlFor="user" className="flex items-center gap-3 cursor-pointer flex-1">
                        <div className="p-2 bg-secondary/10 rounded-full">
                          <User className="h-5 w-5 text-secondary" />
                        </div>
                        <div>
                          <div className="font-medium">Hobbyist Farmer</div>
                          <div className="text-sm text-muted-foreground">I want to lease land and grow crops</div>
                        </div>
                      </Label>
                    </div>
                  </CardContent>
                </Card>

                <Card className={`cursor-pointer transition-all ${role === 'farmer' ? 'border-primary border-2 bg-primary/5' : ''}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="farmer" id="farmer" />
                      <Label htmlFor="farmer" className="flex items-center gap-3 cursor-pointer flex-1">
                        <div className="p-2 bg-primary/10 rounded-full">
                          <MapPin className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">Landowner</div>
                          <div className="text-sm text-muted-foreground">I have land to lease out</div>
                        </div>
                      </Label>
                    </div>
                  </CardContent>
                </Card>

                <Card className={`cursor-pointer transition-all ${role === 'vendor' ? 'border-primary border-2 bg-primary/5' : ''}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="vendor" id="vendor" />
                      <Label htmlFor="vendor" className="flex items-center gap-3 cursor-pointer flex-1">
                        <div className="p-2 bg-accent/10 rounded-full">
                          <TractorIcon className="h-5 w-5 text-accent" />
                        </div>
                        <div>
                          <div className="font-medium">Equipment Vendor</div>
                          <div className="text-sm text-muted-foreground">I rent farming equipment</div>
                        </div>
                      </Label>
                    </div>
                  </CardContent>
                </Card>
              </RadioGroup>
            </div>

            <Button type="submit" className="w-full" size="lg">
              Create Account
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-primary font-medium hover:underline">
                Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
