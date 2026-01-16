"use client";

import { X, Cpu, HardDrive, Zap, Trash2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import type { Node } from "@xyflow/react";

// Mock Database of Installable Software
const SOFTWARE_CATALOG = [
  { id: "nginx", name: "Nginx Web Server", ramCost: 1, cpuCost: 1, type: "SERVICE" },
  { id: "nodejs", name: "Node.js Runtime", ramCost: 2, cpuCost: 2, type: "RUNTIME" },
  { id: "postgres", name: "PostgreSQL DB", ramCost: 4, cpuCost: 3, type: "DB" },
  { id: "redis", name: "Redis Cache", ramCost: 2, cpuCost: 1, type: "CACHE" },
];

interface RightPanelProps {
  selectedNode: Node | null;
  onClose: () => void;
  onUpdateNode: (nodeId: string, data: any) => void;
}

export default function RightPanel({ selectedNode, onClose, onUpdateNode }: RightPanelProps) {
  if (!selectedNode) return null;

  // Helper to safely access data properties
  const { label } = selectedNode.data as { label: string };
  const cpuLevel = (selectedNode.data.cpuLevel as number) || 1;
  const ramLevel = (selectedNode.data.ramLevel as number) || 2;
  const installedSoftware = (selectedNode.data.software as string[]) || [];

  const handleUpgrade = (stat: "cpuLevel" | "ramLevel") => {
    const currentVal = selectedNode.data[stat] as number || 1;
    onUpdateNode(selectedNode.id, { [stat]: currentVal + 1 });
  };

  const handleInstall = (softwareId: string) => {
    if (installedSoftware.includes(softwareId)) return;
    onUpdateNode(selectedNode.id, { 
      software: [...installedSoftware, softwareId] 
    });
  };

  const handleUninstall = (softwareId: string) => {
    onUpdateNode(selectedNode.id, { 
      software: installedSoftware.filter(id => id !== softwareId) 
    });
  };

  return (
    <aside className="absolute right-4 top-4 bottom-4 w-80 bg-background border rounded-xl shadow-2xl flex flex-col z-50 overflow-hidden">
      {/* HEADER */}
      <div className="p-4 border-b flex items-center justify-between bg-muted/30">
        <div>
          <h2 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Configuration</h2>
          <p className="text-lg font-semibold">{label}</p>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* CONTENT */}
      <div className="flex-1 overflow-hidden">
        <Tabs defaultValue="hardware" className="h-full flex flex-col">
          <div className="px-4 pt-4">
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="hardware">Hardware</TabsTrigger>
              <TabsTrigger value="software">Software</TabsTrigger>
            </TabsList>
          </div>

          {/* TAB: HARDWARE */}
          <TabsContent value="hardware" className="flex-1 p-4 space-y-6 overflow-y-auto">
            
            {/* CPU Upgrade Card */}
            <div className="space-y-3 p-3 border rounded-lg bg-card">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-blue-500/10 rounded-md text-blue-500">
                    <Cpu className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">vCPU Cores</p>
                    <p className="text-xs text-muted-foreground">Level {cpuLevel}</p>
                  </div>
                </div>
                <Badge variant="outline">{cpuLevel} Core</Badge>
              </div>
              <Button 
                variant="secondary" 
                className="w-full text-xs" 
                onClick={() => handleUpgrade("cpuLevel")}
              >
                Upgrade ($100) <Zap className="ml-2 h-3 w-3 fill-yellow-500 text-yellow-500" />
              </Button>
            </div>

            {/* RAM Upgrade Card */}
            <div className="space-y-3 p-3 border rounded-lg bg-card">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-purple-500/10 rounded-md text-purple-500">
                    <HardDrive className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">RAM Memory</p>
                    <p className="text-xs text-muted-foreground">Level {ramLevel}</p>
                  </div>
                </div>
                <Badge variant="outline">{ramLevel * 2} GB</Badge>
              </div>
              <Button 
                variant="secondary" 
                className="w-full text-xs"
                onClick={() => handleUpgrade("ramLevel")}
              >
                Upgrade ($50) <Zap className="ml-2 h-3 w-3 fill-yellow-500 text-yellow-500" />
              </Button>
            </div>

            <div className="p-4 bg-muted/50 rounded-lg text-xs text-muted-foreground border-l-2 border-yellow-500">
              Tip: Higher CPU allows more concurrent requests. Higher RAM allows heavier software (Databases).
            </div>
          </TabsContent>

          {/* TAB: SOFTWARE */}
          <TabsContent value="software" className="flex-1 p-0 overflow-hidden flex flex-col">
             <ScrollArea className="flex-1">
               <div className="p-4 space-y-4">
                 
                 {/* Installed List */}
                 {installedSoftware.length > 0 && (
                   <div className="space-y-2 mb-6">
                     <h3 className="text-xs font-semibold text-muted-foreground uppercase">Installed</h3>
                     {installedSoftware.map(appId => {
                        const app = SOFTWARE_CATALOG.find(s => s.id === appId);
                        return (
                          <div key={appId} className="flex items-center justify-between p-2 rounded-md bg-green-500/10 border border-green-500/20">
                            <span className="text-sm font-medium">{app?.name || appId}</span>
                            <Button variant="ghost" size="icon" className="h-6 w-6 text-red-500 hover:text-red-600" onClick={() => handleUninstall(appId)}>
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        )
                     })}
                   </div>
                 )}

                 <Separator />
                 
                 {/* Catalog */}
                 <h3 className="text-xs font-semibold text-muted-foreground uppercase mt-4 mb-2">Available Catalog</h3>
                 <div className="grid gap-2">
                    {SOFTWARE_CATALOG.map(app => {
                      const isInstalled = installedSoftware.includes(app.id);
                      return (
                        <div key={app.id} className="flex flex-col p-3 border rounded-lg bg-card hover:border-primary/50 transition-colors">
                           <div className="flex justify-between items-start mb-2">
                             <span className="font-medium text-sm">{app.name}</span>
                             <Badge variant="secondary" className="text-[10px] h-5">{app.type}</Badge>
                           </div>
                           <div className="flex justify-between items-center mt-2">
                              <div className="text-xs text-muted-foreground space-x-2">
                                <span>CPU: {app.cpuCost}</span>
                                <span>RAM: {app.ramCost}GB</span>
                              </div>
                              <Button 
                                size="sm" 
                                variant={isInstalled ? "outline" : "default"}
                                className="h-7 text-xs"
                                disabled={isInstalled}
                                onClick={() => handleInstall(app.id)}
                              >
                                {isInstalled ? "Installed" : "Install"}
                              </Button>
                           </div>
                        </div>
                      )
                    })}
                 </div>

               </div>
             </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </aside>
  );
}