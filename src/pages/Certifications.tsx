import { useState } from "react";
import { ArrowLeft, Plus, Award, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Certification {
  name: string;
  issuer: string;
  year: string;
}

const Certifications = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading, updateProfile } = useProfile();
  const [isOpen, setIsOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newCert, setNewCert] = useState<Certification>({
    name: "",
    issuer: "",
    year: "",
  });

  // For now, store certifications as skills (simplified approach)
  // In production, you'd want a separate certifications table
  const certifications = profile?.skills?.filter(s => s.includes("Certified")) || [];

  const handleAddCertification = async () => {
    if (!newCert.name) {
      toast.error("Please enter certification name");
      return;
    }

    setSaving(true);
    const certString = `Certified: ${newCert.name}${newCert.issuer ? ` (${newCert.issuer})` : ""}${newCert.year ? ` - ${newCert.year}` : ""}`;
    
    const updatedSkills = [...(profile?.skills || []), certString];
    
    const { error } = await updateProfile({ skills: updatedSkills });
    
    if (error) {
      toast.error("Failed to add certification");
    } else {
      toast.success("Certification added");
      setNewCert({ name: "", issuer: "", year: "" });
      setIsOpen(false);
    }
    
    setSaving(false);
  };

  const handleRemoveCertification = async (cert: string) => {
    setSaving(true);
    const updatedSkills = profile?.skills?.filter(s => s !== cert) || [];
    
    const { error } = await updateProfile({ skills: updatedSkills });
    
    if (error) {
      toast.error("Failed to remove certification");
    } else {
      toast.success("Certification removed");
    }
    
    setSaving(false);
  };

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !profile) {
    navigate("/sign-in");
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="p-2 -ml-2">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-semibold">Certifications</h1>
          </div>
          
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-1" />
                Add
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Certification</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="cert-name">Certification Name</Label>
                  <Input
                    id="cert-name"
                    value={newCert.name}
                    onChange={(e) => setNewCert(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. Master Electrician"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cert-issuer">Issuing Organization</Label>
                  <Input
                    id="cert-issuer"
                    value={newCert.issuer}
                    onChange={(e) => setNewCert(prev => ({ ...prev, issuer: e.target.value }))}
                    placeholder="e.g. State Board"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cert-year">Year Obtained</Label>
                  <Input
                    id="cert-year"
                    value={newCert.year}
                    onChange={(e) => setNewCert(prev => ({ ...prev, year: e.target.value }))}
                    placeholder="e.g. 2023"
                  />
                </div>
                <Button onClick={handleAddCertification} className="w-full" disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Add Certification"
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {certifications.length === 0 ? (
          <div className="text-center py-12">
            <Award className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No certifications added yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Add your professional certifications to build trust
            </p>
          </div>
        ) : (
          certifications.map((cert, index) => (
            <div key={index} className="flex items-center justify-between p-4 border border-border rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <Award className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{cert.replace("Certified: ", "")}</p>
                </div>
              </div>
              <button
                onClick={() => handleRemoveCertification(cert)}
                className="p-2 text-destructive hover:bg-destructive/10 rounded-lg"
                disabled={saving}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Certifications;
