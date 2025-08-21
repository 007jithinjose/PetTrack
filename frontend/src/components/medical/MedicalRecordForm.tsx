// File: src/components/medical/MedicalRecordForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useTreatmentSuggestions } from '@/hooks/useMedicalRecords';
import { PlusIcon, TrashIcon, ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons';
import { useState, useRef, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { z } from 'zod';
import { format } from 'date-fns';

const formSchema = z.object({
  symptoms: z.array(z.string().min(1, 'Symptom is required')).min(1, 'At least one symptom is required'),
  diagnosis: z.string().min(1, 'Diagnosis is required'),
  treatment: z.array(z.string().min(1, 'Treatment is required')).min(1, 'At least one treatment is required'),
  prescribedMedications: z.array(z.string().min(1, 'Medication is required')).optional(),
  notes: z.string().optional(),
  followUpDate: z.string()
    .refine(date => {
      if (!date) return true;
      const selectedDate = new Date(date);
      const now = new Date();
      return selectedDate > now;
    }, 'Follow-up date must be in the future')
    .optional()
});

export type MedicalRecordFormValues = z.infer<typeof formSchema>;

interface TreatmentSuggestion {
  symptom: string;
  possibleDiagnoses: string[];
  recommendedTests: string[];
  suggestedMedications: string[];
  suggestedTreatments: string[];
}

export function MedicalRecordForm({ 
  onSubmit, 
  isLoading,
  appointmentId,
  initialValues
}: { 
  onSubmit: (values: MedicalRecordFormValues & { appointmentId?: string }) => void;
  isLoading: boolean;
  appointmentId?: string;
  initialValues?: Partial<MedicalRecordFormValues>;
}) {
  const [newSymptom, setNewSymptom] = useState('');
  const [newTreatment, setNewTreatment] = useState('');
  const [newMedication, setNewMedication] = useState('');
  const [showDiagnosesDialog, setShowDiagnosesDialog] = useState(false);
  const [showTestsDialog, setShowTestsDialog] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>('symptoms');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  const { 
    mutate: suggestTreatments, 
    data: suggestionsResponse, 
    isPending: isSuggesting 
  } = useTreatmentSuggestions();

  const form = useForm<MedicalRecordFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      symptoms: [],
      diagnosis: '',
      treatment: [],
      prescribedMedications: [],
      notes: '',
      followUpDate: '',
      ...initialValues,
      ...(initialValues?.followUpDate && {
        followUpDate: format(new Date(initialValues.followUpDate), 'yyyy-MM-dd')
      })
    },
  });

  // Extract the actual suggestions data from the response
  const suggestions: TreatmentSuggestion[] = Array.isArray(suggestionsResponse?.data) 
    ? (suggestionsResponse.data as TreatmentSuggestion[]) 
    : [];
  const symptoms = form.watch('symptoms');
  const treatments = form.watch('treatment');
  const medications = form.watch('prescribedMedications');

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [symptoms, treatments, medications]);

  const handleSubmit = (values: MedicalRecordFormValues) => {
    const formattedValues = {
      ...values,
      followUpDate: values.followUpDate ? new Date(values.followUpDate).toISOString() : undefined
    };
    onSubmit({ ...formattedValues, appointmentId });
  };

  const handleSuggestTreatments = () => {
    const symptoms = form.getValues('symptoms');
    if (symptoms.length > 0) {
      suggestTreatments(symptoms);
    } else {
      toast.warning('Please add at least one symptom first');
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleAddItem = (type: 'symptom' | 'treatment' | 'medication') => {
    const value = type === 'symptom' ? newSymptom : 
                  type === 'treatment' ? newTreatment : newMedication;
    
    if (value.trim()) {
      const fieldName = type === 'symptom' ? 'symptoms' : 
                       type === 'treatment' ? 'treatment' : 'prescribedMedications';
      const currentValues = form.getValues(fieldName) || [];
      form.setValue(fieldName as keyof MedicalRecordFormValues, [...currentValues, value.trim()]);
      
      if (type === 'symptom') setNewSymptom('');
      if (type === 'treatment') setNewTreatment('');
      if (type === 'medication') setNewMedication('');
    }
  };

  const handleRemoveItem = (type: 'symptom' | 'treatment' | 'medication', index: number) => {
    const fieldName = type === 'symptom' ? 'symptoms' : 
                     type === 'treatment' ? 'treatment' : 'prescribedMedications';
    const currentValues = form.getValues(fieldName) || [];
    form.setValue(fieldName as keyof MedicalRecordFormValues, currentValues.filter((_, i) => i !== index));
  };

  const handleAddSuggestedItem = (type: 'treatment' | 'medication', value: string) => {
    const fieldName = type === 'treatment' ? 'treatment' : 'prescribedMedications';
    const currentValues = form.getValues(fieldName) || [];
    if (!currentValues.includes(value)) {
      form.setValue(fieldName as keyof MedicalRecordFormValues, [...currentValues, value]);
      toast.success(`${type === 'treatment' ? 'Treatment' : 'Medication'} added`);
    }
  };

  const handleAddAllSuggested = (type: 'treatments' | 'medications') => {
    if (suggestions.length > 0) {
      const fieldName = type === 'treatments' ? 'treatment' : 'prescribedMedications';
      const allItems = suggestions.flatMap(t => 
        type === 'treatments' ? t.suggestedTreatments : t.suggestedMedications
      );
      const uniqueItems = [...new Set(allItems)];
      form.setValue(fieldName as keyof MedicalRecordFormValues, uniqueItems);
      toast.success(`All suggested ${type} added`);
    }
  };

  const handleSetDiagnosis = (diagnosis: string) => {
    form.setValue('diagnosis', diagnosis);
    setShowDiagnosesDialog(false);
    toast.success('Diagnosis added');
  };

  const hasSuggestions = suggestions.length > 0;

  // Get unique diagnoses from all suggestions
  const uniqueDiagnoses = Array.from(new Set(
    suggestions.flatMap(s => s.possibleDiagnoses)
  ));

  // Get unique tests from all suggestions
  const uniqueTests = Array.from(new Set(
    suggestions.flatMap(s => s.recommendedTests)
  ));

  return (
    <DialogContent className="max-w-4xl w-[95vw] h-[95dvh] flex flex-col">
      <DialogHeader className="px-4 pt-4">
        <DialogTitle>{initialValues ? 'Edit Medical Record' : 'Create Medical Record'}</DialogTitle>
        <DialogDescription>
          {initialValues ? 'Update the medical record details' : 'Fill out all required fields to create a new medical record'}
        </DialogDescription>
      </DialogHeader>

      <div className="flex-1 flex flex-col overflow-hidden">
        <ScrollArea ref={scrollAreaRef} className="flex-1 px-4 py-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 pb-4">
              {/* Symptoms Section */}
              <Collapsible 
                open={expandedSection === 'symptoms'} 
                onOpenChange={() => toggleSection('symptoms')}
                className="rounded-lg border p-4"
              >
                <div className="flex items-center justify-between">
                  <CollapsibleTrigger className="flex items-center gap-2">
                    {expandedSection === 'symptoms' ? <ChevronUpIcon /> : <ChevronDownIcon />}
                    <h3 className="text-lg font-semibold">Symptoms</h3>
                  </CollapsibleTrigger>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleSuggestTreatments}
                    disabled={form.watch('symptoms').length === 0 || isSuggesting}
                  >
                    {isSuggesting ? 'Generating...' : 'Suggest Treatments'}
                  </Button>
                </div>
                
                <CollapsibleContent className="mt-4 space-y-4">
                  <div className="flex gap-2">
                    <Input
                      value={newSymptom}
                      onChange={(e) => setNewSymptom(e.target.value)}
                      placeholder="Enter symptom..."
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddItem('symptom'))}
                    />
                    <Button 
                      type="button" 
                      onClick={() => handleAddItem('symptom')}
                      variant="secondary"
                    >
                      <PlusIcon className="h-4 w-4 mr-1" />
                      Add
                    </Button>
                  </div>
                  
                  {form.watch('symptoms').length > 0 && (
                    <div className="bg-muted/50 rounded-lg p-3">
                      <h4 className="text-sm font-medium mb-2">Current Symptoms</h4>
                      <div className="flex flex-wrap gap-2">
                        {form.watch('symptoms').map((symptom, index) => (
                          <Badge key={index} variant="outline" className="flex items-center gap-1 pl-3">
                            {symptom}
                            <button
                              type="button"
                              onClick={() => handleRemoveItem('symptom', index)}
                              className="text-red-500 hover:text-red-700 ml-1"
                              aria-label="Remove symptom"
                            >
                              <TrashIcon className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CollapsibleContent>
              </Collapsible>

              {/* Diagnosis Section */}
              <Collapsible 
                open={expandedSection === 'diagnosis'} 
                onOpenChange={() => toggleSection('diagnosis')}
                className="rounded-lg border p-4"
              >
                <div className="flex items-center justify-between">
                  <CollapsibleTrigger className="flex items-center gap-2">
                    {expandedSection === 'diagnosis' ? <ChevronUpIcon /> : <ChevronDownIcon />}
                    <h3 className="text-lg font-semibold">Diagnosis</h3>
                  </CollapsibleTrigger>
                  {hasSuggestions && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowDiagnosesDialog(true)}
                    >
                      View Suggestions
                    </Button>
                  )}
                </div>
                
                <CollapsibleContent className="mt-4">
                  <FormField
                    control={form.control}
                    name="diagnosis"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input {...field} placeholder="Enter diagnosis..." />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CollapsibleContent>
              </Collapsible>

              {/* Treatment Section */}
              <Collapsible 
                open={expandedSection === 'treatment'} 
                onOpenChange={() => toggleSection('treatment')}
                className="rounded-lg border p-4"
              >
                <div className="flex items-center justify-between">
                  <CollapsibleTrigger className="flex items-center gap-2">
                    {expandedSection === 'treatment' ? <ChevronUpIcon /> : <ChevronDownIcon />}
                    <h3 className="text-lg font-semibold">Treatment Plan</h3>
                  </CollapsibleTrigger>
                  {hasSuggestions && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleAddAllSuggested('treatments')}
                    >
                      Add All Suggested
                    </Button>
                  )}
                </div>
                
                <CollapsibleContent className="mt-4 space-y-4">
                  {hasSuggestions && (
                    <div className="bg-muted/50 rounded-lg p-3 max-h-[200px] overflow-y-auto">
                      <h4 className="text-sm font-medium mb-2 sticky top-0 bg-background py-1">
                        Suggested Treatments
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {suggestions.flatMap(treatment => 
                          treatment.suggestedTreatments.map((t, i) => (
                            <Badge 
                              key={`${treatment.symptom}-${i}`}
                              variant="secondary" 
                              className="cursor-pointer hover:bg-primary hover:text-primary-foreground flex items-center gap-1"
                              onClick={() => handleAddSuggestedItem('treatment', t)}
                            >
                              {t}
                              <PlusIcon className="h-3 w-3" />
                            </Badge>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    <Input
                      value={newTreatment}
                      onChange={(e) => setNewTreatment(e.target.value)}
                      placeholder="Enter treatment..."
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddItem('treatment'))}
                    />
                    <Button 
                      type="button" 
                      onClick={() => handleAddItem('treatment')}
                      variant="secondary"
                    >
                      <PlusIcon className="h-4 w-4 mr-1" />
                      Add
                    </Button>
                  </div>
                  
                  {form.watch('treatment').length > 0 && (
                    <div className="bg-muted/50 rounded-lg p-3">
                      <h4 className="text-sm font-medium mb-2">Current Treatment Plan</h4>
                      <ul className="space-y-2">
                        {form.watch('treatment').map((treatment, index) => (
                          <li key={index} className="flex items-center justify-between p-2 rounded hover:bg-muted">
                            <span className="truncate">{treatment}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveItem('treatment', index)}
                              className="text-red-500 hover:text-red-700 ml-2 shrink-0"
                              aria-label="Remove treatment"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CollapsibleContent>
              </Collapsible>

              {/* Medications Section */}
              <Collapsible 
                open={expandedSection === 'medications'} 
                onOpenChange={() => toggleSection('medications')}
                className="rounded-lg border p-4"
              >
                <div className="flex items-center justify-between">
                  <CollapsibleTrigger className="flex items-center gap-2">
                    {expandedSection === 'medications' ? <ChevronUpIcon /> : <ChevronDownIcon />}
                    <h3 className="text-lg font-semibold">Prescribed Medications</h3>
                  </CollapsibleTrigger>
                  {hasSuggestions && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleAddAllSuggested('medications')}
                    >
                      Add All Suggested
                    </Button>
                  )}
                </div>
                
                <CollapsibleContent className="mt-4 space-y-4">
                  {hasSuggestions && (
                    <div className="bg-muted/50 rounded-lg p-3 max-h-[200px] overflow-y-auto">
                      <h4 className="text-sm font-medium mb-2 sticky top-0 bg-background py-1">
                        Suggested Medications
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {suggestions.flatMap(treatment => 
                          treatment.suggestedMedications.map((med, i) => (
                            <Badge 
                              key={`med-${treatment.symptom}-${i}`}
                              variant="secondary" 
                              className="cursor-pointer hover:bg-primary hover:text-primary-foreground flex items-center gap-1"
                              onClick={() => handleAddSuggestedItem('medication', med)}
                            >
                              {med}
                              <PlusIcon className="h-3 w-3" />
                            </Badge>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    <Input
                      value={newMedication}
                      onChange={(e) => setNewMedication(e.target.value)}
                      placeholder="Enter medication..."
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddItem('medication'))}
                    />
                    <Button 
                      type="button" 
                      onClick={() => handleAddItem('medication')}
                      variant="secondary"
                    >
                      <PlusIcon className="h-4 w-4 mr-1" />
                      Add
                    </Button>
                  </div>
                  
                  {(form.watch('prescribedMedications') ?? []).length > 0 && (
                    <div className="bg-muted/50 rounded-lg p-3">
                      <h4 className="text-sm font-medium mb-2">Current Medications</h4>
                      <ul className="space-y-2">
                        {form.watch('prescribedMedications')?.map((medication, index) => (
                          <li key={index} className="flex items-center justify-between p-2 rounded hover:bg-muted">
                            <span className="truncate">{medication}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveItem('medication', index)}
                              className="text-red-500 hover:text-red-700 ml-2 shrink-0"
                              aria-label="Remove medication"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CollapsibleContent>
              </Collapsible>

              {/* Notes Section */}
              <Collapsible 
                open={expandedSection === 'notes'} 
                onOpenChange={() => toggleSection('notes')}
                className="rounded-lg border p-4"
              >
                <CollapsibleTrigger className="flex items-center gap-2 w-full">
                  {expandedSection === 'notes' ? <ChevronUpIcon /> : <ChevronDownIcon />}
                  <h3 className="text-lg font-semibold">Additional Notes</h3>
                </CollapsibleTrigger>
                
                <CollapsibleContent className="mt-4">
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            placeholder="Enter any additional notes..." 
                            className="min-h-[100px]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CollapsibleContent>
              </Collapsible>

              {/* Follow-up Date */}
              <Collapsible 
                open={expandedSection === 'followup'} 
                onOpenChange={() => toggleSection('followup')}
                className="rounded-lg border p-4"
              >
                <CollapsibleTrigger className="flex items-center gap-2 w-full">
                  {expandedSection === 'followup' ? <ChevronUpIcon /> : <ChevronDownIcon />}
                  <h3 className="text-lg font-semibold">Follow-up</h3>
                </CollapsibleTrigger>
                
                <CollapsibleContent className="mt-4">
                  <FormField
                    control={form.control}
                    name="followUpDate"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-4">
                        <FormLabel className="whitespace-nowrap">Follow-up Date:</FormLabel>
                        <FormControl>
                          <Input 
                            {...field}
                            type="date" 
                            className="w-[200px]"
                            min={new Date().toISOString().split('T')[0]}
                            value={field.value || ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CollapsibleContent>
              </Collapsible>

              {/* Recommended Tests */}
              {hasSuggestions && (
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold">Recommended Tests</h3>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowTestsDialog(true)}
                    >
                      View All Tests
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {uniqueTests.slice(0, 5).map((test, i) => (
                      <Badge key={i} variant="outline" className="text-sm">
                        {test}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </form>
          </Form>
        </ScrollArea>

        <div className="flex justify-end gap-4 p-4 border-t sticky bottom-0 bg-background z-10">
          <Button 
            type="button" 
            variant="outline"
            onClick={() => form.reset()}
          >
            Clear Form
          </Button>
          <Button 
            type="submit" 
            disabled={isLoading}
            className="min-w-[150px]"
            onClick={form.handleSubmit(handleSubmit)}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </span>
            ) : initialValues ? 'Update Record' : 'Save Medical Record'}
          </Button>
        </div>
      </div>

      {/* Diagnosis Suggestions Dialog */}
      <Dialog open={showDiagnosesDialog} onOpenChange={setShowDiagnosesDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Suggested Diagnoses</DialogTitle>
            <DialogDescription>
              Based on the entered symptoms: {form.watch('symptoms').join(', ')}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-2">
              {uniqueDiagnoses.map((diagnosis, i) => (
                <div 
                  key={i} 
                  className="p-3 border rounded hover:bg-accent cursor-pointer transition-colors"
                  onClick={() => handleSetDiagnosis(diagnosis)}
                >
                  <div className="font-medium">{diagnosis}</div>
                </div>
              ))}
            </div>
          </ScrollArea>
          <div className="flex justify-end pt-4">
            <Button 
              type="button"
              variant="outline"
              onClick={() => setShowDiagnosesDialog(false)}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Test Suggestions Dialog */}
      <Dialog open={showTestsDialog} onOpenChange={setShowTestsDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Recommended Diagnostic Tests</DialogTitle>
            <DialogDescription>
              Based on the entered symptoms: {form.watch('symptoms').join(', ')}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-4">
              {uniqueTests.map((test, i) => (
                <div key={i} className="p-3 border rounded">
                  <div className="font-medium">{test}</div>
                </div>
              ))}
            </div>
          </ScrollArea>
          <div className="flex justify-end pt-4">
            <Button 
              type="button"
              variant="outline"
              onClick={() => setShowTestsDialog(false)}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </DialogContent>
  );
}