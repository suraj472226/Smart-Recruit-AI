
import { FC } from 'react';
import { Search, BellDot, Settings, Moon, Sun, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from 'react-router-dom';
import React from 'react';

interface HeaderProps {
  currentJobTitle?: string;
  isDarkMode?: boolean;
  toggleDarkMode?: () => void;
}

const Header: FC<HeaderProps> = ({ 
  currentJobTitle = "Upload a Job Description", 
  isDarkMode = false,
  toggleDarkMode = () => {}
}) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleNotificationClick = () => {
    toast({
      title: "No new notifications",
      description: "You're all caught up!",
    });
  };


  return (
    <header className="border-b border-border bg-background py-4 px-6 flex items-center justify-between">
      <div>
        <h1 className="text-xl font-semibold text-foreground">{currentJobTitle}</h1>
      </div>
      
      <div className="flex items-center space-x-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="pl-10 pr-4 py-2 border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-input w-64"
          />
        </div>
        
        <Button variant="ghost" size="icon" onClick={handleHelpClick}>
          <HelpCircle className="h-5 w-5" />
        </Button>
        
        <Button variant="ghost" size="icon" onClick={handleNotificationClick}>
          <BellDot className="h-5 w-5" />
        </Button>
        
        <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
          {isDarkMode ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>
        
        <Button variant="ghost" size="icon" onClick={handleSettingsClick}>
          <Settings className="h-5 w-5" />
        </Button>
        
        <div className="w-px h-6 bg-border mx-2" />
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center cursor-pointer">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white font-medium">
                HR
              </div>
              <div className="ml-2">
                <p className="text-sm font-medium">Recruiter</p>
                <p className="text-xs text-muted-foreground">XYZ</p>
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/settings')}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <BellDot className="mr-2 h-4 w-4" />
              <span>Notifications</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;