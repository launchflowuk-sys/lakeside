import { useState } from "react";
import { useLocation } from "wouter";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import AddressAutocomplete from "@/components/AddressAutocomplete";
import { useSubmitLead } from "@workspace/api-client-react";
import {
  Car, Plane, GraduationCap, Briefcase, Anchor, Users, CheckCircle2,
  ArrowRight, ArrowLeft, ChevronRight, CalendarDays, Clock
} from "lucide-react";

function formatDateDisplay(value?: string): string {
  if (!value) return "";
  const d = new Date(`${value}T00:00:00`);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function formatTimeDisplay(value?: string): string {
  if (!value) return "";
  const [h, m] = value.split(":").map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return value;
  const period = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, "0")} ${period}`;
}

const FIELD_CLASS = "mt-1.5 h-12 px-4 text-base rounded-[6px] border-2 border-foreground/15 bg-transparent shadow-none transition-colors placeholder:text-muted-foreground/60 focus-visible:border-primary focus-visible:ring-0 hover:border-foreground/30";
const TEXTAREA_CLASS = "mt-1.5 min-h-[100px] px-4 py-3 text-base rounded-[6px] border-2 border-foreground/15 bg-transparent shadow-none transition-colors placeholder:text-muted-foreground/60 focus-visible:border-primary focus-visible:ring-0 hover:border-foreground/30 resize-none";
const DATETIME_BOX_CLASS = "flex h-12 w-full items-center gap-2.5 rounded-[6px] border-2 border-foreground/15 bg-transparent px-4 text-base shadow-none transition-colors has-[+input:focus]:border-primary";
const FIELD_LABEL_CLASS = "text-sm font-semibold tracking-tight text-foreground/85";

const step1Schema = z.object({
  journeyType: z.enum(["local", "airport", "school_run", "corporate", "cruise_terminal", "other"]),
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
  { value: "local",            label: "Local Taxi",        icon: Car,          desc: "Grays, Purfleet, Thurrock area",          bg: null },
  { value: "airport",          label: "Airport Transfer",  icon: Plane,        desc: "Heathrow, Gatwick, Stansted & more",      bg: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=600&q=80" },
  { value: "school_run",       label: "School Run",        icon: GraduationCap, desc: "Regular or one-off school runs",         bg: null },
  { value: "corporate",        label: "Corporate Travel",  icon: Briefcase,    desc: "Business accounts welcome",               bg: null },
  { value: "cruise_terminal",  label: "Cruise Terminal",   icon: Anchor,       desc: "Tilbury Cruise Terminal transfers",       bg: "/images/cruise-taxis.webp" },
  { value: "other",            label: "Other",             icon: Car,          desc: "Any other journey",                       bg: null },
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
    <div className={`bg-card text-card-foreground border border-border rounded-xl overflow-hidden ${compact ? "" : "shadow-2xl"}`} style={{ colorScheme: "light" }} data-testid="booking-form">
      {/* Progress — simple bar, not a software wizard */}
      <div className="bg-muted px-5 pt-3 pb-3">
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
                const featured = !!jt.bg;
                return (
                  <button
                    key={jt.value}
                    type="button"
                    onClick={() => step1Form.setValue("journeyType", jt.value as Step1Data["journeyType"])}
                    data-testid={`journey-type-${jt.value}`}
                    className={`text-left rounded-lg border-2 transition-all overflow-hidden relative ${
                      featured ? "min-h-[88px]" : "p-3"
                    } ${
                      selected
                        ? "border-primary"
                        : featured
                          ? "border-transparent hover:border-primary/60"
                          : "border-border hover:border-primary/50"
                    }`}
                    style={featured ? {
                      backgroundImage: `linear-gradient(135deg, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.38) 100%), url('${jt.bg}')`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    } : undefined}
                  >
                    {featured && selected && (
                      <span className="absolute inset-0 rounded-[6px] ring-2 ring-primary pointer-events-none" />
                    )}
                    <span className={`flex flex-col h-full ${featured ? "p-3" : ""}`}>
                      <Icon className={`w-5 h-5 mb-1.5 flex-shrink-0 ${
                        featured ? "text-primary" : selected ? "text-primary" : "text-muted-foreground"
                      }`} />
                      <span className={`text-sm font-semibold leading-tight ${
                        featured ? "text-white" : selected ? "text-primary" : "text-foreground"
                      }`}>
                        {jt.label}
                      </span>
                      <span className={`text-xs mt-0.5 leading-snug ${
                        featured ? "text-white/70" : "text-muted-foreground"
                      }`}>
                        {jt.desc}
                      </span>
                    </span>
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
              <Label htmlFor="pickup" className={FIELD_LABEL_CLASS}>Pickup location *</Label>
              <Controller
                name="pickupLocation"
                control={step2Form.control}
                render={({ field }) => (
                  <AddressAutocomplete
                    id="pickup"
                    value={field.value}
                    onValueChange={field.onChange}
                    onBlur={field.onBlur}
                    placeholder="e.g. 12 High Street, Grays"
                    className={FIELD_CLASS}
                    data-testid="input-pickup"
                  />
                )}
              />
              {step2Form.formState.errors.pickupLocation && (
                <p className="text-destructive text-xs mt-1">{step2Form.formState.errors.pickupLocation.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="destination" className={FIELD_LABEL_CLASS}>Destination *</Label>
              <Controller
                name="destination"
                control={step2Form.control}
                render={({ field }) => (
                  <AddressAutocomplete
                    id="destination"
                    value={field.value}
                    onValueChange={field.onChange}
                    onBlur={field.onBlur}
                    placeholder="e.g. Heathrow Terminal 5"
                    className={FIELD_CLASS}
                    data-testid="input-destination"
                  />
                )}
              />
              {step2Form.formState.errors.destination && (
                <p className="text-destructive text-xs mt-1">{step2Form.formState.errors.destination.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="via" className={FIELD_LABEL_CLASS}>Via stops (optional)</Label>
              <Input
                id="via"
                {...step2Form.register("viaStops")}
                placeholder="Any additional stops"
                className={FIELD_CLASS}
                data-testid="input-via"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="min-w-0">
                <Label htmlFor="date" className={FIELD_LABEL_CLASS}>Journey date *</Label>
                <div className="relative mt-1">
                  <div className={DATETIME_BOX_CLASS}>
                    <CalendarDays className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    <span className={step2Form.watch("journeyDate") ? "text-foreground" : "text-muted-foreground"}>
                      {formatDateDisplay(step2Form.watch("journeyDate")) || "Select date"}
                    </span>
                  </div>
                  <Input
                    id="date"
                    type="date"
                    {...step2Form.register("journeyDate")}
                    className="absolute inset-0 h-full w-full opacity-0"
                    data-testid="input-date"
                  />
                </div>
                {step2Form.formState.errors.journeyDate && (
                  <p className="text-destructive text-xs mt-1">Required</p>
                )}
              </div>
              <div className="min-w-0">
                <Label htmlFor="time" className={FIELD_LABEL_CLASS}>Journey time *</Label>
                <div className="relative mt-1">
                  <div className={DATETIME_BOX_CLASS}>
                    <Clock className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    <span className={step2Form.watch("journeyTime") ? "text-foreground" : "text-muted-foreground"}>
                      {formatTimeDisplay(step2Form.watch("journeyTime")) || "Select time"}
                    </span>
                  </div>
                  <Input
                    id="time"
                    type="time"
                    {...step2Form.register("journeyTime")}
                    className="absolute inset-0 h-full w-full opacity-0"
                    data-testid="input-time"
                  />
                </div>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-6">
                <div className="min-w-0">
                  <Label htmlFor="returnDate" className={FIELD_LABEL_CLASS}>Return date</Label>
                  <div className="relative mt-1">
                    <div className={DATETIME_BOX_CLASS}>
                      <CalendarDays className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                      <span className={step2Form.watch("returnDate") ? "text-foreground" : "text-muted-foreground"}>
                        {formatDateDisplay(step2Form.watch("returnDate")) || "Select date"}
                      </span>
                    </div>
                    <Input
                      id="returnDate"
                      type="date"
                      {...step2Form.register("returnDate")}
                      className="absolute inset-0 h-full w-full opacity-0"
                      data-testid="input-return-date"
                    />
                  </div>
                </div>
                <div className="min-w-0">
                  <Label htmlFor="returnTime" className={FIELD_LABEL_CLASS}>Return time</Label>
                  <div className="relative mt-1">
                    <div className={DATETIME_BOX_CLASS}>
                      <Clock className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                      <span className={step2Form.watch("returnTime") ? "text-foreground" : "text-muted-foreground"}>
                        {formatTimeDisplay(step2Form.watch("returnTime")) || "Select time"}
                      </span>
                    </div>
                    <Input
                      id="returnTime"
                      type="time"
                      {...step2Form.register("returnTime")}
                      className="absolute inset-0 h-full w-full opacity-0"
                      data-testid="input-return-time"
                    />
                  </div>
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
              <Label htmlFor="passengers" className={FIELD_LABEL_CLASS}>Number of passengers *</Label>
              <Input
                id="passengers"
                type="number"
                min={1}
                max={16}
                {...step3Form.register("passengers")}
                className={FIELD_CLASS}
                data-testid="input-passengers"
              />
            </div>
            <div>
              <Label htmlFor="luggage" className={FIELD_LABEL_CLASS}>Luggage details (optional)</Label>
              <Input
                id="luggage"
                {...step3Form.register("luggage")}
                placeholder="e.g. 2 large suitcases, 1 carry-on"
                className={FIELD_CLASS}
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
              <Label htmlFor="accessibility" className={FIELD_LABEL_CLASS}>Accessibility requirements (optional)</Label>
              <Input
                id="accessibility"
                {...step3Form.register("accessibilityRequirements")}
                placeholder="e.g. wheelchair accessible vehicle"
                className={FIELD_CLASS}
                data-testid="input-accessibility"
              />
            </div>
            <div>
              <Label htmlFor="notes" className={FIELD_LABEL_CLASS}>Additional notes (optional)</Label>
              <Textarea
                id="notes"
                {...step3Form.register("additionalNotes")}
                placeholder="Any other information for the driver"
                className={TEXTAREA_CLASS}
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
              <Label htmlFor="fullName" className={FIELD_LABEL_CLASS}>Full name *</Label>
              <Input
                id="fullName"
                {...step4Form.register("fullName")}
                placeholder="Your full name"
                className={FIELD_CLASS}
                data-testid="input-full-name"
              />
              {step4Form.formState.errors.fullName && (
                <p className="text-destructive text-xs mt-1">{step4Form.formState.errors.fullName.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="mobile" className={FIELD_LABEL_CLASS}>Mobile number *</Label>
              <Input
                id="mobile"
                type="tel"
                {...step4Form.register("mobile")}
                placeholder="e.g. 07700 000000"
                className={FIELD_CLASS}
                data-testid="input-mobile"
              />
              {step4Form.formState.errors.mobile && (
                <p className="text-destructive text-xs mt-1">{step4Form.formState.errors.mobile.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="email" className={FIELD_LABEL_CLASS}>Email address *</Label>
              <Input
                id="email"
                type="email"
                {...step4Form.register("email")}
                placeholder="your@email.com"
                className={FIELD_CLASS}
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
