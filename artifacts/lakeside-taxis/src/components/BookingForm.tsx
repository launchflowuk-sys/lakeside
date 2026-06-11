import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSubmitLead } from "@workspace/api-client-react";
import {
  Car, Plane, GraduationCap, Briefcase, MapPin, Users, CheckCircle2,
  ArrowRight, ArrowLeft, ChevronRight
} from "lucide-react";

const step1Schema = z.object({
  journeyType: z.enum(["local", "airport", "school_run", "corporate", "long_distance", "other"]),
});
const step2Schema = z.object({
  pickupLocation: z.string().min(2, "Required"),
  destination: z.string().min(2, "Required"),
  viaStops: z.string().optional(),
  journeyDate: z.string().min(1, "Required"),
  journeyTime: z.string().min(1, "Required"),
  returnRequired: z.boolean(),
  returnDate: z.string().optional(),
  returnTime: z.string().optional(),
});
const step3Schema = z.object({
  passengers: z.coerce.number().int().min(1).max(16),
  luggage: z.string().optional(),
  childSeatsRequired: z.boolean(),
  accessibilityRequirements: z.string().optional(),
  additionalNotes: z.string().optional(),
});
const step4Schema = z.object({
  fullName: z.string().min(2, "Required"),
  mobile: z.string().min(7, "Required"),
  email: z.string().email("Invalid email"),
  preferredContactMethod: z.enum(["phone", "whatsapp", "email"]),
});

type Step1Data = z.infer<typeof step1Schema>;
type Step2Data = z.infer<typeof step2Schema>;
type Step3Data = z.infer<typeof step3Schema>;
type Step4Data = z.infer<typeof step4Schema>;

type FormData = Step1Data & Step2Data & Step3Data & Step4Data;

const journeyTypes = [
  { value: "local", label: "Local Taxi", icon: Car, desc: "Grays, Purfleet, Thurrock area" },
  { value: "airport", label: "Airport Transfer", icon: Plane, desc: "Heathrow, Gatwick, Stansted & more" },
  { value: "school_run", label: "School Run", icon: GraduationCap, desc: "Regular or one-off school runs" },
  { value: "corporate", label: "Corporate Travel", icon: Briefcase, desc: "Business accounts welcome" },
  { value: "long_distance", label: "Long Distance", icon: MapPin, desc: "UK-wide journeys" },
  { value: "other", label: "Other", icon: Car, desc: "Any other journey" },
];

const contactMethods = [
  { value: "phone", label: "Phone Call" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "email", label: "Email" },
];

