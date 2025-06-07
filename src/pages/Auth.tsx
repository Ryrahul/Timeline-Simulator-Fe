import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";

import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import {
  GitBranch,
  Brain,
  Sparkles,
  Users,
  Shield,
  Zap,
  CheckCircle2,
} from "lucide-react";
import { useSignup } from "@/hooks/auth";
import { Link } from "react-router-dom";

const loginSchema = z.object({
  email: z
    .string()
    .min(5, { message: "Email should be at least 5 characters long" })
    .email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(128, { message: "Password can be up to 128 characters long" }),
});

const signupSchema = z.object({
  email: z
    .string()
    .min(5, { message: "Email should be at least 5 characters long" })
    .email({ message: "Invalid email address" }),
  username: z
    .string()
    .min(3, { message: "Username should be at least 3 characters long" })
    .max(25, { message: "Username can be up to 25 characters long" })
    .regex(/^[a-zA-Z0-9.]+$/, {
      message: "Username must only contain letters, numbers, or periods",
    }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(128, { message: "Password can be up to 128 characters long" }),
});

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState("signup");
  const { signup, login } = useSignup();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const accountForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "a@gmail.com",
      password: "********",
    },
  });

  const passwordForm = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      username: "",
    },
  });

  async function onSubmitAccount(data: z.infer<typeof loginSchema>) {
    await login(data.email, data.password);
  }

  async function onSubmitSignup(data: z.infer<typeof signupSchema>) {
    const success = await signup(data.email, data.username, data.password);
    if (success) {
      setActiveTab("account");
    }
    setActiveTab("account");
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const benefits = [
    {
      icon: <Brain className="w-5 h-5" />,
      title: "AI-Powered Insights",
      description: "Get personalized timeline predictions",
    },
    {
      icon: <Sparkles className="w-5 h-5" />,
      title: "Multiple Scenarios",
      description: "Explore 3 unique future paths",
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: "Privacy Protected",
      description: "Your data is secure & encrypted",
    },
    {
      icon: <Zap className="w-5 h-5" />,
      title: "Instant Results",
      description: "Get insights in seconds",
    },
  ];

  const stats = [
    { value: "10K+", label: "Users" },
    { value: "50K+", label: "Timelines Created" },
    { value: "98%", label: "Accuracy Rate" },
  ];

  return (
    <div className="min-h-screen overflow-hidden relative bg-black text-white">
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-black"></div>
        <div
          className="absolute w-96 h-96 rounded-full bg-gradient-to-r from-cyan-500/10 to-purple-500/10 blur-3xl"
          style={{
            left: mousePosition.x - 192,
            top: mousePosition.y - 192,
            transition: "all 0.3s ease-out",
          }}
        ></div>
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          ></div>
        ))}
      </div>

      <nav className="relative z-10 p-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Link to="/" className="flex items-center space-x-2 group">
            <GitBranch className="w-8 h-8 text-cyan-400" />
            <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Parallel Timeline
            </span>
          </Link>{" "}
        </div>
        <div className="w-20"></div>
      </nav>

      <div className="relative z-10 grid lg:grid-cols-2 min-h-screen">
        <div className="flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Welcome to the Future
              </h1>
              <p className="text-gray-400">
                Join thousands exploring their alternate timelines
              </p>
            </div>

            <div className="flex justify-center space-x-6 mb-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-xl font-bold text-cyan-400">
                    {stat.value}
                  </div>
                  <div className="text-xs text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 bg-gray-900/50 border-gray-700/50 backdrop-blur-sm">
                <TabsTrigger
                  value="login"
                  className="text-gray-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-purple-600 data-[state=active]:text-white"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger
                  value="signup"
                  className="text-gray-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-purple-600 data-[state=active]:text-white"
                >
                  SignUp
                </TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                <Form {...accountForm}>
                  <form onSubmit={accountForm.handleSubmit(onSubmitAccount)}>
                    <Card className="bg-gray-900/50 border-gray-700/50 hover:bg-gray-800/50 backdrop-blur-sm transition-all duration-300">
                      <CardHeader>
                        <CardTitle className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                          Login
                        </CardTitle>
                        <CardDescription className="text-gray-300">
                          Welcome back! Please log in to explore your future
                          paths.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="grid gap-6">
                        <FormField
                          control={accountForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-200">
                                Email
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter your email"
                                  {...field}
                                  className="bg-gray-800/50 border-gray-700/50 text-white placeholder-gray-400 focus:border-cyan-400/50 focus:ring-cyan-400/25 transition-all duration-300"
                                />
                              </FormControl>

                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={accountForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-200">
                                Password
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter your password"
                                  {...field}
                                  className="bg-gray-800/50 border-gray-700/50 text-white placeholder-gray-400 focus:border-cyan-400/50 focus:ring-cyan-400/25 transition-all duration-300"
                                />
                              </FormControl>

                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </CardContent>
                      <CardFooter>
                        <Button className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white shadow-lg hover:shadow-cyan-500/25 transition-all duration-300">
                          Save changes
                        </Button>
                      </CardFooter>
                    </Card>
                  </form>
                </Form>
              </TabsContent>
              <TabsContent value="signup">
                <Form {...passwordForm}>
                  <form onSubmit={passwordForm.handleSubmit(onSubmitSignup)}>
                    <Card className="bg-gray-900/50 border-gray-700/50 hover:bg-gray-800/50 backdrop-blur-sm transition-all duration-300">
                      <CardHeader>
                        <CardTitle className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                          Signup
                        </CardTitle>
                        <CardDescription className="text-gray-300">
                          Create Your Account
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="grid gap-6">
                        <FormField
                          control={passwordForm.control}
                          name="username"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-200">
                                Username
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter your username"
                                  {...field}
                                  className="bg-gray-800/50 border-gray-700/50 text-white placeholder-gray-400 focus:border-cyan-400/50 focus:ring-cyan-400/25 transition-all duration-300"
                                />
                              </FormControl>
                              <FormDescription className="text-gray-400">
                                Enter your username.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={passwordForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-200">
                                Email
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter your email"
                                  {...field}
                                  className="bg-gray-800/50 border-gray-700/50 text-white placeholder-gray-400 focus:border-cyan-400/50 focus:ring-cyan-400/25 transition-all duration-300"
                                />
                              </FormControl>
                              <FormDescription className="text-gray-400">
                                Enter your email.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={passwordForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-200">
                                Password
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="password"
                                  placeholder="Enter your password"
                                  {...field}
                                  className="bg-gray-800/50 border-gray-700/50 text-white placeholder-gray-400 focus:border-cyan-400/50 focus:ring-cyan-400/25 transition-all duration-300"
                                />
                              </FormControl>
                              <FormDescription className="text-gray-400">
                                Enter your password.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </CardContent>
                      <CardFooter>
                        <Button className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white shadow-lg hover:shadow-cyan-500/25 transition-all duration-300">
                          Create Account
                        </Button>
                      </CardFooter>
                    </Card>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center">
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-400">
                <Shield className="w-4 h-4 text-green-400" />
                <span>Secure & Encrypted</span>
                <span>•</span>
                <span>No Spam Policy</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-8 hidden lg:block">
          <div>
            <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Why Join Parallel Timeline?
            </h2>
            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <Card
                  key={index}
                  className="bg-gray-900/30 border-gray-700/30 backdrop-blur-sm hover:bg-gray-800/40 transition-all duration-300"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className="text-cyan-400 mt-1">{benefit.icon}</div>
                      <div>
                        <h3 className="font-semibold text-white mb-1">
                          {benefit.title}
                        </h3>
                        <p className="text-sm text-gray-400">
                          {benefit.description}
                        </p>
                      </div>
                      <CheckCircle2 className="w-4 h-4 text-green-400 mt-1 ml-auto" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4 text-white">
              How It Works
            </h3>
            <div className="space-y-3">
              {[
                {
                  step: "1",
                  text: "Enter your life decision",
                  icon: <Brain className="w-4 h-4" />,
                },
                {
                  step: "2",
                  text: "AI generates 3 timelines",
                  icon: <Sparkles className="w-4 h-4" />,
                },
                {
                  step: "3",
                  text: "Compare & explore outcomes",
                  icon: <Users className="w-4 h-4" />,
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 text-sm"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 flex items-center justify-center text-xs font-bold">
                    {item.step}
                  </div>
                  <div className="text-cyan-400">{item.icon}</div>
                  <span className="text-gray-300">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
