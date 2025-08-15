import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Shield, Mail, Lock, User, Key } from "lucide-react";
import { Link, useLocation } from "wouter";

export default function AdminLogin() {
  const { user, loginMutation, registerMutation } = useAuth();
  const [, setLocation] = useLocation();
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });

  if (user) {
    setLocation("/admin");
    return null;
  }

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
    twoFactorCode: "",
  });

  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await loginMutation.mutateAsync({
      email: loginForm.email,
      password: loginForm.password,
      twoFactorCode: loginForm.twoFactorCode || undefined,
    });

    if (result?.requiresTwoFactor) {
      setShowTwoFactor(true);
      setLoginData({ email: loginForm.email, password: loginForm.password });
    } else if (result && !result.error) {
      setLocation("/admin");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (registerForm.password !== registerForm.confirmPassword) {
      return;
    }

    const result = await registerMutation.mutateAsync({
      name: registerForm.name,
      email: registerForm.email,
      password: registerForm.password,
    });

    if (result && !result.error) {
      setLocation("/admin");
    }
  };

  const handle2FALogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await loginMutation.mutateAsync({
      email: loginData.email,
      password: loginData.password,
      twoFactorCode: loginForm.twoFactorCode,
    });
    setLocation("/admin");
  };

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center px-4">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-tech-blue/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-neon-cyan/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-tech-blue to-neon-cyan rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-inter font-bold gradient-text mb-2">TECH2SAINI</h1>
          <p className="text-gray-400">Admin Portal</p>
        </div>

        {showTwoFactor ? (
          <Card className="glass-morphism border-tech-light/20">
            <CardHeader className="text-center">
              <CardTitle className="text-white">Two-Factor Authentication</CardTitle>
              <CardDescription className="text-gray-400">
                Enter the 6-digit code from your authenticator app
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handle2FALogin} className="space-y-4">
                <div>
                  <Label htmlFor="twoFactorCode" className="text-white">Authentication Code</Label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <Input
                      id="twoFactorCode"
                      type="text"
                      placeholder="000000"
                      maxLength={6}
                      value={loginForm.twoFactorCode}
                      onChange={(e) => setLoginForm({ ...loginForm, twoFactorCode: e.target.value })}
                      className="pl-12 bg-dark-bg/50 border-gray-600 text-white placeholder-gray-400 focus:border-tech-light"
                      required
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-tech-blue to-tech-light hover:shadow-lg hover:shadow-tech-light/50"
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? "Verifying..." : "Verify & Login"}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full text-gray-400 hover:text-white"
                  onClick={() => setShowTwoFactor(false)}
                >
                  Back to Login
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-dark-secondary border border-gray-600">
              <TabsTrigger value="login" className="text-white data-[state=active]:bg-tech-light/20 data-[state=active]:text-tech-light">
                Login
              </TabsTrigger>
              <TabsTrigger value="register" className="text-white data-[state=active]:bg-tech-light/20 data-[state=active]:text-tech-light">
                Register
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <Card className="glass-morphism border-tech-light/20">
                <CardHeader>
                  <CardTitle className="text-white">Welcome Back</CardTitle>
                  <CardDescription className="text-gray-400">
                    Sign in to your admin account
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <Label htmlFor="email" className="text-white">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <Input
                          id="email"
                          type="email"
                          placeholder="admin@tech2saini.com"
                          value={loginForm.email}
                          onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                          className="pl-12 bg-dark-bg/50 border-gray-600 text-white placeholder-gray-400 focus:border-tech-light"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="password" className="text-white">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <Input
                          id="password"
                          type="password"
                          placeholder="••••••••"
                          value={loginForm.password}
                          onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                          className="pl-12 bg-dark-bg/50 border-gray-600 text-white placeholder-gray-400 focus:border-tech-light"
                          required
                        />
                      </div>
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-tech-blue to-tech-light hover:shadow-lg hover:shadow-tech-light/50"
                      disabled={loginMutation.isPending}
                    >
                      {loginMutation.isPending ? "Signing in..." : "Sign In"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="register">
              <Card className="glass-morphism border-tech-light/20">
                <CardHeader>
                  <CardTitle className="text-white">Create Account</CardTitle>
                  <CardDescription className="text-gray-400">
                    Set up your admin account
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                      <Label htmlFor="name" className="text-white">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <Input
                          id="name"
                          type="text"
                          placeholder="Monu Saini"
                          value={registerForm.name}
                          onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                          className="pl-12 bg-dark-bg/50 border-gray-600 text-white placeholder-gray-400 focus:border-tech-light"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="reg-email" className="text-white">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <Input
                          id="reg-email"
                          type="email"
                          placeholder="admin@tech2saini.com"
                          value={registerForm.email}
                          onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                          className="pl-12 bg-dark-bg/50 border-gray-600 text-white placeholder-gray-400 focus:border-tech-light"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="reg-password" className="text-white">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <Input
                          id="reg-password"
                          type="password"
                          placeholder="••••••••"
                          value={registerForm.password}
                          onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                          className="pl-12 bg-dark-bg/50 border-gray-600 text-white placeholder-gray-400 focus:border-tech-light"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="confirm-password" className="text-white">Confirm Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <Input
                          id="confirm-password"
                          type="password"
                          placeholder="••••••••"
                          value={registerForm.confirmPassword}
                          onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                          className="pl-12 bg-dark-bg/50 border-gray-600 text-white placeholder-gray-400 focus:border-tech-light"
                          required
                        />
                      </div>
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-tech-blue to-tech-light hover:shadow-lg hover:shadow-tech-light/50"
                      disabled={registerMutation.isPending || registerForm.password !== registerForm.confirmPassword}
                    >
                      {registerMutation.isPending ? "Creating Account..." : "Create Account"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}

        <div className="mt-6 text-center">
          <Link href="/" className="text-gray-400 hover:text-tech-light transition-colors">
            ← Back to Portfolio
          </Link>
        </div>
      </div>
    </div>
  );
}