export default function BookingForm({ compact = false }: { compact?: boolean }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<FormData>>({
    returnRequired: false,
    childSeatsRequired: false,
    passengers: 1,
    preferredContactMethod: "phone",
  });
  const [, setLocation] = useLocation();
  const submitLead = useSubmitLead();

  const step1Form = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    defaultValues: { journeyType: formData.journeyType },
  });
  const step2Form = useForm<Step2Data>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      pickupLocation: formData.pickupLocation ?? "",
      destination: formData.destination ?? "",
      viaStops: formData.viaStops ?? "",
      journeyDate: formData.journeyDate ?? "",
      journeyTime: formData.journeyTime ?? "",
      returnRequired: formData.returnRequired ?? false,
      returnDate: formData.returnDate ?? "",
      returnTime: formData.returnTime ?? "",
    },
  });
  const step3Form = useForm<Step3Data>({
    resolver: zodResolver(step3Schema),
    defaultValues: {
      passengers: formData.passengers ?? 1,
      luggage: formData.luggage ?? "",
      childSeatsRequired: formData.childSeatsRequired ?? false,
      accessibilityRequirements: formData.accessibilityRequirements ?? "",
      additionalNotes: formData.additionalNotes ?? "",
    },
  });
  const step4Form = useForm<Step4Data>({
    resolver: zodResolver(step4Schema),
    defaultValues: {
      fullName: formData.fullName ?? "",
      mobile: formData.mobile ?? "",
      email: formData.email ?? "",
      preferredContactMethod: formData.preferredContactMethod ?? "phone",
    },
  });

  const handleStep1 = step1Form.handleSubmit((data) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setStep(2);
  });
  const handleStep2 = step2Form.handleSubmit((data) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setStep(3);
  });
  const handleStep3 = step3Form.handleSubmit((data) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setStep(4);
  });
  const handleStep4 = step4Form.handleSubmit((data) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setStep(5);
  });

  const handleSubmit = async () => {
    const data = { ...formData } as FormData;
    submitLead.mutate(
      {
        data: {
          journeyType: data.journeyType,
          pickupLocation: data.pickupLocation,
          destination: data.destination,
          viaStops: data.viaStops || null,
          journeyDate: data.journeyDate,
          journeyTime: data.journeyTime,
          returnRequired: data.returnRequired ?? false,
          returnDate: data.returnDate || null,
          returnTime: data.returnTime || null,
          passengers: data.passengers,
          luggage: data.luggage || null,
          childSeatsRequired: data.childSeatsRequired ?? false,
          accessibilityRequirements: data.accessibilityRequirements || null,
          additionalNotes: data.additionalNotes || null,
          fullName: data.fullName,
          mobile: data.mobile,
          email: data.email,
          preferredContactMethod: data.preferredContactMethod,
        },
      },
      {
        onSuccess: () => setLocation("/thank-you"),
        onError: () => {},
      }
    );
  };

  const journeyTypeLabel = journeyTypes.find((j) => j.value === formData.journeyType)?.label;
  const returnRequired = step2Form.watch("returnRequired");

  const stepTitles = [
    "Journey Type",
    "Journey Details",
    "Passengers",
    "Your Details",
    "Review & Submit",
  ];

  return (
    <div className={`bg-card border border-border rounded-xl overflow-hidden ${compact ? "" : "shadow-2xl"}`} data-testid="booking-form">
      {/* Progress — simple bar, not a software wizard */}
      <div className="bg-[hsl(220_25%_5%)] px-5 pt-3 pb-3">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold text-foreground/80 tracking-wide">
            {stepTitles[step - 1]}
          </p>
          <p className="text-xs text-muted-foreground">{step} of 5</p>
        </div>
        <div className="h-1 bg-border/60 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>
      </div>

      <div className="p-6">
        {/* Step 1: Journey Type */}
        {step === 1 && (
          <form onSubmit={handleStep1}>
            <h3 className="font-display font-bold text-lg text-foreground mb-4">What type of journey?</h3>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {journeyTypes.map((jt) => {
                const Icon = jt.icon;
                const selected = step1Form.watch("journeyType") === jt.value;
                return (
                  <button
                    key={jt.value}
                    type="button"
                    className={`text-left p-3 rounded-lg border-2 transition-all ${
                      selected
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => step1Form.setValue("journeyType", jt.value as Step1Data["journeyType"])}
                    data-testid={`journey-type-${jt.value}`}
                  >
                    <Icon className={`w-5 h-5 mb-1.5 ${selected ? "text-primary" : "text-muted-foreground"}`} />
                    <div className={`text-sm font-semibold ${selected ? "text-primary" : "text-foreground"}`}>
                      {jt.label}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">{jt.desc}</div>
                  </button>
                );
              })}
            </div>
            {step1Form.formState.errors.journeyType && (
              <p className="text-destructive text-xs mb-3">Please select a journey type</p>
            )}
            <Button type="submit" className="w-full bg-primary text-primary-foreground font-semibold" data-testid="step1-next">
              Continue <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </form>
        )}

        {/* Step 2: Journey Details */}
        {step === 2 && (
          <form onSubmit={handleStep2} className="space-y-4">
            <h3 className="font-display font-bold text-lg text-foreground mb-2">Journey details</h3>
            <div>
              <Label htmlFor="pickup">Pickup location *</Label>
              <Input
                id="pickup"
                {...step2Form.register("pickupLocation")}
                placeholder="e.g. 12 High Street, Grays"
                className="mt-1"
                data-testid="input-pickup"
              />
              {step2Form.formState.errors.pickupLocation && (
                <p className="text-destructive text-xs mt-1">{step2Form.formState.errors.pickupLocation.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="destination">Destination *</Label>
              <Input
                id="destination"
                {...step2Form.register("destination")}
                placeholder="e.g. Heathrow Terminal 5"
                className="mt-1"
                data-testid="input-destination"
              />
              {step2Form.formState.errors.destination && (
                <p className="text-destructive text-xs mt-1">{step2Form.formState.errors.destination.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="via">Via stops (optional)</Label>
              <Input
                id="via"
                {...step2Form.register("viaStops")}
                placeholder="Any additional stops"
                className="mt-1"
                data-testid="input-via"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="date">Journey date *</Label>
                <Input
                  id="date"
                  type="date"
                  {...step2Form.register("journeyDate")}
                  className="mt-1"
                  data-testid="input-date"
                />
                {step2Form.formState.errors.journeyDate && (
                  <p className="text-destructive text-xs mt-1">Required</p>
                )}
              </div>
              <div>
                <Label htmlFor="time">Journey time *</Label>
                <Input
                  id="time"
                  type="time"
                  {...step2Form.register("journeyTime")}
                  className="mt-1"
                  data-testid="input-time"
                />
                {step2Form.formState.errors.journeyTime && (
                  <p className="text-destructive text-xs mt-1">Required</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="returnRequired"
                {...step2Form.register("returnRequired")}
                className="w-4 h-4 accent-primary"
                data-testid="checkbox-return"
              />
              <Label htmlFor="returnRequired" className="cursor-pointer">Return journey required?</Label>
            </div>
            {returnRequired && (
              <div className="grid grid-cols-2 gap-3 pl-6">
                <div>
                  <Label htmlFor="returnDate">Return date</Label>
                  <Input
                    id="returnDate"
                    type="date"
                    {...step2Form.register("returnDate")}
                    className="mt-1"
                    data-testid="input-return-date"
                  />
                </div>
                <div>
                  <Label htmlFor="returnTime">Return time</Label>
                  <Input
                    id="returnTime"
                    type="time"
                    {...step2Form.register("returnTime")}
                    className="mt-1"
                    data-testid="input-return-time"
                  />
                </div>
              </div>
            )}
            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => setStep(1)} data-testid="step2-back">
                <ArrowLeft className="w-4 h-4 mr-1" /> Back
              </Button>
              <Button type="submit" className="flex-1 bg-primary text-primary-foreground font-semibold" data-testid="step2-next">
                Continue <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </form>
        )}

        {/* Step 3: Passenger Details */}
        {step === 3 && (
          <form onSubmit={handleStep3} className="space-y-4">
            <h3 className="font-display font-bold text-lg text-foreground mb-2">Passengers & requirements</h3>
            <div>
              <Label htmlFor="passengers">Number of passengers *</Label>
              <Input
                id="passengers"
                type="number"
                min={1}
                max={16}
                {...step3Form.register("passengers")}
                className="mt-1"
                data-testid="input-passengers"
              />
            </div>
            <div>
              <Label htmlFor="luggage">Luggage details (optional)</Label>
              <Input
                id="luggage"
                {...step3Form.register("luggage")}
                placeholder="e.g. 2 large suitcases, 1 carry-on"
                className="mt-1"
                data-testid="input-luggage"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="childSeats"
                {...step3Form.register("childSeatsRequired")}
                className="w-4 h-4 accent-primary"
                data-testid="checkbox-child-seats"
              />
              <Label htmlFor="childSeats" className="cursor-pointer">Child seat(s) required?</Label>
            </div>
            <div>
              <Label htmlFor="accessibility">Accessibility requirements (optional)</Label>
              <Input
                id="accessibility"
                {...step3Form.register("accessibilityRequirements")}
                placeholder="e.g. wheelchair accessible vehicle"
                className="mt-1"
                data-testid="input-accessibility"
              />
            </div>
            <div>
              <Label htmlFor="notes">Additional notes (optional)</Label>
              <Textarea
                id="notes"
                {...step3Form.register("additionalNotes")}
                placeholder="Any other information for the driver"
                className="mt-1 resize-none"
                rows={3}
                data-testid="input-notes"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => setStep(2)} data-testid="step3-back">
                <ArrowLeft className="w-4 h-4 mr-1" /> Back
              </Button>
              <Button type="submit" className="flex-1 bg-primary text-primary-foreground font-semibold" data-testid="step3-next">
                Continue <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </form>
        )}

        {/* Step 4: Customer Details */}
        {step === 4 && (
          <form onSubmit={handleStep4} className="space-y-4">
            <h3 className="font-display font-bold text-lg text-foreground mb-2">Your contact details</h3>
            <div>
              <Label htmlFor="fullName">Full name *</Label>
              <Input
                id="fullName"
                {...step4Form.register("fullName")}
                placeholder="Your full name"
                className="mt-1"
                data-testid="input-full-name"
              />
              {step4Form.formState.errors.fullName && (
                <p className="text-destructive text-xs mt-1">{step4Form.formState.errors.fullName.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="mobile">Mobile number *</Label>
              <Input
                id="mobile"
                type="tel"
                {...step4Form.register("mobile")}
                placeholder="e.g. 07700 000000"
                className="mt-1"
                data-testid="input-mobile"
              />
              {step4Form.formState.errors.mobile && (
                <p className="text-destructive text-xs mt-1">{step4Form.formState.errors.mobile.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="email">Email address *</Label>
              <Input
                id="email"
                type="email"
                {...step4Form.register("email")}
                placeholder="your@email.com"
                className="mt-1"
                data-testid="input-email"
              />
              {step4Form.formState.errors.email && (
                <p className="text-destructive text-xs mt-1">{step4Form.formState.errors.email.message}</p>
              )}
            </div>
            <div>
              <Label className="mb-2 block">Preferred contact method *</Label>
              <div className="grid grid-cols-3 gap-2">
                {contactMethods.map((m) => {
                  const selected = step4Form.watch("preferredContactMethod") === m.value;
                  return (
                    <button
                      key={m.value}
                      type="button"
                      className={`py-2 px-3 text-sm rounded-lg border-2 font-medium transition-all ${
                        selected ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-primary/50 text-foreground/80"
                      }`}
                      onClick={() => step4Form.setValue("preferredContactMethod", m.value as Step4Data["preferredContactMethod"])}
                      data-testid={`contact-method-${m.value}`}
                    >
                      {m.label}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => setStep(3)} data-testid="step4-back">
                <ArrowLeft className="w-4 h-4 mr-1" /> Back
              </Button>
              <Button type="submit" className="flex-1 bg-primary text-primary-foreground font-semibold" data-testid="step4-next">
                Review <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </form>
        )}

        {/* Step 5: Review & Submit */}
        {step === 5 && (
          <div className="space-y-4">
            <h3 className="font-display font-bold text-lg text-foreground mb-2">Review your request</h3>
            <div className="space-y-3 bg-muted/30 rounded-lg p-4 text-sm" data-testid="review-summary">
              <div className="grid grid-cols-2 gap-1">
                <span className="text-muted-foreground">Journey type</span>
                <span className="font-medium">{journeyTypeLabel}</span>
                <span className="text-muted-foreground">From</span>
                <span className="font-medium">{formData.pickupLocation}</span>
                <span className="text-muted-foreground">To</span>
                <span className="font-medium">{formData.destination}</span>
                {formData.viaStops && <>
                  <span className="text-muted-foreground">Via</span>
                  <span className="font-medium">{formData.viaStops}</span>
                </>}
                <span className="text-muted-foreground">Date</span>
                <span className="font-medium">{formData.journeyDate}</span>
                <span className="text-muted-foreground">Time</span>
                <span className="font-medium">{formData.journeyTime}</span>
                {formData.returnRequired && <>
                  <span className="text-muted-foreground">Return</span>
                  <span className="font-medium">{formData.returnDate} at {formData.returnTime}</span>
                </>}
                <span className="text-muted-foreground">Passengers</span>
                <span className="font-medium">{formData.passengers}</span>
                {formData.luggage && <>
                  <span className="text-muted-foreground">Luggage</span>
                  <span className="font-medium">{formData.luggage}</span>
                </>}
                <span className="text-muted-foreground">Child seats</span>
                <span className="font-medium">{formData.childSeatsRequired ? "Yes" : "No"}</span>
              </div>
              <div className="border-t border-border pt-3 grid grid-cols-2 gap-1">
                <span className="text-muted-foreground">Name</span>
                <span className="font-medium">{formData.fullName}</span>
                <span className="text-muted-foreground">Mobile</span>
                <span className="font-medium">{formData.mobile}</span>
                <span className="text-muted-foreground">Email</span>
                <span className="font-medium">{formData.email}</span>
                <span className="text-muted-foreground">Contact via</span>
                <span className="font-medium capitalize">{formData.preferredContactMethod}</span>
              </div>
            </div>

            <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 text-sm text-foreground/90">
              <p className="font-semibold text-primary mb-1">Important — please read</p>
              <p>This is a booking request, not a confirmed booking. Our team will review your journey details and contact you with price and availability. Your booking is not confirmed until our team contacts you.</p>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              We only use your details to respond to your taxi enquiry. We do not sell your information.
            </p>

            {submitLead.isError && (
              <p className="text-destructive text-sm">Something went wrong. Please try again or call us directly.</p>
            )}

            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => setStep(4)} data-testid="step5-back">
                <ArrowLeft className="w-4 h-4 mr-1" /> Back
              </Button>
              <Button
                type="button"
                className="flex-1 bg-primary text-primary-foreground font-semibold"
                onClick={handleSubmit}
                disabled={submitLead.isPending}
                data-testid="btn-submit-booking"
              >
                {submitLead.isPending ? "Sending..." : "Submit Booking Request"} <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
