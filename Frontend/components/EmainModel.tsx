import { FC, useState, useEffect } from 'react';
import { Check, Copy, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { format, addDays, startOfWeek, addMinutes, isWithinInterval } from 'date-fns';

interface Candidate {
  id: number;
  name: string;
  email: string;
  matchScore: number;
}

interface EmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: Candidate | null;
  jobTitle: string;
}

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
}

interface TimeSlot {
  date: Date;
  formatted: string;
}

// Simulated global store for assigned slots (in a real app, this could be in a context or backend)
let assignedSlots: Date[] = [];

const EmailModal: FC<EmailModalProps> = ({ isOpen, onClose, candidate, jobTitle }) => {
  const [emailContent, setEmailContent] = useState<string>('');
  const [emailSubject, setEmailSubject] = useState<string>('');
  const [isCopied, setIsCopied] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('default');
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const { toast } = useToast();

  // Generate available interview slots
  const generateAvailableSlots = () => {
    const slots: TimeSlot[] = [];
    const startDate = startOfWeek(addDays(new Date(), 7), { weekStartsOn: 1 }); // Next Monday
    const days = 5; // Monday to Friday
    const startHour = 9; // 9 AM
    const endHour = 17; // 5 PM
    const interval = 60; // 1-hour slots

    for (let day = 0; day < days; day++) {
      const currentDay = addDays(startDate, day);
      for (let hour = startHour; hour < endHour; hour++) {
        const slotTime = new Date(currentDay);
        slotTime.setHours(hour, 0, 0, 0);
        // Check if slot is not already assigned
        if (!assignedSlots.some((slot) => slot.getTime() === slotTime.getTime())) {
          const formatted = format(slotTime, "EEEE, MMMM d, yyyy, 'at' h:mm a");
          slots.push({ date: slotTime, formatted });
        }
      }
    }
    return slots;
  };

  // Initialize available slots when modal opens
  useEffect(() => {
    if (isOpen) {
      const slots = generateAvailableSlots();
      setAvailableSlots(slots);
      if (slots.length > 0) {
        setSelectedSlot(slots[0].formatted);
      }
    }
  }, [isOpen]);

  const templates: EmailTemplate[] = [
    {
      id: 'default',
      name: 'Standard Interview Invitation',
      subject: `Interview Invitation: ${jobTitle} Position`,
      content: `Dear {{candidateName}},

I hope this email finds you well. Thank you for your application for the ${jobTitle} position at  .

We were impressed with your background and qualifications, and we would like to invite you to an interview to discuss your application further. Your skills and experience appear to be a strong match for our requirements ({{matchScore}}% match with our criteria).

We have scheduled your interview for {{interviewDate}}. Please confirm if this time works for you, or let us know your availability for an alternative slot.

I look forward to speaking with you soon.

Best regards,
Recruitment Team
 `,
    },
    {
      id: 'technical',
      name: 'Technical Assessment Invitation',
      subject: `Technical Assessment for ${jobTitle} Role`,
      content: `Dear {{candidateName}},

Thank you for applying to the ${jobTitle} position at  . We've reviewed your application and are impressed with your qualifications.

As the next step in our hiring process, we would like to invite you to complete a technical assessment to better evaluate your technical skills relevant to this role. Your profile shows a strong match ({{matchScore}}%) with our requirements.

The assessment will take approximately 90 minutes and will focus on practical problems similar to what you might encounter in this position. You'll receive a separate email with instructions and access to the assessment platform.

Please complete the assessment by {{assessmentDeadline}}. If you have any questions or need accommodations, don't hesitate to reach out.

Best regards,
Technical Hiring Team
 `,
    },
    {
      id: 'followup',
      name: 'Interview Follow-up',
      subject: `Next Steps: ${jobTitle} Position at  `,
      content: `Dear {{candidateName}},

Thank you for taking the time to interview for the ${jobTitle} position at  . We appreciate your interest in joining our team.

We were impressed with your experience and the skills you've demonstrated throughout our selection process. Your profile shows a strong match ({{matchScore}}%) with what we're looking for.

I'm happy to inform you that we would like to move forward with your application. We have scheduled a final interview with our department director for {{interviewDate}}. Please confirm if this time works for you.

Looking forward to speaking with you again soon.

Best regards,
Recruitment Team
 `,
    },
    {
      id: 'offer',
      name: 'Job Offer',
      subject: `Job Offer: ${jobTitle} at  `,
      content: `Dear {{candidateName}},

I am delighted to offer you the position of ${jobTitle} at  . Your impressive background, skills, and interview performance ({{matchScore}}% match score) have convinced us that you would be a valuable addition to our team.

Attached to this email, you will find the formal offer letter with details regarding:
- Compensation and benefits package
- Start date and onboarding process
- Additional employment terms and conditions

To accept this offer, please sign the attached documents and return them to us by {{offerDeadline}}. Once we receive your acceptance, our HR team will contact you with next steps for the onboarding process.

If you have any questions about the offer or need any clarification, please don't hesitate to contact me directly.

Congratulations again! We are excited about the possibility of you joining   and look forward to your positive response.

Best regards,
Recruitment Team
 `,
    },
  ];

  // Generate email content when candidate, template, or slot changes
  useEffect(() => {
    if (candidate && selectedSlot) {
      const selectedTemplateData = templates.find((t) => t.id === selectedTemplate);
      if (selectedTemplateData) {
        const selectedSlotDate = availableSlots.find((slot) => slot.formatted === selectedSlot)?.date;
        const assessmentDeadline = selectedSlotDate
          ? format(addDays(selectedSlotDate, 5), "EEEE, MMMM d, yyyy")
          : '';
        const offerDeadline = selectedSlotDate
          ? format(addDays(selectedSlotDate, 7), "EEEE, MMMM d, yyyy")
          : '';

        let content = selectedTemplateData.content
          .replace('{{candidateName}}', candidate.name)
          .replace('${jobTitle}', jobTitle)
          .replace('{{matchScore}}', candidate.matchScore.toString())
          .replace('{{interviewDate}}', selectedSlot)
          .replace('{{assessmentDeadline}}', assessmentDeadline)
          .replace('{{offerDeadline}}', offerDeadline);

        setEmailContent(content);
        setEmailSubject(selectedTemplateData.subject);
      }
    }
  }, [candidate, jobTitle, selectedTemplate, selectedSlot, availableSlots]);

  const handleCopyToClipboard = () => {
    if (emailContent) {
      navigator.clipboard.writeText(emailContent);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);

      toast({
        title: 'Copied to clipboard',
        description: 'Email content has been copied to clipboard',
        duration: 3000,
      });
    }
  };

  const handleSendEmail = () => {
    if (!selectedSlot) {
      toast({
        title: 'No slot selected',
        description: 'Please select an interview time slot.',
        variant: 'destructive',
      });
      return;
    }

    const selectedSlotDate = availableSlots.find((slot) => slot.formatted === selectedSlot)?.date;
    if (selectedSlotDate) {
      assignedSlots.push(selectedSlotDate); // Mark slot as assigned
      setAvailableSlots(availableSlots.filter((slot) => slot.formatted !== selectedSlot)); // Remove from available
    }

    toast({
      title: 'Email sent successfully',
      description: `An email has been sent to ${candidate?.name} at ${candidate?.email}`,
    });
    onClose();
  };

  const handleTemplateChange = (value: string) => {
    setSelectedTemplate(value);
  };

  const handleSlotChange = (value: string) => {
    setSelectedSlot(value);
  };

  if (!candidate) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[650px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Email to {candidate.name}</DialogTitle>
          <DialogDescription>
            Personalized communication for the {jobTitle} position.
          </DialogDescription>
        </DialogHeader>

        <div className="mb-4">
          <label className="text-sm font-medium mb-2 block">Email Template</label>
          <Select value={selectedTemplate} onValueChange={handleTemplateChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a template" />
            </SelectTrigger>
            <SelectContent>
              {templates.map((template) => (
                <SelectItem key={template.id} value={template.id}>
                  {template.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {(selectedTemplate === 'default' || selectedTemplate === 'followup') && (
          <div className="mb-4">
            <label className="text-sm font-medium mb-2 block">Interview Time Slot</label>
            <Select value={selectedSlot} onValueChange={handleSlotChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a time slot" />
              </SelectTrigger>
              <SelectContent>
                {availableSlots.length > 0 ? (
                  availableSlots.map((slot) => (
                    <SelectItem key={slot.formatted} value={slot.formatted}>
                      {slot.formatted}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="none" disabled>
                    No available slots
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <div className="text-sm text-muted-foreground">
              <span className="font-medium">To:</span> {candidate.email}
            </div>
            <div className="text-sm text-muted-foreground">
              <span className="font-medium">Subject:</span> {emailSubject}
            </div>
          </div>

          <div className="relative">
            <textarea
              value={emailContent}
              onChange={(e) => setEmailContent(e.target.value)}
              className="w-full h-64 p-4 text-sm border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2"
              onClick={handleCopyToClipboard}
            >
              {isCopied ? <Check className="h-4 w-4 text-accent" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <DialogFooter className="flex justify-between mt-4 items-center">
          <div className="text-xs text-muted-foreground">
            AI-generated email based on candidate profile
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSendEmail}>Send Email</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EmailModal;