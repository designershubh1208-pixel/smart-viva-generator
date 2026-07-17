"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Mail, Shield, Bell, Key, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Settings</h1>
        <p className="text-muted-foreground text-lg">Manage your account settings and preferences.</p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Settings Sidebar Nav */}
        <aside className="w-full md:w-64 shrink-0">
          <nav className="flex flex-row md:flex-col gap-1 overflow-x-auto pb-4 md:pb-0">
            <button 
              onClick={() => setActiveTab("profile")}
              className={cn("flex items-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap", activeTab === "profile" ? "bg-primary text-primary-foreground shadow-md" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground")}
            >
              <User className="w-4 h-4" />
              <span>Profile</span>
            </button>
            <button 
              onClick={() => setActiveTab("security")}
              className={cn("flex items-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap", activeTab === "security" ? "bg-primary text-primary-foreground shadow-md" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground")}
            >
              <Shield className="w-4 h-4" />
              <span>Security</span>
            </button>
            <button 
              onClick={() => setActiveTab("notifications")}
              className={cn("flex items-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap", activeTab === "notifications" ? "bg-primary text-primary-foreground shadow-md" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground")}
            >
              <Bell className="w-4 h-4" />
              <span>Notifications</span>
            </button>
          </nav>
        </aside>

        {/* Settings Content */}
        <div className="flex-1 space-y-6">
          {activeTab === "profile" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <Card className="border-border/50 shadow-sm">
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Update your personal information and email address.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold flex items-center">
                      <User className="w-4 h-4 mr-2 text-primary" />
                      Display Name
                    </label>
                    <input 
                      className="flex h-11 w-full rounded-lg border border-input bg-background/50 px-4 py-2 text-sm transition-all focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none" 
                      defaultValue="John Doe" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold flex items-center">
                      <Mail className="w-4 h-4 mr-2 text-primary" />
                      Email Address
                    </label>
                    <input 
                      className="flex h-11 w-full rounded-lg border border-input bg-background/50 px-4 py-2 text-sm transition-all focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none" 
                      defaultValue="john@university.edu" 
                    />
                  </div>
                </CardContent>
                <CardFooter className="bg-muted/30 px-6 py-4 border-t border-border/50 flex justify-end">
                  <Button size="lg" className="px-8 shadow-sm">Save Changes</Button>
                </CardFooter>
              </Card>
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <Card className="border-border/50 shadow-sm">
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>Ensure your account is using a long, random password to stay secure.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Current Password</label>
                    <input 
                      type="password"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">New Password</label>
                    <input 
                      type="password"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none" 
                    />
                  </div>
                </CardContent>
                <CardFooter className="bg-muted/30 px-6 py-4 border-t border-border/50 flex justify-end">
                  <Button>Update Password</Button>
                </CardFooter>
              </Card>

              <Card className="border-destructive/20 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-destructive">Danger Zone</CardTitle>
                  <CardDescription>Permanently delete your account and all associated data.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                  <Button variant="destructive" className="flex items-center">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Account
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <Card className="border-border/50 shadow-sm">
                <CardHeader>
                  <CardTitle>Email Notifications</CardTitle>
                  <CardDescription>Choose what updates you want to receive.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <h4 className="text-sm font-medium">Weekly Reports</h4>
                      <p className="text-xs text-muted-foreground">Receive a summary of your mock viva performance.</p>
                    </div>
                    <div className="h-6 w-11 rounded-full bg-primary relative cursor-pointer shadow-inner">
                      <div className="absolute right-1 top-1 h-4 w-4 rounded-full bg-white shadow-sm" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <h4 className="text-sm font-medium">New Feature Announcements</h4>
                      <p className="text-xs text-muted-foreground">Stay up to date with new AI capabilities.</p>
                    </div>
                    <div className="h-6 w-11 rounded-full bg-primary relative cursor-pointer shadow-inner">
                      <div className="absolute right-1 top-1 h-4 w-4 rounded-full bg-white shadow-sm" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <h4 className="text-sm font-medium">Marketing Emails</h4>
                      <p className="text-xs text-muted-foreground">Receive offers and promotions.</p>
                    </div>
                    <div className="h-6 w-11 rounded-full bg-muted relative cursor-pointer shadow-inner border border-input">
                      <div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow-sm border border-muted" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
