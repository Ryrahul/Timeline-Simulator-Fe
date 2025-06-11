import { Link } from "react-router-dom";
import {
  GitBranch,
  Home,
  LogOut,
  Settings,
  User,
  Sparkles,
  Brain,
  Activity,
} from "lucide-react";
import { useRecoilValue } from "recoil";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { authAtom } from "@/state/authAtom";

export function Navbar() {
  const auth = useRecoilValue(authAtom);

  const handleLogout = (): void => {
    localStorage.removeItem("accountState");
    window.location.href = "/";
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200/10 bg-black/40 backdrop-blur-3xl supports-[backdrop-filter]:bg-black/40">
      <div className="w-full px-2 sm:px-4 md:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4 sm:space-x-8">
            <Link
              to="/"
              className="group flex items-center space-x-2 sm:space-x-3 transition-all duration-300 hover:scale-105"
            >
              <div className="relative">
                <GitBranch className="h-6 w-6 sm:h-8 sm:w-8 text-emerald-400 transition-all duration-300 group-hover:rotate-12 group-hover:text-emerald-300" />
                <div className="absolute inset-0 h-6 w-6 sm:h-8 sm:w-8 animate-pulse rounded-full bg-emerald-400/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="flex flex-col">
                <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-400 bg-clip-text text-lg sm:text-xl font-bold text-transparent">
                  <span className="hidden sm:inline">Parallel Timeline</span>
                  <span className="sm:hidden">Timeline</span>
                </span>
                <span className="hidden sm:block text-xs text-gray-400 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  Explore infinite possibilities
                </span>
              </div>
            </Link>

            {auth && (
              <div className="hidden lg:flex items-center space-x-1">
                <Link to="/">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200"
                  >
                    <Home className="mr-2 h-4 w-4" />
                    Home
                  </Button>
                </Link>
                <Link to="/timelines">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-300 hover:text-emerald-400 hover:bg-emerald-400/10 transition-all duration-200 group"
                  >
                    <Brain className="mr-2 h-4 w-4 group-hover:animate-pulse" />
                    My Simulations
                  </Button>
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            {auth ? (
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="lg:hidden">
                  <Link to="/timelines">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-300 hover:text-emerald-400 hover:bg-emerald-400/10 transition-all duration-200"
                    >
                      <Brain className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="group relative focus:outline-none">
                      <Avatar className="h-8 w-8 sm:h-10 sm:w-10 border-2 border-transparent bg-gradient-to-r from-emerald-400/20 to-purple-400/20 transition-all duration-300 group-hover:border-emerald-400/50 group-hover:scale-110">
                        <AvatarImage
                          src="https://github.com/shadcn.png"
                          className="rounded-full"
                        />
                        <AvatarFallback className="bg-gradient-to-br from-emerald-500 via-cyan-500 to-purple-500 text-white font-semibold text-xs sm:text-sm">
                          {auth.username
                            ? auth.username.substring(0, 2).toUpperCase()
                            : "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-emerald-400/0 to-purple-400/0 opacity-0 blur transition-opacity duration-300 group-hover:from-emerald-400/30 group-hover:to-purple-400/30 group-hover:opacity-100"></div>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-72 bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 shadow-2xl"
                    align="end"
                    sideOffset={8}
                  >
                    <DropdownMenuLabel className="pb-2">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-12 w-12 border-2 border-emerald-400/30">
                          <AvatarImage src="https://github.com/shadcn.png" />
                          <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-purple-500 text-white">
                            {auth.username
                              ? auth.username.substring(0, 2).toUpperCase()
                              : "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-semibold text-white">
                            {auth.username}
                          </p>
                          <p className="text-xs text-gray-400">{auth.email}</p>
                          <div className="flex items-center space-x-1 mt-1">
                            <Sparkles className="h-3 w-3 text-emerald-400" />
                            <span className="text-xs text-emerald-400 font-medium">
                              Timeline Explorer
                            </span>
                          </div>
                        </div>
                      </div>
                    </DropdownMenuLabel>

                    <DropdownMenuSeparator className="bg-gray-700/50" />

                    <DropdownMenuItem className="group text-gray-300 hover:bg-gray-700/50 hover:text-white transition-all duration-200 cursor-pointer">
                      <User className="mr-3 h-4 w-4 group-hover:text-emerald-400 transition-colors" />
                      <span>Profile</span>
                    </DropdownMenuItem>

                    <Link to="/timelines">
                      <DropdownMenuItem className="group text-gray-300 hover:bg-emerald-900/20 hover:text-emerald-400 transition-all duration-200 cursor-pointer">
                        <Brain className="mr-3 h-4 w-4 group-hover:animate-pulse" />
                        <div className="flex flex-col">
                          <span>My Simulations</span>
                          <span className="text-xs text-gray-500 group-hover:text-emerald-500">
                            View all timelines
                          </span>
                        </div>
                      </DropdownMenuItem>
                    </Link>

                    <DropdownMenuItem className="group text-gray-300 hover:bg-gray-700/50 hover:text-white transition-all duration-200 cursor-pointer">
                      <Activity className="mr-3 h-4 w-4 group-hover:text-cyan-400 transition-colors" />
                      <div className="flex flex-col">
                        <span>Activity</span>
                        <span className="text-xs text-gray-500 group-hover:text-cyan-500">
                          Recent simulations
                        </span>
                      </div>
                    </DropdownMenuItem>

                    <DropdownMenuItem className="group text-gray-300 hover:bg-gray-700/50 hover:text-white transition-all duration-200 cursor-pointer">
                      <Settings className="mr-3 h-4 w-4 group-hover:text-purple-400 transition-colors" />
                      <span>Settings</span>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator className="bg-gray-700/50" />

                    <DropdownMenuItem
                      className="group text-red-400 hover:bg-red-900/30 hover:text-red-300 transition-all duration-200 cursor-pointer"
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-3 h-4 w-4 group-hover:animate-pulse" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center space-x-2 sm:space-x-3">
                <Link to="/signin">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200 text-sm"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white border-0 shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 hover:scale-105 text-sm"
                  >
                    <Sparkles className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">Get Started</span>
                    <span className="sm:hidden">Start</span>
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
