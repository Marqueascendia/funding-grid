import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";


export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_BACKEND_URL;


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      console.log('email', email);
      console.log('password', password);
      const res = await axios.post(`${baseUrl}/login`, { 
        email: email,
        password: password,
      });
      if (res?.status === 200) {
        toast.success("Login successful");
        localStorage.setItem("fundingGridToken", res?.data?.token);
        navigate("/");
      }
      else{
        toast.error(res?.data?.error);
      }
    } catch (error) {
      console.log('error', error.response?.data?.error || error.message);
      toast.error(error.response?.data?.error || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 gradient-bg">
      <Card className="w-full max-w-md">
        {/* Logo and Company Name */}
        <CardHeader className="flex flex-col items-center justify-center gap-10">
          <div className="flex items-center justify-center gap-2">
            {/* <img src="/logo.png" alt="Spotlight Strategic Solutions" className="w-5 h-5" /> */}
            <h1 className="text-2xl font-bold -ml-2">
              Funding Grid
            </h1>
          </div>
          <h2 className="text-2xl font-semibold text-center text-[#1a365d]">
            Welcome back!
          </h2>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Email & Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm text-muted-foreground" htmlFor="email">
                Email address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="example@company.com"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                value={email}
                className=""
                required
              />
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label
                  className="text-sm text-muted-foreground"
                  htmlFor="password"
                >
                  Password
                </label>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  value={password}
                  className="pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <a
                href="#"
                className="text-sm text-muted-foreground hover:text-primary block w-full text-right"
              >
                Forgot password?
              </a>
            </div>

            <Button className="w-full py-5 text-base mt-5" type="submit" disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Log in"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}